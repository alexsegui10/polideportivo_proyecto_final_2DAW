package com.emotivapoli.clase.presentation.schemas.request;

import jakarta.validation.constraints.Pattern;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ClaseCreateRequest {
    private String nombre;
    private String descripcion;
    private String imagen;
    private Long entrenadorId;
    private Long pistaId;
    private LocalDateTime fechaHoraInicio;
    private LocalDateTime fechaHoraFin;
    private Integer duracionMinutos;
    private Integer maxParticipantes;
    private BigDecimal precio;

    @Pattern(regexp = "^(principiante|intermedio|avanzado)$", message = "El nivel debe ser uno de: principiante, intermedio, avanzado")
    private String nivel;

    @Pattern(regexp = "^(Pádel|Tenis|Fútbol Sala|Baloncesto|Spinning|Yoga)$", message = "El deporte debe ser uno de: Pádel, Tenis, Fútbol Sala, Baloncesto, Spinning, Yoga")
    private String deporte;

    @Pattern(regexp = "^(programada|en_curso|finalizada|cancelada|eliminado)$", message = "El estado debe ser uno de: programada, en_curso, finalizada, cancelada, eliminado")
    private String status;
    private Boolean isActive;

    // Getters y Setters
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public Long getEntrenadorId() {
        return entrenadorId;
    }

    public void setEntrenadorId(Long entrenadorId) {
        this.entrenadorId = entrenadorId;
    }

    public Long getPistaId() {
        return pistaId;
    }

    public void setPistaId(Long pistaId) {
        this.pistaId = pistaId;
    }

    public LocalDateTime getFechaHoraInicio() {
        return fechaHoraInicio;
    }

    public void setFechaHoraInicio(LocalDateTime fechaHoraInicio) {
        this.fechaHoraInicio = fechaHoraInicio;
    }

    public LocalDateTime getFechaHoraFin() {
        return fechaHoraFin;
    }

    public void setFechaHoraFin(LocalDateTime fechaHoraFin) {
        this.fechaHoraFin = fechaHoraFin;
    }

    public Integer getDuracionMinutos() {
        return duracionMinutos;
    }

    public void setDuracionMinutos(Integer duracionMinutos) {
        this.duracionMinutos = duracionMinutos;
    }

    public Integer getMaxParticipantes() {
        return maxParticipantes;
    }

    public void setMaxParticipantes(Integer maxParticipantes) {
        this.maxParticipantes = maxParticipantes;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public String getNivel() {
        return nivel;
    }

    public void setNivel(String nivel) {
        this.nivel = nivel;
    }

    public String getDeporte() {
        return deporte;
    }

    public void setDeporte(String deporte) {
        this.deporte = deporte;
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
}
