package com.emotivapoli.usuario.presentation.router;

import com.emotivapoli.usuario.presentation.controller.UsuarioController;
import com.emotivapoli.usuario.presentation.request.UsuarioCreateRequest;
import com.emotivapoli.usuario.presentation.request.UsuarioUpdateRequest;
import com.emotivapoli.usuario.presentation.response.UsuarioResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Router HTTP para Usuarios
 * Define endpoints REST y delega lógica al Controller
 */
@RestController
@Tag(name = "Usuarios", description = "Gestión de usuarios del sistema")
public class UsuarioRouter {

    @Autowired
    private UsuarioController usuarioController;

    /**
     * GET /api/usuario - Obtener usuario autenticado actual
     * IMPORTANTE: Este endpoint debe ir ANTES de /api/usuarios para no colisionar
     */
    @GetMapping("/api/usuario")
    @Operation(summary = "Obtener información del usuario autenticado")
    public ResponseEntity<UsuarioResponse> getCurrentUser() {
        UsuarioResponse usuario = usuarioController.getCurrentUser();
        return ResponseEntity.ok(usuario);
    }

    /**
     * GET /api/usuarios - Obtener todos los usuarios
     */
    @GetMapping("/api/usuarios")
    @Operation(summary = "Obtener todos los usuarios")
    public ResponseEntity<List<UsuarioResponse>> getAllUsuarios() {
        List<UsuarioResponse> usuarios = usuarioController.getAllUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    /**
     * GET /api/usuarios/{slug} - Obtener usuario por slug
     */
    @GetMapping("/api/usuarios/{slug}")
    @Operation(summary = "Obtener usuario por slug")
    public ResponseEntity<UsuarioResponse> getUsuario(@PathVariable String slug) {
        UsuarioResponse usuario = usuarioController.getUsuarioBySlug(slug);
        return ResponseEntity.ok(usuario);
    }

    /**
     * GET /api/usuarios/role/{role} - Obtener usuarios por role
     */
    @GetMapping("/api/usuarios/role/{role}")
    @Operation(summary = "Obtener usuarios por role (admin, cliente, entrenador)")
    public ResponseEntity<List<UsuarioResponse>> getUsuariosByRole(@PathVariable String role) {
        List<UsuarioResponse> usuarios = usuarioController.getUsuariosByRole(role);
        return ResponseEntity.ok(usuarios);
    }

    /**
     * POST /api/usuarios - Crear nuevo usuario
     */
    @PostMapping("/api/usuarios")
    @Operation(summary = "Crear nuevo usuario")
    public ResponseEntity<UsuarioResponse> createUsuario(@RequestBody UsuarioCreateRequest request) {
        UsuarioResponse nuevoUsuario = usuarioController.createUsuario(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
    }

    /**
     * PUT /api/usuarios/{slug} - Actualizar usuario
     */
    @PutMapping("/api/usuarios/{slug}")
    @Operation(summary = "Actualizar usuario existente")
    public ResponseEntity<UsuarioResponse> updateUsuario(
            @PathVariable String slug,
            @RequestBody UsuarioUpdateRequest request) {
        UsuarioResponse usuarioActualizado = usuarioController.updateUsuarioBySlug(slug, request);
        return ResponseEntity.ok(usuarioActualizado);
    }

    /**
     * PATCH /api/usuarios/{slug}/soft-delete - Eliminar usuario (soft delete)
     */
    @PatchMapping("/api/usuarios/{slug}/soft-delete")
    @Operation(summary = "Eliminar usuario mediante soft delete (marca como eliminado sin borrar físicamente)")
    public ResponseEntity<Void> softDeleteUsuario(@PathVariable String slug) {
        usuarioController.deleteUsuarioBySlug(slug);
        return ResponseEntity.noContent().build();
    }
}
