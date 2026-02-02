package com.emotivapoli.pista.domain.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pistas")
public class Pista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 50)
    private String tipo;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(nullable = false, unique = true, length = 150)
    private String slug;

    @Column(name = "precio_hora", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioHora;

    @Column(length = 500)
    private String descripcion;

    @Column(length = 500)
    private String imagen;

    // Relación One-to-Many con Reservas
    @OneToMany(mappedBy = "pista", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<com.emotivapoli.reserva.domain.entity.Reserva> reservas = new ArrayList<>();

    // Relación One-to-Many con ClasesPublicas
    @OneToMany(mappedBy = "pista", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<com.emotivapoli.clase.domain.entity.ClasePublica> clases = new ArrayList<>();

    // Relación One-to-Many con EventosPista (control de solapes)
    @OneToMany(mappedBy = "pista", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<com.emotivapoli.evento.domain.entity.EventoPista> eventos = new ArrayList<>();

    // Constructor vacío
    public Pista() {
    }

    // Constructor completo
    public Pista(Long id, String nombre, String tipo, String status, Boolean isActive, 
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

    public List<com.emotivapoli.reserva.domain.entity.Reserva> getReservas() {
        return reservas;
    }

    public void setReservas(List<com.emotivapoli.reserva.domain.entity.Reserva> reservas) {
        this.reservas = reservas;
    }

    public List<com.emotivapoli.clase.domain.entity.ClasePublica> getClases() {
        return clases;
    }

    public void setClases(List<com.emotivapoli.clase.domain.entity.ClasePublica> clases) {
        this.clases = clases;
    }

    public List<com.emotivapoli.evento.domain.entity.EventoPista> getEventos() {
        return eventos;
    }

    public void setEventos(List<com.emotivapoli.evento.domain.entity.EventoPista> eventos) {
        this.eventos = eventos;
    }
}
