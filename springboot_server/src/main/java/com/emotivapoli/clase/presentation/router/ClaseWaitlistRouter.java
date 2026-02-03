package com.emotivapoli.clase.presentation.router;

import com.emotivapoli.clase.presentation.controller.ClaseWaitlistController;
import com.emotivapoli.clase.presentation.schemas.request.ClaseWaitlistCreateRequest;
import com.emotivapoli.clase.presentation.schemas.response.ClaseWaitlistResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clase-waitlist")
@Tag(name = "Clase Waitlist", description = "Gestión de lista de espera para clases llenas")
public class ClaseWaitlistRouter {

    @Autowired
    private ClaseWaitlistController claseWaitlistController;

    @PostMapping
    @Operation(summary = "Añadir usuario a waitlist", description = "Valida duplicados y asigna posición automática")
    public ResponseEntity<ClaseWaitlistResponse> agregarAWaitlist(@Valid @RequestBody ClaseWaitlistCreateRequest request) {
        ClaseWaitlistResponse waitlist = claseWaitlistController.agregarAWaitlist(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(waitlist);
    }

    @GetMapping("/{uid}")
    @Operation(summary = "Obtener entrada de waitlist por UID")
    public ResponseEntity<ClaseWaitlistResponse> getWaitlistByUid(@PathVariable String uid) {
        return ResponseEntity.ok(claseWaitlistController.getWaitlistByUid(uid));
    }

    @GetMapping("/clase/{claseId}")
    @Operation(summary = "Listar waitlist de una clase ordenada por posición")
    public ResponseEntity<List<ClaseWaitlistResponse>> getWaitlistByClaseId(@PathVariable Long claseId) {
        return ResponseEntity.ok(claseWaitlistController.getWaitlistByClaseId(claseId));
    }

    @GetMapping("/usuario/{usuarioId}")
    @Operation(summary = "Listar waitlist donde el usuario está esperando")
    public ResponseEntity<List<ClaseWaitlistResponse>> getWaitlistByUsuarioId(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(claseWaitlistController.getWaitlistByUsuarioId(usuarioId));
    }

    @DeleteMapping("/{uid}")
    @Operation(summary = "Quitar usuario de waitlist", description = "Reordena posiciones automáticamente")
    public ResponseEntity<Void> quitarDeWaitlist(@PathVariable String uid) {
        claseWaitlistController.quitarDeWaitlist(uid);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/clase/{claseId}/promover")
    @Operation(summary = "Promocionar primero en cola (manual)", description = "Normalmente se llama automáticamente")
    public ResponseEntity<Void> promoverPrimeroEnCola(@PathVariable Long claseId) {
        claseWaitlistController.promoverPrimeroEnCola(claseId);
        return ResponseEntity.noContent().build();
    }
}
