package com.emotivapoli.incidencia.presentation.router;

import com.emotivapoli.incidencia.presentation.controller.IncidenciaController;
import com.emotivapoli.incidencia.presentation.request.IncidenciaCreateRequest;
import com.emotivapoli.incidencia.presentation.request.IncidenciaEstadoUpdateRequest;
import com.emotivapoli.incidencia.presentation.response.IncidenciaResponse;
import com.emotivapoli.security.util.AuthUtils;
import com.emotivapoli.usuario.domain.entity.Usuario;
import com.emotivapoli.usuario.infrastructure.repository.UsuarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidencias")
@Tag(name = "Incidencias", description = "Gestión de incidencias")
public class IncidenciaRouter {

    @Autowired
    private IncidenciaController incidenciaController;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping
    @Operation(summary = "Crear incidencia (usuario autenticado)")
    public ResponseEntity<IncidenciaResponse> create(@RequestBody IncidenciaCreateRequest request) {
        Long currentUserId = getCurrentUserId();
        IncidenciaResponse created = incidenciaController.createIncidencia(currentUserId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/mine")
    @Operation(summary = "Listar mis incidencias")
    public ResponseEntity<List<IncidenciaResponse>> getMine() {
        Long currentUserId = getCurrentUserId();
        return ResponseEntity.ok(incidenciaController.getMisIncidencias(currentUserId));
    }

    @GetMapping
    @Operation(summary = "Listar incidencias (admin)")
    public ResponseEntity<List<IncidenciaResponse>> getAll(@RequestParam(required = false) String estado) {
        return ResponseEntity.ok(incidenciaController.getIncidenciasAdmin(estado));
    }

    @PatchMapping("/{id}/estado")
    @Operation(summary = "Actualizar estado incidencia (admin)")
    public ResponseEntity<IncidenciaResponse> updateEstado(
            @PathVariable Long id,
            @RequestBody IncidenciaEstadoUpdateRequest request) {
        return ResponseEntity.ok(incidenciaController.updateEstado(id, request));
    }

    private Long getCurrentUserId() {
        String email = AuthUtils.getCurrentUserEmail();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario autenticado no encontrado"));
        return usuario.getId();
    }
}
