package com.emotivapoli.pago.application.service;

import com.emotivapoli.pago.application.mapper.PagoMapper;
import com.emotivapoli.pago.domain.dto.PagoDTO;
import com.emotivapoli.pago.domain.entity.Pago;
import com.emotivapoli.pago.infrastructure.repository.PagoRepository;
import com.emotivapoli.pago.presentation.schemas.request.CreatePaymentIntentRequest;
import com.emotivapoli.pago.presentation.schemas.response.PaymentIntentResponse;
import com.emotivapoli.pista.domain.entity.Pista;
import com.emotivapoli.pista.infrastructure.repository.PistaRepository;
import com.emotivapoli.reserva.domain.entity.Reserva;
import com.emotivapoli.reserva.infrastructure.repository.ReservaRepository;
import com.emotivapoli.usuario.domain.entity.Usuario;
import com.emotivapoli.usuario.infrastructure.repository.UsuarioRepository;
import com.emotivapoli.utils.SlugUtils;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PagoService {

    @Autowired
    private PagoRepository pagoRepository;

    @Autowired
    private PagoMapper pagoMapper;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PistaRepository pistaRepository;

    @Autowired
    private ReservaRepository reservaRepository;

    // Listar
    public List<PagoDTO> getAllPagos() {
        return pagoRepository.findAll().stream()
                .map(pagoMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Por ID
    public PagoDTO getPagoById(Long id) {
        Pago pago = pagoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado con ID: " + id));
        return pagoMapper.toDTO(pago);
    }

    // Por usuario
    public List<PagoDTO> getPagosByUsuarioId(Long usuarioId) {
        return pagoRepository.findByUsuarioId(usuarioId).stream()
                .map(pagoMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Mis pagos (usuario autenticado desde JWT)
    public List<PagoDTO> getMisPagos() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con email: " + email));

        return pagoRepository.findByUsuarioId(usuario.getId()).stream()
                .map(pagoMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Crea una reserva PENDIENTE + un pago PENDIENTE + un Stripe PaymentIntent.
     * Usa SERIALIZABLE para evitar dobles reservas bajo concurrencia.
     * El pago solo se confirma cuando Stripe llama al webhook /stripe/webhook.
     */
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public PaymentIntentResponse createPaymentIntent(CreatePaymentIntentRequest request) {
        // 1. Cargar clave Stripe
        Dotenv dotenv = Dotenv.configure().directory("./").ignoreIfMissing().load();
        Stripe.apiKey = dotenv.get("STRIPE_SECRET_KEY", "");

        // 2. Validar pista
        Pista pista = pistaRepository.findById(request.getPistaId())
                .orElseThrow(() -> new RuntimeException("Pista no encontrada"));
        if (!pista.getIsActive()) {
            throw new RuntimeException("La pista no está disponible");
        }

        // 3. Validar usuario
        Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 4. Parsear fechas
        LocalDateTime inicio = LocalDateTime.parse(request.getFechaHoraInicio());
        LocalDateTime fin    = LocalDateTime.parse(request.getFechaHoraFin());

        if (inicio.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("No se pueden hacer reservas en fechas pasadas");
        }
        if (!fin.isAfter(inicio)) {
            throw new RuntimeException("La hora de fin debe ser posterior a la de inicio");
        }

        // 5. Comprobar conflictos (SERIALIZABLE garantiza que no hay race condition)
        boolean conflicto = reservaRepository.findAll().stream()
                .anyMatch(r -> r.getIsActive()
                        && r.getPista().getId().equals(pista.getId())
                        && !"cancelada".equals(r.getStatus())
                        && !"eliminado".equals(r.getStatus())
                        && inicio.isBefore(r.getFechaHoraFin())
                        && fin.isAfter(r.getFechaHoraInicio()));

        if (conflicto) {
            throw new RuntimeException("Horario no disponible: ya existe una reserva en esa franja horaria");
        }

        // 6. Crear Reserva PENDIENTE
        Reserva reserva = new Reserva();
        reserva.setUid(UUID.randomUUID());
        reserva.setSlug(SlugUtils.generateSlug("reserva", String.valueOf(System.currentTimeMillis())));
        reserva.setPista(pista);
        reserva.setUsuario(usuario);
        reserva.setFechaHoraInicio(inicio);
        reserva.setFechaHoraFin(fin);
        reserva.setPrecio(request.getPrecio());
        reserva.setMetodoPago("stripe");
        reserva.setStatus("pendiente");
        reserva.setTipoReserva("individual");
        reserva.setIsActive(true);
        reserva.setCreatedAt(LocalDateTime.now());
        reserva.setUpdatedAt(LocalDateTime.now());
        Reserva reservaGuardada = reservaRepository.save(reserva);

        // 7. Crear Pago PENDIENTE
        Pago pago = new Pago();
        pago.setUid(UUID.randomUUID());
        pago.setUsuario(usuario);
        pago.setReserva(reservaGuardada);
        pago.setAmount(request.getPrecio());
        pago.setCurrency("EUR");
        pago.setProvider("stripe");
        pago.setStatus("pendiente");
        pago.setIsActive(true);
        pago.setCreatedAt(LocalDateTime.now());
        pago.setUpdatedAt(LocalDateTime.now());
        Pago pagoGuardado = pagoRepository.save(pago);

        // 8. Crear Stripe PaymentIntent (dentro de la TX para hacer rollback si falla)
        try {
            long amountCentimos = request.getPrecio()
                    .multiply(new BigDecimal("100"))
                    .longValue();

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amountCentimos)
                    .setCurrency("eur")
                    .putMetadata("reservaId", reservaGuardada.getId().toString())
                    .putMetadata("pagoId",    pagoGuardado.getId().toString())
                    .build();

            PaymentIntent pi = PaymentIntent.create(params);

            // 9. Guardar ID del PaymentIntent para idempotencia en el webhook
            pagoGuardado.setStripePaymentIntentId(pi.getId());
            pagoRepository.save(pagoGuardado);

            return new PaymentIntentResponse(pi.getClientSecret(), reservaGuardada.getId(), pagoGuardado.getId());

        } catch (StripeException e) {
            throw new RuntimeException("Error al crear el pago en Stripe: " + e.getMessage());
        }
    }
}
