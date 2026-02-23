package com.emotivapoli.auth.domain.dto;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO de la capa de dominio para RefreshSession.
 * Se usa para pasar datos entre capas sin exponer la entidad JPA.
 */
public class RefreshSessionDTO {

    private UUID id;
    private Long userId;
    private String deviceId;
    private UUID familyId;
    private String currentTokenHash;
    private Boolean revoked;
    private Integer sessionVersion;
    private LocalDateTime createdAt;
    private LocalDateTime lastUsedAt;

    public RefreshSessionDTO() {}

    public RefreshSessionDTO(UUID id, Long userId, String deviceId, UUID familyId,
                              String currentTokenHash, Boolean revoked,
                              Integer sessionVersion, LocalDateTime createdAt,
                              LocalDateTime lastUsedAt) {
        this.id = id;
        this.userId = userId;
        this.deviceId = deviceId;
        this.familyId = familyId;
        this.currentTokenHash = currentTokenHash;
        this.revoked = revoked;
        this.sessionVersion = sessionVersion;
        this.createdAt = createdAt;
        this.lastUsedAt = lastUsedAt;
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
