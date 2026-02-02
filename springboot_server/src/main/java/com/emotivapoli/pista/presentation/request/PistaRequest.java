package com.emotivapoli.pista.presentation.request;

import jakarta.validation.constraints.Pattern;
import java.math.BigDecimal;

public class PistaRequest {

    private String nombre;

    @Pattern(regexp = "^(Pádel|Tenis|Fútbol Sala|Baloncesto|Spinning|Yoga)$", message = "El deporte debe ser uno de: Pádel, Tenis, Fútbol Sala, Baloncesto, Spinning, Yoga")
    private String tipo;

    @Pattern(regexp = "^(disponible|ocupada|mantenimiento|eliminado)$", message = "El estado debe ser uno de: disponible, ocupada, mantenimiento, eliminado")
    private String status;
    private Boolean isActive;
    private String slug;
    private BigDecimal precioHora;
    private String descripcion;
    private String imagen;

    // Constructor vacío
    public PistaRequest() {
    }

    // Getters y Setters
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
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

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public BigDecimal getPrecioHora() {
        return precioHora;
    }

    public void setPrecioHora(BigDecimal precioHora) {
        this.precioHora = precioHora;
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
}
