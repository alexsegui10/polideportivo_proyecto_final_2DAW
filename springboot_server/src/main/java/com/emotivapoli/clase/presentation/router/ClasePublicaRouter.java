package com.emotivapoli.clase.presentation.router;

import com.emotivapoli.clase.presentation.controller.ClasePublicaController;
import com.emotivapoli.clase.presentation.schemas.request.ClaseCreateRequest;
import com.emotivapoli.clase.presentation.schemas.request.ClaseUpdateRequest;
import com.emotivapoli.clase.presentation.schemas.response.ClaseResponse;
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
@RequestMapping("/api/clases")
@Tag(name = "Clases", description = "Gestión de clases públicas")
public class ClasePublicaRouter {

    @Autowired
    private ClasePublicaController claseController;

    // GET
    @GetMapping
    @Operation(summary = "Listar")
    public ResponseEntity<List<ClaseResponse>> getAllClases() {
        return ResponseEntity.ok(claseController.getAllClases());
    }

    // GET por slug
    @GetMapping("/{slug}")
    @Operation(summary = "Por slug")
    public ResponseEntity<ClaseResponse> getClase(@PathVariable String slug) {
        return ResponseEntity.ok(claseController.getClaseBySlug(slug));
    }

    // POST
    @PostMapping
    @Operation(summary = "Crear")
    public ResponseEntity<ClaseResponse> createClase(@RequestBody ClaseCreateRequest request) {
        ClaseResponse nuevaClase = claseController.createClase(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaClase);
    }

    // PUT
    @PutMapping("/{slug}")
    @Operation(summary = "Actualizar")
    public ResponseEntity<ClaseResponse> updateClase(
            @PathVariable String slug,
            @RequestBody ClaseUpdateRequest request) {
        ClaseResponse updated = claseController.updateClaseBySlug(slug, request);
        return ResponseEntity.ok(updated);
    }

    // PATCH soft delete
    @PatchMapping("/{slug}/soft-delete")
    @Operation(summary = "Eliminar")
    public ResponseEntity<Void> deleteClase(@PathVariable String slug) {
        claseController.deleteClaseBySlug(slug);
        return ResponseEntity.noContent().build();
    }
}
