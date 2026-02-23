package com.emotivapoli.auth.application.service;

import com.emotivapoli.auth.domain.entity.RefreshSession;
import com.emotivapoli.auth.infrastructure.repository.RefreshSessionRepository;
import com.emotivapoli.security.service.TokenService;
import com.emotivapoli.usuario.domain.entity.Usuario;
import com.emotivapoli.usuario.infrastructure.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.UUID;

/**
 * Lógica de negocio para refresh tokens.
 *
 * Implementa el patrón completo de la profesora (1_refresh_jwt.txt):
 *   - one-time use     → cada uso rota el token (nuevo hash en DB)
 *   - familyId         → detectar reuse = token theft → revocar familia entera
 *   - deviceId         → logout por dispositivo específico
 *   - sessionVersion   → logout global (incrementar versión invalida todos)
 *   - revoked / blacklist → campo revoked en refresh_sessions
 */
@Service
public class RefreshTokenService {

    private final RefreshSessionRepository sessionRepository;
    private final UsuarioRepository usuarioRepository;
    private final TokenService tokenService;

    public RefreshTokenService(RefreshSessionRepository sessionRepository,
                               UsuarioRepository usuarioRepository,
                               TokenService tokenService) {
        this.sessionRepository = sessionRepository;
        this.usuarioRepository = usuarioRepository;
        this.tokenService = tokenService;
    }

    // ── Crear sesión (login / register) ─────────────────────────────

    /**
     * Genera un refresh token nuevo para usuario + dispositivo.
     * Si ya existía una sesión en ese dispositivo, se revocan las anteriores.
     *
     * @return el refresh token en claro (irá a la cookie HttpOnly)
     */
    @Transactional
    public String createSession(String email, String deviceId, String role) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + email));

        UUID familyId = UUID.randomUUID();
        String rawToken = tokenService.generateRefreshToken(email, familyId, role);
        String tokenHash = sha256(rawToken);

        // Revocar todas las sesiones anteriores de este dispositivo
        sessionRepository.findByUserIdAndDeviceId(usuario.getId(), deviceId)
                .forEach(old -> {
                    old.setRevoked(true);
                    sessionRepository.save(old);
                });

        RefreshSession session = new RefreshSession(
                usuario.getId(),
                deviceId,
                familyId,
                tokenHash,
                usuario.getSessionVersion()
        );
        sessionRepository.save(session);

        return rawToken;
    }

    // ── Rotar token (refresh endpoint) ──────────────────────────────

    /**
     * Valida el refresh token y devuelve un nuevo par [accessToken, refreshToken].
     *
     * Flujo (2_expires.txt + 1_refresh_jwt.txt):
     *   1. Verificar firma/expiración del JWT
     *   2. Buscar sesión por familyId
     *   3. Si revoked → familia ya comprometida → 401
     *   4. Si hash no coincide → REUSE DETECTADO → revocar familia → 401
     *   5. Si sessionVersion distinta → logout global activo → 401
     *   6. Rotar: nuevo refreshToken con mismo familyId, actualizar hash en DB
     *   7. Generar nuevo accessToken
     *
     * @return array [newAccessToken, newRefreshToken]
     */
    @Transactional
    public String[] rotate(String rawRefreshToken, String deviceId) {
        // 1. Validar firma y expiración
        if (!tokenService.isRefreshTokenValid(rawRefreshToken)) {
            throw new SecurityException("Refresh token inválido o expirado");
        }

        String email  = tokenService.extractEmailFromRefresh(rawRefreshToken);
        UUID familyId = tokenService.extractFamilyIdFromRefresh(rawRefreshToken);
        String incoming = sha256(rawRefreshToken);

        // 2. Buscar sesión por familyId
        RefreshSession session = sessionRepository.findByFamilyId(familyId)
                .orElseThrow(() -> new SecurityException("Sesión no encontrada"));

        // 3. Familia revocada → alguien usó un token ya rotado
        if (session.getRevoked()) {
            sessionRepository.revokeByFamilyId(familyId);
            throw new SecurityException("Token reutilizado detectado. Sesión revocada.");
        }

        // 4. Hash no coincide → reuse detectado
        if (!incoming.equals(session.getCurrentTokenHash())) {
            sessionRepository.revokeByFamilyId(familyId);
            throw new SecurityException("Hash de token no coincide. Sesión revocada.");
        }

        // 5. Verificar sessionVersion (logout global vía invalidateAllSessions)
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if (!session.getSessionVersion().equals(usuario.getSessionVersion())) {
            throw new SecurityException("Sesión invalidada globalmente");
        }

        // 6. Rotar: nuevo refresh token con el mismo familyId
        String role = usuario.getRole();
        String newRefreshToken = tokenService.generateRefreshToken(email, familyId, role);
        session.setCurrentTokenHash(sha256(newRefreshToken));
        session.setLastUsedAt(LocalDateTime.now());
        sessionRepository.save(session);

        // 7. Generar nuevo access token
        String newAccessToken = tokenService.generateAccessToken(email, role);

        return new String[]{newAccessToken, newRefreshToken};
    }

    // ── Logout por dispositivo (logout endpoint) ─────────────────────

    /**
     * Revoca la sesión de este dispositivo.
     * El token viene de la cookie HttpOnly del request.
     */
    @Transactional
    public void invalidateSession(String rawRefreshToken) {
        if (rawRefreshToken == null) return;
        try {
            UUID familyId = tokenService.extractFamilyIdFromRefresh(rawRefreshToken);
            sessionRepository.revokeByFamilyId(familyId);
        } catch (Exception e) {
            // Token inválido o expirado → no hay sesión que limpiar
        }
    }

    // ── Logout global (todos los dispositivos) ───────────────────────

    /**
     * Incrementa session_version del usuario → invalida TODOS sus refresh tokens.
     * Útil para "cerrar sesión en todos los dispositivos" o cambio de contraseña.
     */
    @Transactional
    public void invalidateAllSessions(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + email));

        usuario.setSessionVersion(usuario.getSessionVersion() + 1);
        usuarioRepository.save(usuario);
        sessionRepository.revokeAllByUserId(usuario.getId());
    }

    // ── Utilidad ─────────────────────────────────────────────────────

    private String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 no disponible", e);
        }
    }
}
