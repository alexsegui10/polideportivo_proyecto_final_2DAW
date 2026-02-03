package com.emotivapoli.clase.domain.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class ClaseWaitlistDTO {
    private Long id;
    private UUID uid;
    private Long claseId;
    private Long usuarioId;
    private Integer posicion;
    private String status;
    private Boolean isActive;
    private LocalDateTime fechaRegistro;
    private LocalDateTime fechaNotificacion;
    private LocalDateTime fechaExpiracion;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Campos enriquecidos
    private String claseNombre;
    private LocalDateTime claseFechaHoraInicio;
    private String usuarioNombre;
    private String usuarioEmail;

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

    public Integer getPosicion() {
        return posicion;
    }

    public void setPosicion(Integer posicion) {
        this.posicion = posicion;
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

    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDateTime fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    public LocalDateTime getFechaNotificacion() {
        return fechaNotificacion;
    }

    public void setFechaNotificacion(LocalDateTime fechaNotificacion) {
        this.fechaNotificacion = fechaNotificacion;
    }

    public LocalDateTime getFechaExpiracion() {
        return fechaExpiracion;
    }

    public void setFechaExpiracion(LocalDateTime fechaExpiracion) {
        this.fechaExpiracion = fechaExpiracion;
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

    public String getClaseNombre() {
        return claseNombre;
    }

    public void setClaseNombre(String claseNombre) {
        this.claseNombre = claseNombre;
    }

    public LocalDateTime getClaseFechaHoraInicio() {
        return claseFechaHoraInicio;
    }

    public void setClaseFechaHoraInicio(LocalDateTime claseFechaHoraInicio) {
        this.claseFechaHoraInicio = claseFechaHoraInicio;
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
}
