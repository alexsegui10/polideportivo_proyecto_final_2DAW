package com.emotivapoli.auth.domain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entidad que representa una sesión de refresh token.
 * Cada fila = un dispositivo/familia de tokens.
 *
 *   - familyId   → detectar robo de token reutilizado
 *   - deviceId   → logout por dispositivo
 *   - revoked    → blacklist de refresh tokens
 *   - sessionVersion → logout global (invalida TODOS los dispositivos)
 */
@Entity
@Table(name = "refresh_sessions", indexes = {
        @Index(name = "idx_refresh_sessions_family_id", columnList = "family_id"),
        @Index(name = "idx_refresh_sessions_user_id",   columnList = "user_id"),
        @Index(name = "idx_refresh_sessions_device",    columnList = "user_id, device_id")
})
public class RefreshSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /** FK al usuario propietario de la sesión */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /**
     * Identifica el dispositivo (navegador, app, etc.).
     * El frontend lo genera una vez y lo persiste en localStorage.
     */
    @Column(name = "device_id", nullable = false, length = 255)
    private String deviceId;

    /**
     * UUID que agrupa todos los tokens de una misma cadena de rotación.
     * Si se detecta reuse (token ya rotado llega de nuevo) → se revoca toda la familia.
     */
    @Column(name = "family_id", nullable = false)
    private UUID familyId;

    /**
     * SHA-256 del refresh token actual.
     * Nunca almacenamos el token en claro.
     */
    @Column(name = "current_token_hash", nullable = false, length = 64)
    private String currentTokenHash;

    /** true = esta familia está revocada (logout o token theft detectado) */
    @Column(nullable = false)
    private Boolean revoked = false;

    /**
     * Copia de usuarios.session_version al momento de crear la sesión.
     * Si el usuario hace logout global, session_version se incrementa y
     * todos los refresh tokens quedan inválidos.
     */
    @Column(name = "session_version", nullable = false)
    private Integer sessionVersion = 0;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "last_used_at")
    private LocalDateTime lastUsedAt;

    // ── Constructores ────────────────────────────────────────────────

    public RefreshSession() {}

    public RefreshSession(Long userId, String deviceId, UUID familyId,
                          String currentTokenHash, Integer sessionVersion) {
        this.userId = userId;
        this.deviceId = deviceId;
        this.familyId = familyId;
        this.currentTokenHash = currentTokenHash;
        this.sessionVersion = sessionVersion;
    }

    // ── Getters y Setters ────────────────────────────────────────────

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }

    public UUID getFamilyId() { return familyId; }
    public void setFamilyId(UUID familyId) { this.familyId = familyId; }

    public String getCurrentTokenHash() { return currentTokenHash; }
    public void setCurrentTokenHash(String currentTokenHash) { this.currentTokenHash = currentTokenHash; }

    public Boolean getRevoked() { return revoked; }
    public void setRevoked(Boolean revoked) { this.revoked = revoked; }

    public Integer getSessionVersion() { return sessionVersion; }
    public void setSessionVersion(Integer sessionVersion) { this.sessionVersion = sessionVersion; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getLastUsedAt() { return lastUsedAt; }
    public void setLastUsedAt(LocalDateTime lastUsedAt) { this.lastUsedAt = lastUsedAt; }
}
