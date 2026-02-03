package com.emotivapoli.club.presentation.router;

import com.emotivapoli.club.presentation.controller.ClubMiembroController;
import com.emotivapoli.club.presentation.schemas.request.ClubMiembroCreateRequest;
import com.emotivapoli.club.presentation.schemas.response.ClubMiembroResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Router REST para gestión de miembros de clubs
 */
@RestController
@RequestMapping("/api/club-miembros")
@Tag(name = "Club Miembros", description = "Gestión de miembros de clubs deportivos")
public class ClubMiembroRouter {

    @Autowired
    private ClubMiembroController clubMiembroController;

    /**
     * POST /api/club-miembros - Inscribir usuario a un club
     */
    @PostMapping
    @Operation(summary = "Inscribir usuario a un club", description = "Valida capacidad y duplicados")
    public ResponseEntity<ClubMiembroResponse> inscribirMiembro(@Valid @RequestBody ClubMiembroCreateRequest request) {
        ClubMiembroResponse miembro = clubMiembroController.inscribirMiembro(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(miembro);
    }

    /**
     * GET /api/club-miembros - Listar todos los miembros activos
     */
    @GetMapping
    @Operation(summary = "Listar todos los miembros activos")
    public ResponseEntity<List<ClubMiembroResponse>> getAllMiembrosActivos() {
        return ResponseEntity.ok(clubMiembroController.getAllMiembrosActivos());
    }

    /**
     * GET /api/club-miembros/{uid} - Obtener miembro por UID
     */
    @GetMapping("/{uid}")
    @Operation(summary = "Obtener miembro por UID")
    public ResponseEntity<ClubMiembroResponse> getMiembroByUid(@PathVariable String uid) {
        return ResponseEntity.ok(clubMiembroController.getMiembroByUid(uid));
    }

    /**
     * GET /api/club-miembros/club/{clubId} - Listar miembros de un club
     */
    @GetMapping("/club/{clubId}")
    @Operation(summary = "Listar miembros activos de un club específico")
    public ResponseEntity<List<ClubMiembroResponse>> getMiembrosByClubId(@PathVariable Long clubId) {
        return ResponseEntity.ok(clubMiembroController.getMiembrosByClubId(clubId));
    }

    /**
     * GET /api/club-miembros/usuario/{usuarioId} - Listar clubes donde el usuario es miembro
     */
    @GetMapping("/usuario/{usuarioId}")
    @Operation(summary = "Listar clubes donde el usuario es miembro")
    public ResponseEntity<List<ClubMiembroResponse>> getClubsByUsuarioId(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(clubMiembroController.getClubsByUsuarioId(usuarioId));
    }

    /**
     * PATCH /api/club-miembros/{uid}/baja - Dar de baja a un miembro (soft delete)
     */
    @PatchMapping("/{uid}/baja")
    @Operation(summary = "Dar de baja a un miembro", description = "Cancela suscripciones activas automáticamente")
    public ResponseEntity<Void> darDeBajaMiembro(@PathVariable String uid) {
        clubMiembroController.darDeBajaMiembro(uid);
        return ResponseEntity.noContent().build();
    }

    /**
     * PATCH /api/club-miembros/{uid}/expulsar - Expulsar miembro del club
     */
    @PatchMapping("/{uid}/expulsar")
    @Operation(summary = "Expulsar miembro del club", description = "Marca como expulsado y cancela suscripciones")
    public ResponseEntity<Void> expulsarMiembro(@PathVariable String uid) {
        clubMiembroController.expulsarMiembro(uid);
        return ResponseEntity.noContent().build();
    }

    /**
     * PATCH /api/club-miembros/{uid}/reactivar - Reactivar miembro inactivo
     */
    @PatchMapping("/{uid}/reactivar")
    @Operation(summary = "Reactivar miembro inactivo", description = "Valida capacidad del club antes de reactivar")
    public ResponseEntity<ClubMiembroResponse> reactivarMiembro(@PathVariable String uid) {
        return ResponseEntity.ok(clubMiembroController.reactivarMiembro(uid));
    }
}
