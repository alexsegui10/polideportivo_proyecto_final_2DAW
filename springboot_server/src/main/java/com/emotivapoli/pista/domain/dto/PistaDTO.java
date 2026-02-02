package com.emotivapoli.pista.domain.dto;

import java.math.BigDecimal;

public class PistaDTO {

    private Long id;
    private String nombre;
    private String tipo;
    private String status;
    private Boolean isActive;
    private String slug;
    private BigDecimal precioHora;
    private String descripcion;
    private String imagen;

    // Constructor vacío
    public PistaDTO() {
    }

    // Constructor completo
    public PistaDTO(Long id, String nombre, String tipo, String status, Boolean isActive,
                    String slug, BigDecimal precioHora, String descripcion, String imagen) {
        this.id = id;
        this.nombre = nombre;
        this.tipo = tipo;
        this.status = status;
        this.isActive = isActive;
        this.slug = slug;
        this.precioHora = precioHora;
        this.descripcion = descripcion;
        this.imagen = imagen;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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
