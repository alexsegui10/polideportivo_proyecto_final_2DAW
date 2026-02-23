package com.emotivapoli.auth.presentation.router;

import com.emotivapoli.auth.presentation.controller.AuthController;
import com.emotivapoli.auth.presentation.request.LoginRequest;
import com.emotivapoli.auth.presentation.request.RegisterRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Router para autenticación.
 * El header X-Device-Id identifica el dispositivo del cliente.
 * Si no llega, se usa "unknown" como fallback.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthRouter {

    private final AuthController authController;

    @Autowired
    public AuthRouter(AuthController authController) {
        this.authController = authController;
    }

    /** POST /api/auth/register */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request,
                                      @RequestHeader(value = "X-Device-Id", defaultValue = "unknown") String deviceId,
                                      HttpServletResponse res) {
        return authController.register(request, deviceId, res);
    }

    /** POST /api/auth/login */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request,
                                   @RequestHeader(value = "X-Device-Id", defaultValue = "unknown") String deviceId,
                                   HttpServletResponse res) {
        return authController.login(request, deviceId, res);
    }

    /**
     * POST /api/auth/logout
     * Invalida el refresh token del dispositivo actual y borra la cookie.
     * Permitido sin access token válido (el usuario puede estar con token expirado).
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest req, HttpServletResponse res) {
        return authController.logout(req, res);
    }

    /**
     * POST /api/auth/refresh
     * Recibe el refresh token de la cookie HttpOnly.
     * Rota el token y devuelve un nuevo access token.
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest req, HttpServletResponse res) {
        return authController.refresh(req, res);
    }
}
