package com.emotivapoli.stripe;

import com.emotivapoli.pago.domain.entity.Pago;
import com.emotivapoli.pago.infrastructure.repository.PagoRepository;
import com.emotivapoli.reserva.domain.entity.Reserva;
import com.emotivapoli.reserva.infrastructure.repository.ReservaRepository;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import io.github.cdimascio.dotenv.Dotenv;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Webhook de Stripe - confirmación real de pagos.
 * Ruta fuera de /api para recibir el body crudo (necesario para verificar firma).
 *
 * Flujo:
 *   1. Frontend confirma pago con stripe.confirmCardPayment(clientSecret)
 *   2. Stripe llama a este endpoint con event payment_intent.succeeded
 *   3. Aquí se actualiza pago → completado y reserva → confirmada
 *
 * Idempotencia garantizada por:
 *   - stripe_payment_intent_id UNIQUE en pagos
 *   - Guard: si pago ya está completado, se ignora el evento
 */
@RestController
@Tag(name = "Stripe Webhook", description = "Endpoint de confirmación de pagos Stripe")
public class StripeWebhookRouter {

    @Autowired
    private PagoRepository pagoRepository;

    @Autowired
    private ReservaRepository reservaRepository;

    @PostMapping("/stripe/webhook")
    @Operation(summary = "Webhook Stripe - confirma reservas tras pago exitoso")
    @Transactional
    public ResponseEntity<String> handleWebhook(
            HttpServletRequest request,
            @RequestHeader(value = "Stripe-Signature", required = false) String sigHeader
    ) throws IOException {

        // Leer body crudo como String (necesario para verificar firma de Stripe)
        String payload = new String(request.getInputStream().readAllBytes(), java.nio.charset.StandardCharsets.UTF_8);

        // Cargar secreto del webhook desde .env
        Dotenv dotenv = Dotenv.configure().directory("./").ignoreIfMissing().load();
        String webhookSecret = dotenv.get("STRIPE_WEBHOOK_SECRET", "");

        // Verificar firma
        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            System.err.println("Webhook Stripe: firma inválida - " + e.getMessage());
            return ResponseEntity.badRequest().body("Firma inválida");
        } catch (Exception e) {
            System.err.println("Webhook Stripe: error al parsear evento - " + e.getMessage());
            return ResponseEntity.badRequest().body("Error al procesar evento");
        }

        // Solo procesamos pagos exitosos
        if (!"payment_intent.succeeded".equals(event.getType())) {
            return ResponseEntity.ok("Evento ignorado: " + event.getType());
        }

        // Deserializar el PaymentIntent del evento
        EventDataObjectDeserializer deser = event.getDataObjectDeserializer();
        if (deser.getObject().isEmpty()) {
            System.err.println("Webhook Stripe: no se pudo deserializar el PaymentIntent");
            return ResponseEntity.ok("OK");
        }

        PaymentIntent pi = (PaymentIntent) deser.getObject().get();
        String stripePaymentIntentId = pi.getId();

        // Buscar pago por stripe_payment_intent_id
        Optional<Pago> optPago = pagoRepository.findByStripePaymentIntentId(stripePaymentIntentId);
        if (optPago.isEmpty()) {
            System.err.println("Webhook Stripe: pago no encontrado para PI: " + stripePaymentIntentId);
            return ResponseEntity.ok("OK");
        }

        Pago pago = optPago.get();

        // IDEMPOTENCIA: si ya está completado, ignorar (reintento de Stripe)
        if ("completado".equals(pago.getStatus())) {
            System.out.println("Webhook Stripe: pago ya procesado (idempotente) - " + stripePaymentIntentId);
            return ResponseEntity.ok("OK");
        }

        // Marcar pago como completado
        pago.setStatus("completado");
        pago.setProviderPaymentId(pi.getId());
        pago.setUpdatedAt(LocalDateTime.now());
        pagoRepository.save(pago);

        // Confirmar reserva asociada
        if (pago.getReserva() != null) {
            Reserva reserva = pago.getReserva();
            reserva.setStatus("confirmada");
            reserva.setUpdatedAt(LocalDateTime.now());
            reservaRepository.save(reserva);
            System.out.println("Reserva confirmada: " + reserva.getId() + " | PI: " + stripePaymentIntentId);
        }

        System.out.println("Pago procesado correctamente (idempotente): " + stripePaymentIntentId);
        return ResponseEntity.ok("OK");
    }
}
