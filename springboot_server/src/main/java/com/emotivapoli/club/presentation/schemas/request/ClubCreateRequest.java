package com.emotivapoli.club.presentation.schemas.request;

import jakarta.validation.constraints.Pattern;
import java.math.BigDecimal;

public class ClubCreateRequest {
    private String nombre;
    private String descripcion;

    @Pattern(regexp = "^(Pádel|Tenis|Fútbol Sala|Baloncesto|Spinning|Yoga)$", message = "El deporte debe ser uno de: Pádel, Tenis, Fútbol Sala, Baloncesto, Spinning, Yoga")
    private String deporte;
    private String imagen;
    private Long entrenadorId;
    private Integer maxMiembros;

    @Pattern(regexp = "^(principiante|intermedio|avanzado)$", message = "El nivel debe ser uno de: principiante, intermedio, avanzado")
    private String nivel;

    private BigDecimal precioMensual;

    @Pattern(regexp = "^(activo|inactivo|completo|eliminado)$", message = "El estado debe ser uno de: activo, inactivo, completo, eliminado")
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

    public String getDeporte() {
        return deporte;
    }

    public void setDeporte(String deporte) {
        this.deporte = deporte;
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

    public Integer getMaxMiembros() {
        return maxMiembros;
    }

    public void setMaxMiembros(Integer maxMiembros) {
        this.maxMiembros = maxMiembros;
    }

    public String getNivel() {
        return nivel;
    }

    public void setNivel(String nivel) {
        this.nivel = nivel;
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
}
