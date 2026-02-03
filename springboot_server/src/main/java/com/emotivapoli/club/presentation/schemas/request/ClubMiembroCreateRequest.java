package com.emotivapoli.club.presentation.schemas.request;

import jakarta.validation.constraints.NotNull;

public class ClubMiembroCreateRequest {
    
    @NotNull(message = "El ID del club es obligatorio")
    private Long clubId;
    
    @NotNull(message = "El ID del usuario es obligatorio")
    private Long usuarioId;

    // Getters y Setters
    public Long getClubId() {
        return clubId;
    }

    public void setClubId(Long clubId) {
        this.clubId = clubId;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }
}
