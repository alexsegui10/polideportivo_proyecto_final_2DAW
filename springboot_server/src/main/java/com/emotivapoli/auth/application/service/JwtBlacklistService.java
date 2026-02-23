package com.emotivapoli.auth.application.service;

import com.emotivapoli.auth.domain.entity.JwtBlacklist;
import com.emotivapoli.auth.infrastructure.repository.JwtBlacklistRepository;
import com.emotivapoli.security.service.TokenService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HexFormat;

/**
 * Gestiona la blacklist de access tokens JWT.
 *
 * CUÁNDO SE USA:
 *   - En logout: el access token actual se añade a la blacklist aunque aún no
 *     haya expirado. Así, si alguien roba el token después del logout ya no sirve.
 *
 * DIFERENCIA con refresh_sessions.revoked:
 *   - jwt_blacklist    = access tokens invalidados voluntariamente (logout del usuario)
 *   - revoked en RS    = refresh token comprometido (theft detection, involuntario)
 *
 * RETENCIÓN:
 *   - Los registros se conservan indefinidamente para tener histórico
 *     de sesiones cerradas (estadísticas, auditoría).
 */
@Service
public class JwtBlacklistService {

    private static final Logger log = LoggerFactory.getLogger(JwtBlacklistService.class);

    private final JwtBlacklistRepository blacklistRepository;
    private final TokenService tokenService;

    public JwtBlacklistService(JwtBlacklistRepository blacklistRepository,
                                TokenService tokenService) {
        this.blacklistRepository = blacklistRepository;
        this.tokenService = tokenService;
    }

    // ── Revocar token (llamado en logout) ───────────────────────────

    /**
     * Añade el access token a la blacklist.
     * Si el token ya está expirado o es inválido, se ignora silenciosamente.
     *
     * @param rawAccessToken el JWT en claro (sin "Bearer " prefix)
     */
    @Transactional
    public void revoke(String rawAccessToken) {
        if (rawAccessToken == null || rawAccessToken.isBlank()) return;
        try {
            LocalDateTime expiresAt = tokenService.extractExpiration(rawAccessToken);
            // No tiene sentido blacklistear un token ya expirado
            if (expiresAt.isBefore(LocalDateTime.now())) {
                log.debug("Access token ya expirado, no se añade a blacklist");
                return;
            }
            String hash = sha256(rawAccessToken);
            if (!blacklistRepository.existsByTokenHash(hash)) {
                blacklistRepository.save(new JwtBlacklist(hash, expiresAt));
                log.debug("Access token añadido a blacklist (expira: {})", expiresAt);
            }
        } catch (Exception e) {
            log.warn("No se pudo añadir access token a blacklist: {}", e.getMessage());
        }
    }

    // ── Comprobar blacklist (llamado en cada request) ───────────────

    /**
     * @return true si el token está en la blacklist (revocado), false si es válido
     */
    public boolean isBlacklisted(String rawAccessToken) {
        if (rawAccessToken == null || rawAccessToken.isBlank()) return false;
        try {
            return blacklistRepository.existsByTokenHash(sha256(rawAccessToken));
        } catch (Exception e) {
            log.error("Error comprobando blacklist: {}", e.getMessage());
            return false;
        }
    }

    // ── Utilidad ────────────────────────────────────────────────────

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
