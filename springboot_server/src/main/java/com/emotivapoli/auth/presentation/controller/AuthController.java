package com.emotivapoli.auth.presentation.controller;

import com.emotivapoli.auth.application.service.AuthService;
import com.emotivapoli.auth.presentation.request.LoginRequest;
import com.emotivapoli.auth.presentation.request.RegisterRequest;
import com.emotivapoli.auth.presentation.response.AuthResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * Controlador para gestión de autenticación
 */
@Component
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request,
                                                  String deviceId,
                                                  HttpServletResponse res) {
        AuthResponse response = authService.register(request, deviceId, res);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request,
                                               String deviceId,
                                               HttpServletResponse res) {
        AuthResponse response = authService.login(request, deviceId, res);
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Void> logout(HttpServletRequest req, HttpServletResponse res) {
        authService.logout(req, res);
        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<AuthResponse> refresh(HttpServletRequest req, HttpServletResponse res) {
        AuthResponse response = authService.refresh(req, res);
        return ResponseEntity.ok(response);
    }
}
