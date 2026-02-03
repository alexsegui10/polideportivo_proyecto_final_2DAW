package com.emotivapoli.clase.presentation.schemas.request;

import jakarta.validation.constraints.NotNull;

public class ClaseWaitlistCreateRequest {
    
    @NotNull(message = "El ID de la clase es obligatorio")
    private Long claseId;
    
    @NotNull(message = "El ID del usuario es obligatorio")
    private Long usuarioId;

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
}
