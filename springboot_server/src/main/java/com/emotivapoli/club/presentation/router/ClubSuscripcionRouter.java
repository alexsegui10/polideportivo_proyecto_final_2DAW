package com.emotivapoli.club.presentation.router;

import com.emotivapoli.club.presentation.controller.ClubSuscripcionController;
import com.emotivapoli.club.presentation.schemas.request.ClubSuscripcionCreateRequest;
import com.emotivapoli.club.presentation.schemas.response.ClubSuscripcionResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Router REST para gestión de suscripciones mensuales de clubs
 */
@RestController
@RequestMapping("/api/club-suscripciones")
@Tag(name = "Club Suscripciones", description = "Gestión de suscripciones mensuales y cobros recurrentes")
public class ClubSuscripcionRouter {

    @Autowired
    private ClubSuscripcionController clubSuscripcionController;

    /**
     * POST /api/club-suscripciones - Crear suscripción mensual
     */
    @PostMapping
    @Operation(summary = "Crear suscripción mensual para un miembro", description = "Valida que el miembro esté activo y no tenga suscripción activa")
    public ResponseEntity<ClubSuscripcionResponse> crearSuscripcion(@Valid @RequestBody ClubSuscripcionCreateRequest request) {
        ClubSuscripcionResponse suscripcion = clubSuscripcionController.crearSuscripcion(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(suscripcion);
    }

    /**
     * GET /api/club-suscripciones - Listar todas las suscripciones activas
     */
    @GetMapping
    @Operation(summary = "Listar todas las suscripciones activas")
    public ResponseEntity<List<ClubSuscripcionResponse>> getAllSuscripcionesActivas() {
        return ResponseEntity.ok(clubSuscripcionController.getAllSuscripcionesActivas());
    }

    /**
     * GET /api/club-suscripciones/{uid} - Obtener suscripción por UID
     */
    @GetMapping("/{uid}")
    @Operation(summary = "Obtener suscripción por UID")
    public ResponseEntity<ClubSuscripcionResponse> getSuscripcionByUid(@PathVariable String uid) {
        return ResponseEntity.ok(clubSuscripcionController.getSuscripcionByUid(uid));
    }

    /**
     * GET /api/club-suscripciones/miembro/{miembroUid} - Listar suscripciones de un miembro
     */
    @GetMapping("/miembro/{miembroUid}")
    @Operation(summary = "Listar todas las suscripciones de un miembro (historial completo)")
    public ResponseEntity<List<ClubSuscripcionResponse>> getSuscripcionesByMiembroUid(@PathVariable String miembroUid) {
        return ResponseEntity.ok(clubSuscripcionController.getSuscripcionesByMiembroUid(miembroUid));
    }

    /**
     * GET /api/club-suscripciones/club/{clubId} - Listar suscripciones de un club
     */
    @GetMapping("/club/{clubId}")
    @Operation(summary = "Listar todas las suscripciones de un club")
    public ResponseEntity<List<ClubSuscripcionResponse>> getSuscripcionesByClubId(@PathVariable Long clubId) {
        return ResponseEntity.ok(clubSuscripcionController.getSuscripcionesByClubId(clubId));
    }

    /**
     * GET /api/club-suscripciones/pendientes-cobro - Suscripciones pendientes de cobro (cron job)
     */
    @GetMapping("/pendientes-cobro")
    @Operation(summary = "Obtener suscripciones pendientes de cobro", description = "Para procesamiento de cobros mensuales automáticos")
    public ResponseEntity<List<ClubSuscripcionResponse>> getSuscripcionesPendientesCobro(
            @RequestParam(required = false) String fecha) {
        return ResponseEntity.ok(clubSuscripcionController.getSuscripcionesPendientesCobro(fecha));
    }

    /**
     * GET /api/club-suscripciones/impagos-retryables - Suscripciones con impago para reintentar
     */
    @GetMapping("/impagos-retryables")
    @Operation(summary = "Obtener suscripciones con impago para reintentar", description = "Impagos con menos de 3 intentos")
    public ResponseEntity<List<ClubSuscripcionResponse>> getSuscripcionesImpagosRetryables() {
        return ResponseEntity.ok(clubSuscripcionController.getSuscripcionesImpagosRetryables());
    }

    /**
     * PATCH /api/club-suscripciones/{uid}/cancelar - Cancelar suscripción
     */
    @PatchMapping("/{uid}/cancelar")
    @Operation(summary = "Cancelar suscripción", description = "Marca como cancelada y establece fecha fin")
    public ResponseEntity<Void> cancelarSuscripcion(@PathVariable String uid) {
        clubSuscripcionController.cancelarSuscripcion(uid);
        return ResponseEntity.noContent().build();
    }

    /**
     * PATCH /api/club-suscripciones/{uid}/pausar - Pausar suscripción
     */
    @PatchMapping("/{uid}/pausar")
    @Operation(summary = "Pausar suscripción activa", description = "Solo suscripciones activas pueden pausarse")
    public ResponseEntity<Void> pausarSuscripcion(@PathVariable String uid) {
        clubSuscripcionController.pausarSuscripcion(uid);
        return ResponseEntity.noContent().build();
    }

    /**
     * PATCH /api/club-suscripciones/{uid}/reanudar - Reanudar suscripción pausada
     */
    @PatchMapping("/{uid}/reanudar")
    @Operation(summary = "Reanudar suscripción pausada", description = "Reactiva y programa próximo cobro")
    public ResponseEntity<Void> reanudarSuscripcion(@PathVariable String uid) {
        clubSuscripcionController.reanudarSuscripcion(uid);
        return ResponseEntity.noContent().build();
    }

    /**
     * POST /api/club-suscripciones/{uid}/cobro-exitoso - Webhook Stripe: cobro exitoso
     */
    @PostMapping("/{uid}/cobro-exitoso")
    @Operation(summary = "Registrar cobro exitoso (webhook Stripe)", description = "Actualiza próximo cobro y resetea intentos")
    public ResponseEntity<Void> registrarCobroExitoso(
            @PathVariable String uid,
            @RequestParam(required = false) Long pagoId) {
        clubSuscripcionController.registrarCobroExitoso(uid, pagoId);
        return ResponseEntity.noContent().build();
    }

    /**
     * POST /api/club-suscripciones/{uid}/cobro-fallido - Webhook Stripe: cobro fallido
     */
    @PostMapping("/{uid}/cobro-fallido")
    @Operation(summary = "Registrar cobro fallido (webhook Stripe)", description = "Incrementa intentos, marca impago si >= 3")
    public ResponseEntity<Void> registrarCobroFallido(@PathVariable String uid) {
        clubSuscripcionController.registrarCobroFallido(uid);
        return ResponseEntity.noContent().build();
    }
}
