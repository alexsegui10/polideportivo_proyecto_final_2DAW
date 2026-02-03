package com.emotivapoli.clase.presentation.router;

import com.emotivapoli.clase.presentation.controller.ClaseInscripcionController;
import com.emotivapoli.clase.presentation.schemas.request.ClaseInscripcionCreateRequest;
import com.emotivapoli.clase.presentation.schemas.response.ClaseInscripcionResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clase-inscripciones")
@Tag(name = "Clase Inscripciones", description = "Gestión de inscripciones a clases públicas")
public class ClaseInscripcionRouter {

    @Autowired
    private ClaseInscripcionController claseInscripcionController;

    @PostMapping
    @Operation(summary = "Inscribir usuario a clase", description = "Valida capacidad y duplicados")
    public ResponseEntity<ClaseInscripcionResponse> inscribirUsuario(@Valid @RequestBody ClaseInscripcionCreateRequest request) {
        ClaseInscripcionResponse inscripcion = claseInscripcionController.inscribirUsuario(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(inscripcion);
    }

    @GetMapping
    @Operation(summary = "Listar todas las inscripciones confirmadas")
    public ResponseEntity<List<ClaseInscripcionResponse>> getAllConfirmadas() {
        return ResponseEntity.ok(claseInscripcionController.getAllConfirmadas());
    }

    @GetMapping("/{uid}")
    @Operation(summary = "Obtener inscripción por UID")
    public ResponseEntity<ClaseInscripcionResponse> getInscripcionByUid(@PathVariable String uid) {
        return ResponseEntity.ok(claseInscripcionController.getInscripcionByUid(uid));
    }

    @GetMapping("/clase/{claseId}")
    @Operation(summary = "Listar inscritos en una clase")
    public ResponseEntity<List<ClaseInscripcionResponse>> getInscritosByClaseId(@PathVariable Long claseId) {
        return ResponseEntity.ok(claseInscripcionController.getInscritosByClaseId(claseId));
    }

    @GetMapping("/usuario/{usuarioId}")
    @Operation(summary = "Listar clases donde el usuario está inscrito")
    public ResponseEntity<List<ClaseInscripcionResponse>> getClasesByUsuarioId(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(claseInscripcionController.getClasesByUsuarioId(usuarioId));
    }

    @PatchMapping("/{uid}/cancelar")
    @Operation(summary = "Cancelar inscripción", description = "Auto-promociona waitlist si existe")
    public ResponseEntity<Void> cancelarInscripcion(
            @PathVariable String uid,
            @RequestParam(required = false) String cancelReason) {
        claseInscripcionController.cancelarInscripcion(uid, cancelReason);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{uid}")
    @Operation(summary = "Eliminar inscripción (admin)", description = "Auto-promociona waitlist")
    public ResponseEntity<Void> eliminarInscripcion(@PathVariable String uid) {
        claseInscripcionController.eliminarInscripcion(uid);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{uid}/asistencia")
    @Operation(summary = "Marcar asistencia", description = "Marca como asistió o ausente")
    public ResponseEntity<Void> marcarAsistencia(
            @PathVariable String uid,
            @RequestParam boolean asistio) {
        claseInscripcionController.marcarAsistencia(uid, asistio);
        return ResponseEntity.noContent().build();
    }
}
