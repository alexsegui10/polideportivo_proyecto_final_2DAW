package com.emotivapoli.evento.domain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * EventoPista - Control de solapes de agenda
 * Evita que se solapen reservas, clases y mantenimientos en la misma pista
 */
@Entity
@Table(name = "eventos_pista")
public class EventoPista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private UUID uid = UUID.randomUUID();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pista_id", nullable = false)
    private com.emotivapoli.pista.domain.entity.Pista pista;

    @Column(name = "tipo_evento", nullable = false, length = 50)
    private String tipoEvento; // reserva, clase, mantenimiento, bloqueo

    // Relaciones directas en lugar de polimórfica
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reserva_id")
    private com.emotivapoli.reserva.domain.entity.Reserva reserva;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clase_publica_id")
    private com.emotivapoli.clase.domain.entity.ClasePublica clasePublica;

    @Column(name = "fecha_hora_inicio", nullable = false)
    private LocalDateTime fechaHoraInicio;

    @Column(name = "fecha_hora_fin", nullable = false)
    private LocalDateTime fechaHoraFin;

    @Column(nullable = false, length = 50)
    private String status = "confirmado"; // confirmado, cancelado, eliminado

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

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

    public com.emotivapoli.pista.domain.entity.Pista getPista() {
        return pista;
    }

    public void setPista(com.emotivapoli.pista.domain.entity.Pista pista) {
        this.pista = pista;
    }

    public String getTipoEvento() {
        return tipoEvento;
    }

    public void setTipoEvento(String tipoEvento) {
        this.tipoEvento = tipoEvento;
    }

    public com.emotivapoli.reserva.domain.entity.Reserva getReserva() {
        return reserva;
    }

    public void setReserva(com.emotivapoli.reserva.domain.entity.Reserva reserva) {
        this.reserva = reserva;
    }

    public com.emotivapoli.clase.domain.entity.ClasePublica getClasePublica() {
        return clasePublica;
    }

    public void setClasePublica(com.emotivapoli.clase.domain.entity.ClasePublica clasePublica) {
        this.clasePublica = clasePublica;
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
}
