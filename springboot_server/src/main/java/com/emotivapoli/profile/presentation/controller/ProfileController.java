package com.emotivapoli.profile.presentation.controller;

import com.emotivapoli.profile.application.service.ProfileService;
import com.emotivapoli.profile.domain.dto.ProfileDTO;
import com.emotivapoli.profile.infrastructure.mapper.ProfileMapper;
import com.emotivapoli.profile.presentation.schemas.response.ProfileResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

/**
 * Controlador para gestión de perfiles públicos
 */
@Component
public class ProfileController {

    private final ProfileService profileService;
    private final ProfileMapper profileMapper;

    @Autowired
    public ProfileController(ProfileService profileService, ProfileMapper profileMapper) {
        this.profileService = profileService;
        this.profileMapper = profileMapper;
    }

    /**
     * Obtener perfil público por slug
     */
    public ResponseEntity<ProfileResponse> getProfileBySlug(String slug) {
        ProfileDTO profileDTO = profileService.getProfileBySlug(slug);
        ProfileResponse response = profileMapper.toResponse(profileDTO);
        return ResponseEntity.ok(response);
    }
}
