package com.emotivapoli.usuario.presentation.controller;

import com.emotivapoli.usuario.application.service.UsuarioService;
import com.emotivapoli.usuario.domain.dto.UsuarioDTO;
import com.emotivapoli.usuario.infrastructure.mapper.UsuarioMapper;
import com.emotivapoli.usuario.presentation.request.ChangePasswordRequest;
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

@Component
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioMapper usuarioMapper;

    public List<UsuarioResponse> getAllUsuarios() {
        List<UsuarioDTO> usuarios = usuarioService.getAllUsuarios();
        return usuarios.stream()
                .map(usuarioMapper::toResponse)
                .collect(Collectors.toList());
    }

    public UsuarioResponse getUsuarioById(Long id) {
        UsuarioDTO usuarioDTO = usuarioService.getUsuarioById(id);
        return usuarioMapper.toResponse(usuarioDTO);
    }

    public UsuarioResponse getUsuarioBySlug(String slug) {
        UsuarioDTO usuarioDTO = usuarioService.getUsuarioBySlug(slug);
        return usuarioMapper.toResponse(usuarioDTO);
    }

    public UsuarioResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        UsuarioDTO usuarioDTO = usuarioService.getUsuarioByEmail(email);
        return usuarioMapper.toResponse(usuarioDTO);
    }

    public List<UsuarioResponse> getUsuariosByRole(String role) {
        List<UsuarioDTO> usuarios = usuarioService.getUsuariosByRole(role);
        return usuarios.stream()
                .map(usuarioMapper::toResponse)
                .collect(Collectors.toList());
    }

    public UsuarioResponse createUsuario(UsuarioCreateRequest request) {
        UsuarioDTO usuarioDTO = usuarioMapper.createRequestToDTO(request);
        UsuarioDTO createdUsuario = usuarioService.createUsuario(usuarioDTO, request.getPasswordHash());
        return usuarioMapper.toResponse(createdUsuario);
    }

    public UsuarioResponse updateUsuario(Long id, UsuarioUpdateRequest request) {
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
     * Cambiar contraseña — doble verificación:
     *   1. SecurityConfig exige token válido (authenticated)
     *   2. Aquí verificamos que el autenticado es el dueño del perfil
     */
    public void changePasswordBySlug(String slug, ChangePasswordRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();

        // Solo el mismo usuario puede cambiar su propia contraseña
        UsuarioDTO targetUser = usuarioService.getUsuarioBySlug(slug);
        UsuarioDTO currentUser = usuarioService.getUsuarioByEmail(currentEmail);
        if (!currentUser.getSlug().equals(targetUser.getSlug())) {
            throw new AccessDeniedException("Solo puedes cambiar tu propia contraseña");
        }

        usuarioService.changePassword(targetUser.getId(), request.getCurrentPassword(), request.getNewPassword());
    }

    public void deleteUsuarioBySlug(String slug) {
        UsuarioDTO usuarioDTO = usuarioService.getUsuarioBySlug(slug);
        usuarioService.deleteUsuario(usuarioDTO.getId());
    }
}
