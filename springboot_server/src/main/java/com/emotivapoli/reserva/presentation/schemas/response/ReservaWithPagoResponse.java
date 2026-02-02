package com.emotivapoli.reserva.presentation.schemas.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class ReservaWithPagoResponse {
    private Long id;
    private UUID uid;
    private String slug;
    private Long pistaId;
    private String pistaNombre;
    private Long usuarioId;
    private String usuarioNombre;
    private Long clubId;
    private LocalDateTime fechaHoraInicio;
    private LocalDateTime fechaHoraFin;
    private BigDecimal precio;
    private String metodoPago;
    private String status;
    private Boolean isActive;
    private String notas;
    private String tipoReserva;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Datos del pago (JOIN)
    private Long pagoId;
    private BigDecimal pagoAmount;
    private String pagoStatus;
    private String pagoProvider;

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UUID getUid() { return uid; }
    public void setUid(UUID uid) { this.uid = uid; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public Long getPistaId() { return pistaId; }
    public void setPistaId(Long pistaId) { this.pistaId = pistaId; }

    public String getPistaNombre() { return pistaNombre; }
    public void setPistaNombre(String pistaNombre) { this.pistaNombre = pistaNombre; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public String getUsuarioNombre() { return usuarioNombre; }
    public void setUsuarioNombre(String usuarioNombre) { this.usuarioNombre = usuarioNombre; }

    public Long getClubId() { return clubId; }
    public void setClubId(Long clubId) { this.clubId = clubId; }

    public LocalDateTime getFechaHoraInicio() { return fechaHoraInicio; }
    public void setFechaHoraInicio(LocalDateTime fechaHoraInicio) { this.fechaHoraInicio = fechaHoraInicio; }

    public LocalDateTime getFechaHoraFin() { return fechaHoraFin; }
    public void setFechaHoraFin(LocalDateTime fechaHoraFin) { this.fechaHoraFin = fechaHoraFin; }

    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }

    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }

    public String getTipoReserva() { return tipoReserva; }
    public void setTipoReserva(String tipoReserva) { this.tipoReserva = tipoReserva; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getPagoId() { return pagoId; }
    public void setPagoId(Long pagoId) { this.pagoId = pagoId; }

    public BigDecimal getPagoAmount() { return pagoAmount; }
    public void setPagoAmount(BigDecimal pagoAmount) { this.pagoAmount = pagoAmount; }

    public String getPagoStatus() { return pagoStatus; }
    public void setPagoStatus(String pagoStatus) { this.pagoStatus = pagoStatus; }

    public String getPagoProvider() { return pagoProvider; }
    public void setPagoProvider(String pagoProvider) { this.pagoProvider = pagoProvider; }
}
