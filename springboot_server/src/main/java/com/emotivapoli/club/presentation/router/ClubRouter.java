package com.emotivapoli.club.presentation.router;

import com.emotivapoli.club.presentation.controller.ClubController;
import com.emotivapoli.club.presentation.schemas.request.ClubCreateRequest;
import com.emotivapoli.club.presentation.schemas.request.ClubUpdateRequest;
import com.emotivapoli.club.presentation.schemas.response.ClubResponse;
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
@RequestMapping("/api/clubs")
@Tag(name = "Clubs", description = "Gestión de clubs")
public class ClubRouter {

    @Autowired
    private ClubController clubController;

    // GET
    @GetMapping
    @Operation(summary = "Listar")
    public ResponseEntity<List<ClubResponse>> getAllClubs() {
        return ResponseEntity.ok(clubController.getAllClubs());
    }

    // GET por slug
    @GetMapping("/{slug}")
    @Operation(summary = "Por slug")
    public ResponseEntity<ClubResponse> getClub(@PathVariable String slug) {
        return ResponseEntity.ok(clubController.getClubBySlug(slug));
    }

    // POST
    @PostMapping
    @Operation(summary = "Crear")
    public ResponseEntity<ClubResponse> createClub(@RequestBody ClubCreateRequest request) {
        ClubResponse nuevoClub = clubController.createClub(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoClub);
    }

    // PUT
    @PutMapping("/{slug}")
    @Operation(summary = "Actualizar")
    public ResponseEntity<ClubResponse> updateClub(
            @PathVariable String slug,
            @RequestBody ClubUpdateRequest request) {
        ClubResponse updated = clubController.updateClubBySlug(slug, request);
        return ResponseEntity.ok(updated);
    }

    // PATCH soft delete
    @PatchMapping("/{slug}/soft-delete")
    @Operation(summary = "Eliminar")
    public ResponseEntity<Void> deleteClub(@PathVariable String slug) {
        clubController.deleteClubBySlug(slug);
        return ResponseEntity.noContent().build();
    }
}
