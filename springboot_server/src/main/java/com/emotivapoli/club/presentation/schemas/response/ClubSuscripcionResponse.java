package com.emotivapoli.club.presentation.schemas.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class ClubSuscripcionResponse {
    private Long id;
    private UUID uid;
    private UUID clubMiembroUid;
    private String clubNombre;
    private String usuarioNombre;
    private String usuarioEmail;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private BigDecimal precioMensual;
    private String status;
    private Boolean isActive;
    private LocalDate proximoCobro;
    private Integer intentosCobro;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UUID getUid() {
        return uid;
    }

    public void setUid(UUID uid) {
        this.uid = uid;
    }

    public UUID getClubMiembroUid() {
        return clubMiembroUid;
    }

    public void setClubMiembroUid(UUID clubMiembroUid) {
        this.clubMiembroUid = clubMiembroUid;
    }

    public String getClubNombre() {
        return clubNombre;
    }

    public void setClubNombre(String clubNombre) {
        this.clubNombre = clubNombre;
    }

    public String getUsuarioNombre() {
        return usuarioNombre;
    }

    public void setUsuarioNombre(String usuarioNombre) {
        this.usuarioNombre = usuarioNombre;
    }

    public String getUsuarioEmail() {
        return usuarioEmail;
    }

    public void setUsuarioEmail(String usuarioEmail) {
        this.usuarioEmail = usuarioEmail;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public BigDecimal getPrecioMensual() {
        return precioMensual;
    }

    public void setPrecioMensual(BigDecimal precioMensual) {
        this.precioMensual = precioMensual;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public LocalDate getProximoCobro() {
        return proximoCobro;
    }

    public void setProximoCobro(LocalDate proximoCobro) {
        this.proximoCobro = proximoCobro;
    }

    public Integer getIntentosCobro() {
        return intentosCobro;
    }

    public void setIntentosCobro(Integer intentosCobro) {
        this.intentosCobro = intentosCobro;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
