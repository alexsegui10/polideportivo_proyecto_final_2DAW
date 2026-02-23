package com.emotivapoli.security.service;

import com.emotivapoli.usuario.infrastructure.repository.UsuarioRepository;
import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 *   - admin:    access 5 min  |  sin refresh (re-login)
 *   - monitor:  access 15 min |  refresh 7 días
 *   - cliente:  access 15 min |  refresh 30 días
 */
@Service
public class TokenService {

    // ── Duraciones ──────────────────────────────────────────────────
    private static final long ACCESS_MS_ADMIN   = 5L  * 60 * 1000;
    private static final long ACCESS_MS_DEFAULT = 15L * 60 * 1000;
    public  static final long REFRESH_MS_MONITOR = 7L  * 24 * 60 * 60 * 1000;
    public  static final long REFRESH_MS_CLIENTE = 30L * 24 * 60 * 60 * 1000;

    private final UsuarioRepository usuarioRepository;
    private final String accessSecret;
    private final String refreshSecret;

    public TokenService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;

        Dotenv dotenv = Dotenv.configure().directory("./").ignoreIfMissing().load();

        // Secrets separados para access y refresh; si no existen, usa el genérico
        String genericSecret = dotenv.get("JWT_SECRET",
                "default-secret-change-me-in-production-minimum-256-bits-required");
        this.accessSecret  = dotenv.get("JWT_ACCESS_SECRET",  genericSecret);
        this.refreshSecret = dotenv.get("JWT_REFRESH_SECRET", genericSecret);
    }

    // ── Access Token ────────────────────────────────────────────────

    /**
     * Genera access token con expiración según rol:
     *   admin → 5 min | monitor/cliente → 15 min
     */
    public String generateAccessToken(String email, String role) {
        long expMs = "admin".equalsIgnoreCase(role) ? ACCESS_MS_ADMIN : ACCESS_MS_DEFAULT;

        Map<String, Object> claims = new HashMap<>();
        claims.put("email", email);
        claims.put("role", role);
        claims.put("type", "access");

        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expMs))
                .signWith(getAccessKey())
                .compact();
    }

    /** Compatibilidad con código existente (sin rol explícito → 15 min) */
    public String generateToken(String email) {
        return generateAccessToken(email, "cliente");
    }

    public boolean isTokenValid(String token) {
        try {
            String email = extractEmail(token);
            return email != null && !isTokenExpired(token) && usuarioRepository.existsByEmail(email);
        } catch (Exception e) {
            return false;
        }
    }

    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    private boolean isTokenExpired(String token) {
        return extractExpirationDate(token).before(new Date());
    }

    /**
     * Devuelve la fecha de expiración del access token como LocalDateTime.
     * Usado por JwtBlacklistService para saber cuándo limpiar la entrada.
     */
    public java.time.LocalDateTime extractExpiration(String token) {
        Date exp = extractExpirationDate(token);
        return exp.toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDateTime();
    }

    private Date extractExpirationDate(String token) {
        return extractAllClaims(token).getExpiration();
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getAccessKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // ── Refresh Token ───────────────────────────────────────────────

    /**
     * Genera un refresh token firmado con el refresh secret.
     * admin → lanza excepción (no tiene refresh).
     * monitor → 7 días | cliente → 30 días
     */
    public String generateRefreshToken(String email, UUID familyId, String role) {
        if ("admin".equalsIgnoreCase(role)) {
            throw new IllegalStateException("Los administradores no tienen refresh token");
        }
        long expMs = "monitor".equalsIgnoreCase(role) ? REFRESH_MS_MONITOR : REFRESH_MS_CLIENTE;

        Map<String, Object> claims = new HashMap<>();
        claims.put("email", email);
        claims.put("familyId", familyId.toString());
        claims.put("type", "refresh");

        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expMs))
                .signWith(getRefreshKey())
                .compact();
    }

    public boolean isRefreshTokenValid(String token) {
        try {
            Claims claims = extractRefreshClaims(token);
            return claims != null
                    && !claims.getExpiration().before(new Date())
                    && "refresh".equals(claims.get("type"));
        } catch (Exception e) {
            return false;
        }
    }

    public String extractEmailFromRefresh(String token) {
        return extractRefreshClaims(token).getSubject();
    }

    public UUID extractFamilyIdFromRefresh(String token) {
        return UUID.fromString((String) extractRefreshClaims(token).get("familyId"));
    }

    private Claims extractRefreshClaims(String token) {
        return Jwts.parser()
                .verifyWith(getRefreshKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // ── Keys ────────────────────────────────────────────────────────

    private SecretKey getAccessKey() {
        return Keys.hmacShaKeyFor(accessSecret.getBytes());
    }

    private SecretKey getRefreshKey() {
        return Keys.hmacShaKeyFor(refreshSecret.getBytes());
    }
}
