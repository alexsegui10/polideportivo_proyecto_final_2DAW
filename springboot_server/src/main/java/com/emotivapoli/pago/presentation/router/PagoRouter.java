package com.emotivapoli.pago.presentation.router;

import com.emotivapoli.pago.presentation.controller.PagoController;
import com.emotivapoli.pago.presentation.schemas.response.PagoResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Router
 */
@RestController
@RequestMapping("/api/pagos")
@Tag(name = "Pagos", description = "Solo lectura")
public class PagoRouter {

    @Autowired
    private PagoController pagoController;

    // GET
    @GetMapping
    @Operation(summary = "Listar")
    public ResponseEntity<List<PagoResponse>> getAllPagos() {
        return ResponseEntity.ok(pagoController.getAllPagos());
    }

    // GET por ID
    @GetMapping("/{id}")
    @Operation(summary = "Por ID")
    public ResponseEntity<PagoResponse> getPago(@PathVariable Long id) {
        return ResponseEntity.ok(pagoController.getPagoById(id));
    }

    // GET por usuario (solo admin)
    @GetMapping("/usuario/{usuarioId}")
    @Operation(summary = "Por usuario (solo admin)")
    public ResponseEntity<List<PagoResponse>> getPagosByUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(pagoController.getPagosByUsuarioId(usuarioId));
    }

    // GET mis pagos (usuario autenticado)
    @GetMapping("/mis-pagos")
    @Operation(summary = "Obtener mis pagos (usuario autenticado)")
    public ResponseEntity<List<PagoResponse>> getMisPagos() {
        return ResponseEntity.ok(pagoController.getMisPagos());
    }
}
