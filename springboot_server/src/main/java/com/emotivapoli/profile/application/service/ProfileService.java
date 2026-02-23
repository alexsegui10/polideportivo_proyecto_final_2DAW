package com.emotivapoli.profile.application.service;

import com.emotivapoli.exception.ResourceNotFoundException;
import com.emotivapoli.profile.domain.dto.ProfileDTO;
import com.emotivapoli.profile.infrastructure.mapper.ProfileMapper;
import com.emotivapoli.profile.infrastructure.repository.ProfileRepository;
import com.emotivapoli.usuario.domain.entity.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Servicio para gestión de perfiles públicos
 */
@Service
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private ProfileMapper profileMapper;

    /**
     * Obtener perfil público por slug
     */
    public ProfileDTO getProfileBySlug(String slug) {
        Usuario usuario = profileRepository.findBySlugAndStatusAndIsActive(slug, "activo", true)
                .orElseThrow(() -> new ResourceNotFoundException("Perfil no encontrado con slug: " + slug));

        return profileMapper.toDTO(usuario);
    }
}
