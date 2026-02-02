package com.emotivapoli.reserva.application.service;

import com.emotivapoli.club.domain.entity.Club;
import com.emotivapoli.club.infrastructure.repository.ClubRepository;
import com.emotivapoli.clase.domain.entity.ClasePublica;
import com.emotivapoli.clase.infrastructure.repository.ClasePublicaRepository;
import com.emotivapoli.pago.domain.entity.Pago;
import com.emotivapoli.pago.infrastructure.repository.PagoRepository;
import com.emotivapoli.pista.domain.entity.Pista;
import com.emotivapoli.pista.infrastructure.repository.PistaRepository;
import com.emotivapoli.reserva.application.mapper.ReservaMapper;
import com.emotivapoli.reserva.domain.dto.ReservaDTO;
import com.emotivapoli.reserva.domain.entity.Reserva;
import com.emotivapoli.reserva.infrastructure.repository.ReservaRepository;
import com.emotivapoli.reserva.presentation.schemas.response.ReservaWithPagoResponse;
import com.emotivapoli.usuario.domain.entity.Usuario;
import com.emotivapoli.usuario.infrastructure.repository.UsuarioRepository;
import com.emotivapoli.utils.SlugUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private PistaRepository pistaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private PagoRepository pagoRepository;

    @Autowired
    private ReservaMapper reservaMapper;

    @Autowired
    private ClasePublicaRepository claseRepository;

    /**
     * Valida que no haya conflictos de horario con clases u otras reservas
     */
    private void validarConflictos(LocalDateTime inicio, LocalDateTime fin, Long pistaId, Long reservaIdActual) {
        // Verificar conflictos con clases
        List<ClasePublica> clasesConflict = claseRepository.findAll().stream()
                .filter(c -> c.getIsActive() && c.getPista().getId().equals(pistaId))
                .filter(c -> hayConflictoHorario(inicio, fin, c.getFechaHoraInicio(), c.getFechaHoraFin()))
                .collect(Collectors.toList());

        if (!clasesConflict.isEmpty()) {
            throw new RuntimeException("Conflicto de horario: ya existe una clase en esta pista");
        }

        // Verificar conflictos con otras reservas
        List<Reserva> reservasConflict = reservaRepository.findAll().stream()
                .filter(r -> r.getIsActive() && r.getPista().getId().equals(pistaId))
                .filter(r -> reservaIdActual == null || !r.getId().equals(reservaIdActual))
                .filter(r -> hayConflictoHorario(inicio, fin, r.getFechaHoraInicio(), r.getFechaHoraFin()))
                .collect(Collectors.toList());

        if (!reservasConflict.isEmpty()) {
            throw new RuntimeException("Conflicto de horario: ya existe otra reserva en esta pista");
        }
    }

    /**
     * Detecta si dos rangos de fechas se solapan
     */
    private boolean hayConflictoHorario(LocalDateTime inicio1, LocalDateTime fin1,
            LocalDateTime inicio2, LocalDateTime fin2) {
        return (inicio1.isBefore(fin2) && fin1.isAfter(inicio2));
    }

    // Crear
    @Transactional
    public ReservaDTO createReserva(ReservaDTO reservaDTO) {
        // Generar slug
        String slug = SlugUtils.generateSlug("reserva", String.valueOf(System.currentTimeMillis()));

        reservaDTO.setSlug(slug);
        reservaDTO.setUid(UUID.randomUUID());

        Reserva reserva = reservaMapper.toEntity(reservaDTO);

        // Asociar pista
        Pista pista = pistaRepository.findById(reservaDTO.getPistaId())
                .orElseThrow(() -> new RuntimeException("Pista no encontrada"));
        reserva.setPista(pista);

        // Asociar usuario
        Usuario usuario = usuarioRepository.findById(reservaDTO.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        reserva.setUsuario(usuario);

        // Asociar club si existe
        if (reservaDTO.getClubId() != null) {
            Club club = clubRepository.findById(reservaDTO.getClubId())
                    .orElseThrow(() -> new RuntimeException("Club no encontrado"));
            reserva.setClub(club);
        }

        // VALIDAR CONFLICTOS DE HORARIO
        validarConflictos(reservaDTO.getFechaHoraInicio(), reservaDTO.getFechaHoraFin(),
                reservaDTO.getPistaId(), null);

        reserva.setCreatedAt(LocalDateTime.now());
        reserva.setUpdatedAt(LocalDateTime.now());

        Reserva saved = reservaRepository.save(reserva);
        return reservaMapper.toDTO(saved);
    }

    // Listar
    public List<ReservaDTO> getAllReservas() {
        return reservaRepository.findActivas().stream()
                .map(reservaMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Por ID
    public ReservaDTO getReservaById(Long id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
        return reservaMapper.toDTO(reserva);
    }

    // Por slug (con JOIN a pago)
    public ReservaWithPagoResponse getReservaBySlugWithPago(String slug) {
        Reserva reserva = reservaRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con slug: " + slug));

        ReservaWithPagoResponse response = new ReservaWithPagoResponse();
        response.setId(reserva.getId());
        response.setUid(reserva.getUid());
        response.setSlug(reserva.getSlug());
        response.setPistaId(reserva.getPista().getId());
        response.setPistaNombre(reserva.getPista().getNombre());
        response.setUsuarioId(reserva.getUsuario().getId());
        response.setUsuarioNombre(reserva.getUsuario().getNombre() + " " + reserva.getUsuario().getApellidos());
        response.setClubId(reserva.getClub() != null ? reserva.getClub().getId() : null);
        response.setFechaHoraInicio(reserva.getFechaHoraInicio());
        response.setFechaHoraFin(reserva.getFechaHoraFin());
        response.setPrecio(reserva.getPrecio());
        response.setMetodoPago(reserva.getMetodoPago());
        response.setStatus(reserva.getStatus());
        response.setIsActive(reserva.getIsActive());
        response.setNotas(reserva.getNotas());
        response.setTipoReserva(reserva.getTipoReserva());
        response.setCreatedAt(reserva.getCreatedAt());
        response.setUpdatedAt(reserva.getUpdatedAt());

        // JOIN: Buscar pago asociado
        List<Pago> pagos = pagoRepository.findAll().stream()
                .filter(p -> p.getReserva() != null && p.getReserva().getId().equals(reserva.getId()))
                .collect(Collectors.toList());

        if (!pagos.isEmpty()) {
            Pago pago = pagos.get(0);
            response.setPagoId(pago.getId());
            response.setPagoAmount(pago.getAmount());
            response.setPagoStatus(pago.getStatus());
            response.setPagoProvider(pago.getProvider());
        }

        return response;
    }

    // Actualizar
    @Transactional
    public ReservaDTO updateReserva(Long id, ReservaDTO reservaDTO) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        reserva.setFechaHoraInicio(reservaDTO.getFechaHoraInicio());
        reserva.setFechaHoraFin(reservaDTO.getFechaHoraFin());
        reserva.setPrecio(reservaDTO.getPrecio());
        reserva.setMetodoPago(reservaDTO.getMetodoPago());
        reserva.setStatus(reservaDTO.getStatus());
        reserva.setIsActive(reservaDTO.getIsActive());
        reserva.setNotas(reservaDTO.getNotas());
        reserva.setTipoReserva(reservaDTO.getTipoReserva());

        if (reservaDTO.getPistaId() != null) {
            Pista pista = pistaRepository.findById(reservaDTO.getPistaId())
                    .orElseThrow(() -> new RuntimeException("Pista no encontrada"));
            reserva.setPista(pista);
        }

        if (reservaDTO.getClubId() != null) {
            Club club = clubRepository.findById(reservaDTO.getClubId())
                    .orElseThrow(() -> new RuntimeException("Club no encontrado"));
            reserva.setClub(club);
        }

        // VALIDAR CONFLICTOS DE HORARIO (excluyendo esta misma reserva)
        validarConflictos(reservaDTO.getFechaHoraInicio(), reservaDTO.getFechaHoraFin(),
                reservaDTO.getPistaId(), id);

        reserva.setUpdatedAt(LocalDateTime.now());

        Reserva updated = reservaRepository.save(reserva);
        return reservaMapper.toDTO(updated);
    }

    // Soft delete
    @Transactional
    public void deleteReserva(Long id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        reserva.setStatus("eliminado");
        reserva.setIsActive(false);
        reserva.setUpdatedAt(LocalDateTime.now());

        reservaRepository.save(reserva);
    }
}
