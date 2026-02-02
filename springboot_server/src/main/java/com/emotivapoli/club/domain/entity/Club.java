package com.emotivapoli.club.domain.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "clubs")
public class Club {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private UUID uid = UUID.randomUUID();

    @Column(unique = true, nullable = false)
    private String slug;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(length = 100)
    private String deporte;

    @Column(columnDefinition = "TEXT")
    private String imagen;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entrenador_id")
    private com.emotivapoli.usuario.domain.entity.Usuario entrenador;

    @Column(name = "max_miembros", nullable = false)
    private Integer maxMiembros = 20;

    @Column(length = 50)
    private String nivel; // principiante, intermedio, avanzado

    @Column(name = "precio_mensual", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioMensual;

    @Column(nullable = false, length = 50)
    private String status = "activo"; // activo, inactivo, completo, eliminado

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Relación One-to-Many con Reservas
    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<com.emotivapoli.reserva.domain.entity.Reserva> reservas = new ArrayList<>();

    // Relación Many-to-Many con Usuarios a través de ClubMiembro
    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ClubMiembro> miembros = new ArrayList<>();

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

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

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

    public com.emotivapoli.usuario.domain.entity.Usuario getEntrenador() {
        return entrenador;
    }

    public void setEntrenador(com.emotivapoli.usuario.domain.entity.Usuario entrenador) {
        this.entrenador = entrenador;
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

    public List<com.emotivapoli.reserva.domain.entity.Reserva> getReservas() {
        return reservas;
    }

    public void setReservas(List<com.emotivapoli.reserva.domain.entity.Reserva> reservas) {
        this.reservas = reservas;
    }

    public List<ClubMiembro> getMiembros() {
        return miembros;
    }

    public void setMiembros(List<ClubMiembro> miembros) {
        this.miembros = miembros;
    }
}
