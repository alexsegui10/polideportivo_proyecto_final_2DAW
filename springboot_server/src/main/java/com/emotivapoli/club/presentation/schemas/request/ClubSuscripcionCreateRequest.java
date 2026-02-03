package com.emotivapoli.club.presentation.schemas.request;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class ClubSuscripcionCreateRequest {
    
    @NotNull(message = "El UID del miembro es obligatorio")
    private String miembroUid;
    
    private BigDecimal precioMensual; // Opcional, usa el del club si no se proporciona

    // Getters y Setters
    public String getMiembroUid() {
        return miembroUid;
    }

    public void setMiembroUid(String miembroUid) {
        this.miembroUid = miembroUid;
    }

    public BigDecimal getPrecioMensual() {
        return precioMensual;
    }

    public void setPrecioMensual(BigDecimal precioMensual) {
        this.precioMensual = precioMensual;
    }
}
