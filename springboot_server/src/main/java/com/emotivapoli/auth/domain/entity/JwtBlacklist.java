package com.emotivapoli.auth.domain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entrada en la blacklist de access tokens.
 *
 * Se crea en cada logout para invalidar el access token que tenía el usuario,
 * aunque el JWT aún no haya expirado (los JWTs son stateless por naturaleza).
 *
 * DISTINCIÓN con refresh_sessions.revoked:
 *   - jwt_blacklist: tokens de ACCESO revocados voluntariamente (logout).
 *   - refresh_sessions.revoked: familias de REFRESH comprometidas (theft detection).
 *
 * Ciclo de vida: se limpian automáticamente cuando expires_at < NOW().
 */
@Entity
@Table(name = "jwt_blacklist", indexes = {
        @Index(name = "idx_jwt_blacklist_hash",       columnList = "token_hash"),
        @Index(name = "idx_jwt_blacklist_expires_at", columnList = "expires_at")
})
public class JwtBlacklist {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /** SHA-256 del access token en claro. Nunca almacenamos JWT en texto. */
    @Column(name = "token_hash", nullable = false, unique = true, length = 64)
    private String tokenHash;

    /** Fecha de expiración del JWT original (para saber cuándo limpiar esta fila). */
    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    /** Cuándo se añadió a la blacklist (= cuándo hizo logout el usuario). */
    @Column(name = "revoked_at", nullable = false)
    private LocalDateTime revokedAt = LocalDateTime.now();

    public JwtBlacklist() {}

    public JwtBlacklist(String tokenHash, LocalDateTime expiresAt) {
        this.tokenHash = tokenHash;
        this.expiresAt = expiresAt;
        this.revokedAt = LocalDateTime.now();
    }

    public UUID getId()               { return id; }
    public String getTokenHash()      { return tokenHash; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public LocalDateTime getRevokedAt() { return revokedAt; }

    public void setTokenHash(String tokenHash)      { this.tokenHash = tokenHash; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
    public void setRevokedAt(LocalDateTime revokedAt) { this.revokedAt = revokedAt; }
}
