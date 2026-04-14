package com.emotivapoli.pago.presentation.schemas.request;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class CreatePaymentIntentRequest {

    @NotNull(message = "El ID de la pista es obligatorio")
    private Long pistaId;

    @NotNull(message = "El ID del usuario es obligatorio")
    private Long usuarioId;

    @NotNull(message = "La fecha/hora de inicio es obligatoria")
    private String fechaHoraInicio; // ISO-8601: "2024-03-15T10:00:00"

    @NotNull(message = "La fecha/hora de fin es obligatoria")
    private String fechaHoraFin;

    @NotNull(message = "El precio es obligatorio")
    private BigDecimal precio;

    public Long getPistaId() { return pistaId; }
    public void setPistaId(Long pistaId) { this.pistaId = pistaId; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public String getFechaHoraInicio() { return fechaHoraInicio; }
    public void setFechaHoraInicio(String fechaHoraInicio) { this.fechaHoraInicio = fechaHoraInicio; }

    public String getFechaHoraFin() { return fechaHoraFin; }
    public void setFechaHoraFin(String fechaHoraFin) { this.fechaHoraFin = fechaHoraFin; }

    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
}
