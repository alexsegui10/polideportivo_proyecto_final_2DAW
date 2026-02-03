package com.emotivapoli.clase.presentation.schemas.request;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class ClaseInscripcionCreateRequest {
    
    @NotNull(message = "El ID de la clase es obligatorio")
    private Long claseId;
    
    @NotNull(message = "El ID del usuario es obligatorio")
    private Long usuarioId;
    
    private BigDecimal precioPagado;
    private String metodoPago;

    public Long getClaseId() {
        return claseId;
    }

    public void setClaseId(Long claseId) {
        this.claseId = claseId;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public BigDecimal getPrecioPagado() {
        return precioPagado;
    }

    public void setPrecioPagado(BigDecimal precioPagado) {
        this.precioPagado = precioPagado;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }
}
