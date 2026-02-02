package com.emotivapoli.usuario.infrastructure.mapper;

import com.emotivapoli.usuario.domain.dto.UsuarioDTO;
import com.emotivapoli.usuario.domain.entity.Usuario;
import com.emotivapoli.usuario.presentation.schemas.request.UsuarioCreateRequest;
import com.emotivapoli.usuario.presentation.schemas.request.UsuarioUpdateRequest;
import com.emotivapoli.usuario.presentation.schemas.response.UsuarioResponse;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {

    /**
     * Convierte Entity a DTO
     */
    public UsuarioDTO toDTO(Usuario entity) {
        if (entity == null) {
            return null;
        }

        return new UsuarioDTO(
            entity.getId(),
            entity.getUid(),
            entity.getSlug(),
            entity.getNombre(),
            entity.getApellidos(),
            entity.getEmail(),
            entity.getTelefono(),
            entity.getDni(),
            entity.getFechaNacimiento(),
            entity.getAvatar(),
            entity.getRole(),
            entity.getStatus(),
            entity.getIsActive(),
            entity.getEspecialidad(),
            entity.getCertificaciones(),
            entity.getBio(),
            entity.getDireccion(),
            entity.getCiudad(),
            entity.getCodigoPostal(),
            entity.getCreatedAt(),
            entity.getUpdatedAt(),
            entity.getLastLogin()
        );
    }

    /**
     * Convierte DTO a Entity
     */
    public Usuario toEntity(UsuarioDTO dto) {
        if (dto == null) {
            return null;
        }

        Usuario entity = new Usuario();
        entity.setId(dto.getId());
        entity.setUid(dto.getUid());
        entity.setSlug(dto.getSlug());
        entity.setNombre(dto.getNombre());
        entity.setApellidos(dto.getApellidos());
        entity.setEmail(dto.getEmail());
        entity.setTelefono(dto.getTelefono());
        entity.setDni(dto.getDni());
        entity.setFechaNacimiento(dto.getFechaNacimiento());
        entity.setAvatar(dto.getAvatar());
        entity.setRole(dto.getRole());
        entity.setStatus(dto.getStatus());
        entity.setIsActive(dto.getIsActive());
        entity.setEspecialidad(dto.getEspecialidad());
        entity.setCertificaciones(dto.getCertificaciones());
        entity.setBio(dto.getBio());
        entity.setDireccion(dto.getDireccion());
        entity.setCiudad(dto.getCiudad());
        entity.setCodigoPostal(dto.getCodigoPostal());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());
        entity.setLastLogin(dto.getLastLogin());

        return entity;
    }

    /**
     * Convierte DTO a Response
     */
    public UsuarioResponse toResponse(UsuarioDTO dto) {
        if (dto == null) {
            return null;
        }

        return new UsuarioResponse(
            dto.getId(),
            dto.getUid(),
            dto.getSlug(),
            dto.getNombre(),
            dto.getApellidos(),
            dto.getEmail(),
            dto.getTelefono(),
            dto.getDni(),
            dto.getFechaNacimiento(),
            dto.getAvatar(),
            dto.getRole(),
            dto.getStatus(),
            dto.getIsActive(),
            dto.getEspecialidad(),
            dto.getCertificaciones(),
            dto.getBio(),
            dto.getDireccion(),
            dto.getCiudad(),
            dto.getCodigoPostal(),
            dto.getCreatedAt(),
            dto.getUpdatedAt(),
            dto.getLastLogin()
        );
    }

    /**
     * Convierte CreateRequest a DTO
     */
    public UsuarioDTO createRequestToDTO(UsuarioCreateRequest request) {
        if (request == null) {
            return null;
        }

        UsuarioDTO dto = new UsuarioDTO();
        dto.setSlug(request.getSlug());
        dto.setNombre(request.getNombre());
        dto.setApellidos(request.getApellidos());
        dto.setEmail(request.getEmail());
        dto.setTelefono(request.getTelefono());
        dto.setDni(request.getDni());
        dto.setFechaNacimiento(request.getFechaNacimiento());
        dto.setAvatar(request.getAvatar());
        dto.setRole(request.getRole() != null ? request.getRole() : "cliente");
        dto.setStatus(request.getStatus() != null ? request.getStatus() : "activo");
        dto.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        dto.setEspecialidad(request.getEspecialidad());
        dto.setCertificaciones(request.getCertificaciones());
        dto.setBio(request.getBio());
        dto.setDireccion(request.getDireccion());
        dto.setCiudad(request.getCiudad());
        dto.setCodigoPostal(request.getCodigoPostal());

        return dto;
    }

    /**
     * Actualiza Entity desde UpdateRequest
     */
    public void updateEntityFromRequest(Usuario entity, UsuarioUpdateRequest request) {
        if (entity == null || request == null) {
            return;
        }

        if (request.getNombre() != null) {
            entity.setNombre(request.getNombre());
        }
        if (request.getApellidos() != null) {
            entity.setApellidos(request.getApellidos());
        }
        if (request.getEmail() != null) {
            entity.setEmail(request.getEmail());
        }
        if (request.getTelefono() != null) {
            entity.setTelefono(request.getTelefono());
        }
        if (request.getDni() != null) {
            entity.setDni(request.getDni());
        }
        if (request.getFechaNacimiento() != null) {
            entity.setFechaNacimiento(request.getFechaNacimiento());
        }
        if (request.getAvatar() != null) {
            entity.setAvatar(request.getAvatar());
        }
        if (request.getRole() != null) {
            entity.setRole(request.getRole());
        }
        if (request.getStatus() != null) {
            entity.setStatus(request.getStatus());
        }
        if (request.getIsActive() != null) {
            entity.setIsActive(request.getIsActive());
        }
        if (request.getEspecialidad() != null) {
            entity.setEspecialidad(request.getEspecialidad());
        }
        if (request.getCertificaciones() != null) {
            entity.setCertificaciones(request.getCertificaciones());
        }
        if (request.getBio() != null) {
            entity.setBio(request.getBio());
        }
        if (request.getDireccion() != null) {
            entity.setDireccion(request.getDireccion());
        }
        if (request.getCiudad() != null) {
            entity.setCiudad(request.getCiudad());
        }
        if (request.getCodigoPostal() != null) {
            entity.setCodigoPostal(request.getCodigoPostal());
        }
    }
}
