package com.emotivapoli.reserva.presentation.router;

import com.emotivapoli.reserva.presentation.controller.ReservaController;
import com.emotivapoli.reserva.presentation.schemas.request.ReservaCreateRequest;
import com.emotivapoli.reserva.presentation.schemas.request.ReservaUpdateRequest;
import com.emotivapoli.reserva.presentation.schemas.response.ReservaResponse;
import com.emotivapoli.reserva.presentation.schemas.response.ReservaWithPagoResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Router
 */
@RestController
@RequestMapping("/api/reservas")
@Tag(name = "Reservas", description = "Gestión de reservas")
public class ReservaRouter {

    @Autowired
    private ReservaController reservaController;

    // GET
    @GetMapping
    @Operation(summary = "Listar")
    public ResponseEntity<List<ReservaResponse>> getAllReservas() {
        return ResponseEntity.ok(reservaController.getAllReservas());
    }

    // GET por slug (incluye pago)
    @GetMapping("/{slug}")
    @Operation(summary = "Por slug (con pago)")
    public ResponseEntity<ReservaWithPagoResponse> getReserva(@PathVariable String slug) {
        return ResponseEntity.ok(reservaController.getReservaBySlug(slug));
    }

    // POST
    @PostMapping
    @Operation(summary = "Crear")
    public ResponseEntity<ReservaResponse> createReserva(@RequestBody ReservaCreateRequest request) {
        ReservaResponse nuevaReserva = reservaController.createReserva(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaReserva);
    }

    // PUT
    @PutMapping("/{slug}")
    @Operation(summary = "Actualizar")
    public ResponseEntity<ReservaResponse> updateReserva(
            @PathVariable String slug,
            @RequestBody ReservaUpdateRequest request) {
        ReservaResponse updated = reservaController.updateReservaBySlug(slug, request);
        return ResponseEntity.ok(updated);
    }

    // PATCH soft delete
    @PatchMapping("/{slug}/soft-delete")
    @Operation(summary = "Eliminar")
    public ResponseEntity<Void> deleteReserva(@PathVariable String slug) {
        reservaController.deleteReservaBySlug(slug);
        return ResponseEntity.noContent().build();
    }
}
