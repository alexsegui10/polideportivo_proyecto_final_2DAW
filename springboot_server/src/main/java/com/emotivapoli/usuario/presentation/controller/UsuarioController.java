package com.emotivapoli.usuario.presentation.controller;

import com.emotivapoli.usuario.application.service.UsuarioService;
import com.emotivapoli.usuario.domain.dto.UsuarioDTO;
import com.emotivapoli.usuario.infrastructure.mapper.UsuarioMapper;
import com.emotivapoli.usuario.presentation.request.UsuarioCreateRequest;
import com.emotivapoli.usuario.presentation.request.UsuarioUpdateRequest;
import com.emotivapoli.usuario.presentation.response.UsuarioResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controlador de coordinación para usuarios
 * Recibe datos de Router, convierte Request→DTO, llama al Service, convierte DTO→Response
 */
@Component
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioMapper usuarioMapper;

    /**
     * Obtener todos los usuarios
     */
    public List<UsuarioResponse> getAllUsuarios() {
        List<UsuarioDTO> usuarios = usuarioService.getAllUsuarios();
        return usuarios.stream()
                .map(usuarioMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener usuario por ID
     */
    public UsuarioResponse getUsuarioById(Long id) {
        UsuarioDTO usuarioDTO = usuarioService.getUsuarioById(id);
        return usuarioMapper.toResponse(usuarioDTO);
    }

    /**
     * Obtener usuario por slug
     */
    public UsuarioResponse getUsuarioBySlug(String slug) {
        UsuarioDTO usuarioDTO = usuarioService.getUsuarioBySlug(slug);
        return usuarioMapper.toResponse(usuarioDTO);
    }

    /**
     * Obtener usuario autenticado actual (desde JWT)
     */
    public UsuarioResponse getCurrentUser() {
        // Obtener email del usuario autenticado desde SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // getName() devuelve el "principal" (email en nuestro caso)
        
        // Buscar usuario por email
        UsuarioDTO usuarioDTO = usuarioService.getUsuarioByEmail(email);
        return usuarioMapper.toResponse(usuarioDTO);
    }

    /**
     * Obtener usuarios por role
     */
    public List<UsuarioResponse> getUsuariosByRole(String role) {
        List<UsuarioDTO> usuarios = usuarioService.getUsuariosByRole(role);
        return usuarios.stream()
                .map(usuarioMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Crear nuevo usuario
     */
    public UsuarioResponse createUsuario(UsuarioCreateRequest request) {
        System.out.println("DEBUG - Request recibido: nombre=" + request.getNombre() + ", email=" + request.getEmail());
        System.out.println("DEBUG - passwordHash recibido: " + (request.getPasswordHash() != null ? "SÍ" : "NULL"));
        UsuarioDTO usuarioDTO = usuarioMapper.createRequestToDTO(request);
        UsuarioDTO createdUsuario = usuarioService.createUsuario(usuarioDTO, request.getPasswordHash());
        return usuarioMapper.toResponse(createdUsuario);
    }

    /**
     * Actualizar usuario
     */
    public UsuarioResponse updateUsuario(Long id, UsuarioUpdateRequest request) {
        // Crear DTO con cambios del request
        UsuarioDTO updateDTO = new UsuarioDTO();
        updateDTO.setNombre(request.getNombre());
        updateDTO.setApellidos(request.getApellidos());
        updateDTO.setEmail(request.getEmail());
        updateDTO.setTelefono(request.getTelefono());
        updateDTO.setDni(request.getDni());
        updateDTO.setFechaNacimiento(request.getFechaNacimiento());
        updateDTO.setAvatar(request.getAvatar());
        updateDTO.setRole(request.getRole());
        updateDTO.setStatus(request.getStatus());
        updateDTO.setIsActive(request.getIsActive());
        updateDTO.setEspecialidad(request.getEspecialidad());
        updateDTO.setCertificaciones(request.getCertificaciones());
        updateDTO.setBio(request.getBio());
        updateDTO.setDireccion(request.getDireccion());
        updateDTO.setCiudad(request.getCiudad());
        updateDTO.setCodigoPostal(request.getCodigoPostal());

        UsuarioDTO updatedUsuario = usuarioService.updateUsuario(id, updateDTO);
        return usuarioMapper.toResponse(updatedUsuario);
    }

    /**
     * Actualizar usuario por slug
     * Seguridad doble capa:
     *   1. SecurityConfig requiere token válido (authenticated)
     *   2. Aquí verificamos que el token pertenece al dueño del perfil o a un ADMIN
     */
    public UsuarioResponse updateUsuarioBySlug(String slug, UsuarioUpdateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        // Resolver el usuario objetivo
        UsuarioDTO targetUser = usuarioService.getUsuarioBySlug(slug);

        if (!isAdmin) {
            // Verificar que el autenticado es el dueño del perfil
            UsuarioDTO currentUser = usuarioService.getUsuarioByEmail(currentEmail);
            if (!currentUser.getSlug().equals(slug)) {
                throw new AccessDeniedException("No tienes permiso para modificar este perfil");
            }

            // Prevenir escalada de privilegios: ignorar campos sensibles si no es admin
            request.setRole(null);
            request.setStatus(null);
            request.setIsActive(null);
        }

        return updateUsuario(targetUser.getId(), request);
    }

    /**
     * Eliminar usuario por slug
     */
    public void deleteUsuarioBySlug(String slug) {
        // Obtener ID desde slug
        UsuarioDTO usuarioDTO = usuarioService.getUsuarioBySlug(slug);
        usuarioService.deleteUsuario(usuarioDTO.getId());
    }
}
