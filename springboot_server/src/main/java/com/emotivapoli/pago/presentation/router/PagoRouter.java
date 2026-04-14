package com.emotivapoli.pago.presentation.router;

import com.emotivapoli.pago.presentation.controller.PagoController;
import com.emotivapoli.pago.presentation.schemas.request.CreatePaymentIntentRequest;
import com.emotivapoli.pago.presentation.schemas.response.PagoResponse;
import com.emotivapoli.pago.presentation.schemas.response.PaymentIntentResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pagos")
@Tag(name = "Pagos", description = "Gestión de pagos y PaymentIntents de Stripe")
public class PagoRouter {

    @Autowired
    private PagoController pagoController;

    @GetMapping
    @Operation(summary = "Listar todos los pagos (solo admin)")
    public ResponseEntity<List<PagoResponse>> getAllPagos() {
        return ResponseEntity.ok(pagoController.getAllPagos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Por ID")
    public ResponseEntity<PagoResponse> getPago(@PathVariable Long id) {
        return ResponseEntity.ok(pagoController.getPagoById(id));
    }

    @GetMapping("/usuario/{usuarioId}")
    @Operation(summary = "Por usuario (solo admin)")
    public ResponseEntity<List<PagoResponse>> getPagosByUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(pagoController.getPagosByUsuarioId(usuarioId));
    }

    @GetMapping("/mis-pagos")
    @Operation(summary = "Mis pagos (usuario autenticado)")
    public ResponseEntity<List<PagoResponse>> getMisPagos() {
        return ResponseEntity.ok(pagoController.getMisPagos());
    }

    /**
     * Crea reserva PENDIENTE + pago PENDIENTE + Stripe PaymentIntent.
     * El frontend usa el clientSecret para confirmar el pago con Stripe.js.
     * La reserva se confirma cuando Stripe llama al webhook /stripe/webhook.
     */
    @PostMapping("/create-payment-intent")
    @Operation(summary = "Iniciar pago de reserva de pista con Stripe")
    public ResponseEntity<?> createPaymentIntent(@Valid @RequestBody CreatePaymentIntentRequest request) {
        try {
            PaymentIntentResponse response = pagoController.createPaymentIntent(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg != null && msg.contains("Horario no disponible")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", msg));
            }
            if (msg != null && (msg.contains("pasadas") || msg.contains("posterior"))) {
                return ResponseEntity.badRequest().body(Map.of("error", msg));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", msg));
        }
    }
}
