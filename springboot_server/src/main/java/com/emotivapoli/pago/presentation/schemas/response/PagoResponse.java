package com.emotivapoli.pago.presentation.schemas.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class PagoResponse {
    private Long id;
    private UUID uid;
    private Long usuarioId;
    private Long reservaId;
    private Long claseInscripcionId;
    private Long clubSuscripcionId;
    private BigDecimal amount;
    private String currency;
    private String provider;
    private String providerPaymentId;
    private String status;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UUID getUid() { return uid; }
    public void setUid(UUID uid) { this.uid = uid; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public Long getReservaId() { return reservaId; }
    public void setReservaId(Long reservaId) { this.reservaId = reservaId; }

    public Long getClaseInscripcionId() { return claseInscripcionId; }
    public void setClaseInscripcionId(Long claseInscripcionId) { this.claseInscripcionId = claseInscripcionId; }

    public Long getClubSuscripcionId() { return clubSuscripcionId; }
    public void setClubSuscripcionId(Long clubSuscripcionId) { this.clubSuscripcionId = clubSuscripcionId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getProviderPaymentId() { return providerPaymentId; }
    public void setProviderPaymentId(String providerPaymentId) { this.providerPaymentId = providerPaymentId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
