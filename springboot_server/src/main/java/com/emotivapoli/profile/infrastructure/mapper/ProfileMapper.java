package com.emotivapoli.profile.infrastructure.mapper;

import com.emotivapoli.profile.domain.dto.ProfileDTO;
import com.emotivapoli.profile.presentation.schemas.response.ProfileResponse;
import com.emotivapoli.usuario.domain.entity.Usuario;
import org.springframework.stereotype.Component;

/**
 * Mapper para convertir entre entidades Usuario y DTOs/Responses de Profile
 */
@Component
public class ProfileMapper {

    /**
     * Convierte Entity Usuario a ProfileDTO
     */
    public ProfileDTO toDTO(Usuario usuario) {
        if (usuario == null) {
            return null;
        }

        return new ProfileDTO(
            usuario.getUid(),
            usuario.getSlug(),
            usuario.getNombre(),
            usuario.getApellidos(),
            usuario.getAvatar(),
            usuario.getRole(),
            usuario.getBio(),
            usuario.getEspecialidad(),
            usuario.getCertificaciones()
        );
    }

    /**
     * Convierte ProfileDTO a ProfileResponse
     */
    public ProfileResponse toResponse(ProfileDTO dto) {
        if (dto == null) {
            return null;
        }

        return new ProfileResponse(
            dto.getUid(),
            dto.getSlug(),
            dto.getNombre(),
            dto.getApellidos(),
            dto.getAvatar(),
            dto.getRole(),
            dto.getBio(),
            dto.getEspecialidad(),
            dto.getCertificaciones()
        );
    }

    /**
     * Convierte Entity Usuario directamente a ProfileResponse
     */
    public ProfileResponse toResponse(Usuario usuario) {
        if (usuario == null) {
            return null;
        }

        return new ProfileResponse(
            usuario.getUid(),
            usuario.getSlug(),
            usuario.getNombre(),
            usuario.getApellidos(),
            usuario.getAvatar(),
            usuario.getRole(),
            usuario.getBio(),
            usuario.getEspecialidad(),
            usuario.getCertificaciones()
        );
    }
}
