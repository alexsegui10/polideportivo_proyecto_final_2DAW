package com.emotivapoli.profile.presentation.router;

import com.emotivapoli.profile.presentation.controller.ProfileController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Router para perfiles públicos
 * Endpoint público para obtener información de perfil
 */
@RestController
@RequestMapping("/api/profile")
public class ProfileRouter {

    private final ProfileController profileController;

    @Autowired
    public ProfileRouter(ProfileController profileController) {
        this.profileController = profileController;
    }

    /**
     * GET /api/profile/{slug} - Obtener perfil público por slug
     * Endpoint público (no requiere autenticación)
     */
    @GetMapping("/{slug}")
    public ResponseEntity<?> getProfile(@PathVariable String slug) {
        return profileController.getProfileBySlug(slug);
    }
}
