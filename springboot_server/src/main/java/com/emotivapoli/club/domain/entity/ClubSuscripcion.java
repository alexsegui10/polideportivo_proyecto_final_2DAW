package com.emotivapoli.club.domain.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * ClubSuscripcion - Gestión de cobros recurrentes mensuales
 * Controla suscripciones, renovaciones e impagos
 */
@Entity
@Table(name = "club_suscripciones")
public class ClubSuscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private UUID uid = UUID.randomUUID();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_miembro_id", nullable = false)
    private ClubMiembro clubMiembro;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Column(name = "precio_mensual", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioMensual;

    @Column(nullable = false, length = 50)
    private String status = "activa"; // activa, pausada, cancelada, vencida, impago

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "proximo_cobro", nullable = false)
    private LocalDate proximoCobro;

    @Column(name = "intentos_cobro")
    private Integer intentosCobro = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ultimo_pago_id")
    private com.emotivapoli.pago.domain.entity.Pago ultimoPago;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

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

    public ClubMiembro getClubMiembro() {
        return clubMiembro;
    }

    public void setClubMiembro(ClubMiembro clubMiembro) {
        this.clubMiembro = clubMiembro;
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

    public com.emotivapoli.pago.domain.entity.Pago getUltimoPago() {
        return ultimoPago;
    }

    public void setUltimoPago(com.emotivapoli.pago.domain.entity.Pago ultimoPago) {
        this.ultimoPago = ultimoPago;
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
