package com.emotivapoli.auth.application.service;

import com.emotivapoli.auth.presentation.request.LoginRequest;
import com.emotivapoli.auth.presentation.request.RegisterRequest;
import com.emotivapoli.auth.presentation.response.AuthResponse;
import com.emotivapoli.exception.ValidationException;
import com.emotivapoli.security.service.TokenService;
import com.emotivapoli.usuario.application.service.UsuarioService;
import com.emotivapoli.usuario.domain.dto.UsuarioDTO;
import com.emotivapoli.usuario.domain.entity.Usuario;
import com.emotivapoli.usuario.infrastructure.mapper.UsuarioMapper;
import com.emotivapoli.usuario.infrastructure.repository.UsuarioRepository;
import com.emotivapoli.usuario.presentation.response.UsuarioResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private static final String REFRESH_COOKIE = "refreshToken";
    // path="/" para que la cookie se envíe en cualquier ruta
    // (el proxy de Vite redirige /api/springboot/auth → /api/auth,
    //  así que el path del navegador y el del backend son distintos)
    private static final String REFRESH_PATH   = "/";

    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final RefreshTokenService refreshTokenService;
    private final JwtBlacklistService jwtBlacklistService;
    private final AuthenticationManager authenticationManager;
    private final UsuarioMapper usuarioMapper;

    @Autowired
    public AuthService(UsuarioService usuarioService,
                       UsuarioRepository usuarioRepository,
                       PasswordEncoder passwordEncoder,
                       TokenService tokenService,
                       RefreshTokenService refreshTokenService,
                       JwtBlacklistService jwtBlacklistService,
                       AuthenticationManager authenticationManager,
                       UsuarioMapper usuarioMapper) {
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
        this.refreshTokenService = refreshTokenService;
        this.jwtBlacklistService = jwtBlacklistService;
        this.authenticationManager = authenticationManager;
        this.usuarioMapper = usuarioMapper;
    }

    // ── Register ────────────────────────────────────────────────────

    public AuthResponse register(RegisterRequest request, String deviceId, HttpServletResponse res) {
        UsuarioDTO usuarioDTO = new UsuarioDTO();
        usuarioDTO.setNombre(request.getNombre());
        usuarioDTO.setApellidos(request.getApellidos());
        usuarioDTO.setEmail(request.getEmail());
        usuarioDTO.setRole("cliente");
        usuarioDTO.setStatus("activo");
        usuarioDTO.setIsActive(true);

        String passwordHash = passwordEncoder.encode(request.getPassword());
        UsuarioDTO createdUsuario = usuarioService.createUsuario(usuarioDTO, passwordHash);

        String accessToken = tokenService.generateAccessToken(createdUsuario.getEmail(), "cliente");
        setRefreshCookie(res, createdUsuario.getEmail(), deviceId, "cliente");

        UsuarioResponse usuarioResponse = usuarioMapper.toResponse(createdUsuario);
        return new AuthResponse(accessToken, usuarioResponse);
    }

    // ── Login ───────────────────────────────────────────────────────

    public AuthResponse login(LoginRequest request, String deviceId, HttpServletResponse res) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            UsuarioDTO usuarioDTO = usuarioService.getUsuarioByEmail(request.getEmail());

            if (!"activo".equals(usuarioDTO.getStatus()) || !usuarioDTO.getIsActive()) {
                throw new ValidationException("El usuario no está activo");
            }

            // Actualizar último login
            Usuario usuario = usuarioRepository.findByEmail(request.getEmail()).orElseThrow();
            usuario.setLastLogin(LocalDateTime.now());
            usuarioRepository.save(usuario);

            String role = usuarioDTO.getRole();
            String accessToken = tokenService.generateAccessToken(usuarioDTO.getEmail(), role);

            if (!"admin".equalsIgnoreCase(role)) {
                setRefreshCookie(res, usuarioDTO.getEmail(), deviceId, role);
            }

            UsuarioResponse usuarioResponse = usuarioMapper.toResponse(usuarioDTO);
            return new AuthResponse(accessToken, usuarioResponse);

        } catch (AuthenticationException e) {
            throw new ValidationException("Email o contraseña incorrectos");
        }
    }

    // ── Logout ──────────────────────────────────────────────────────

    /**
     * Doble invalidación en logout:
     *   1. Revoca el REFRESH token de este dispositivo (refresh_sessions.revoked = true)
     *   2. Añade el ACCESS token a la JWT blacklist para que no sirva hasta que expire
     */
    public void logout(HttpServletRequest req, HttpServletResponse res) {
        // 1. Invalida refresh token (cookie)
        String rawRefreshToken = extractRefreshCookie(req);
        refreshTokenService.invalidateSession(rawRefreshToken);
        clearRefreshCookie(res);

        // 2. Blacklist del access token (header Authorization: Bearer ...)
        String authHeader = req.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String rawAccessToken = authHeader.substring(7);
            jwtBlacklistService.revoke(rawAccessToken);
        }
    }

    // ── Refresh ─────────────────────────────────────────────────────

    /**
     * Rota el refresh token y emite un nuevo access token.
     * Si detecta reuse → revoca la familia entera (token theft).
     */
    public AuthResponse refresh(HttpServletRequest req, HttpServletResponse res) {
        String rawRefreshToken = extractRefreshCookie(req);
        if (rawRefreshToken == null) {
            throw new ValidationException("Cookie de refresh token ausente");
        }

        String deviceId = req.getHeader("X-Device-Id");
        if (deviceId == null) deviceId = "unknown";

        String[] pair = refreshTokenService.rotate(rawRefreshToken, deviceId);
        String newAccessToken   = pair[0];
        String newRefreshToken  = pair[1];

        // Escribir nueva cookie con el token rotado
        String email = tokenService.extractEmailFromRefresh(newRefreshToken);
        UsuarioDTO usuarioDTO = usuarioService.getUsuarioByEmail(email);
        ResponseCookie cookie = buildRefreshCookie(newRefreshToken, usuarioDTO.getRole());
        res.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        UsuarioResponse usuarioResponse = usuarioMapper.toResponse(usuarioDTO);
        return new AuthResponse(newAccessToken, usuarioResponse);
    }

    // ── Helpers cookie ──────────────────────────────────────────────

    private void setRefreshCookie(HttpServletResponse res, String email,
                                  String deviceId, String role) {
        String rawRefreshToken = refreshTokenService.createSession(email, deviceId, role);
        ResponseCookie cookie = buildRefreshCookie(rawRefreshToken, role);
        res.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private ResponseCookie buildRefreshCookie(String rawToken, String role) {
        long maxAgeSecs = "monitor".equalsIgnoreCase(role)
                ? TokenService.REFRESH_MS_MONITOR / 1000
                : TokenService.REFRESH_MS_CLIENTE / 1000;

        return ResponseCookie.from(REFRESH_COOKIE, rawToken)
                .httpOnly(true)
                .secure(false)          // true en producción con HTTPS
                .path(REFRESH_PATH)
                .maxAge(maxAgeSecs)
                .sameSite("Strict")     // mismo origen gracias al proxy de Vite
                .build();
    }

    private String extractRefreshCookie(HttpServletRequest req) {
        if (req.getCookies() == null) return null;
        for (Cookie c : req.getCookies()) {
            if (REFRESH_COOKIE.equals(c.getName())) return c.getValue();
        }
        return null;
    }

    private void clearRefreshCookie(HttpServletResponse res) {
        ResponseCookie cookie = ResponseCookie.from(REFRESH_COOKIE, "")
                .httpOnly(true)
                .path(REFRESH_PATH)
                .maxAge(0)
                .sameSite("Strict")
                .secure(false)
                .build();
        res.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
