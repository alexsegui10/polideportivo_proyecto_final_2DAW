package com.emotivapoli.usuario.presentation.controller;

import com.emotivapoli.usuario.application.service.UsuarioService;
import com.emotivapoli.usuario.domain.dto.UsuarioDTO;
import com.emotivapoli.usuario.infrastructure.mapper.UsuarioMapper;
import com.emotivapoli.usuario.presentation.schemas.request.UsuarioCreateRequest;
import com.emotivapoli.usuario.presentation.schemas.request.UsuarioUpdateRequest;
import com.emotivapoli.usuario.presentation.schemas.response.UsuarioResponse;
import org.springframework.beans.factory.annotation.Autowired;
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
        // Obtener usuario existente
        UsuarioDTO usuarioDTO = usuarioService.getUsuarioById(id);
        
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
     */
    public UsuarioResponse updateUsuarioBySlug(String slug, UsuarioUpdateRequest request) {
        // Obtener ID desde slug
        UsuarioDTO usuarioDTO = usuarioService.getUsuarioBySlug(slug);
        return updateUsuario(usuarioDTO.getId(), request);
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
