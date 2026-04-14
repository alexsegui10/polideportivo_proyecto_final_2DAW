package com.emotivapoli.pago.domain.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Pago - Trazabilidad completa de pagos
 * Registra todos los pagos del sistema con FKs directas a reserva, clase_inscripcion o club_suscripcion
 */
@Entity
@Table(name = "pagos")
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private UUID uid = UUID.randomUUID();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private com.emotivapoli.usuario.domain.entity.Usuario usuario;

    // Relaciones directas en lugar de polimórfica
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reserva_id")
    private com.emotivapoli.reserva.domain.entity.Reserva reserva;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clase_inscripcion_id")
    private com.emotivapoli.clase.domain.entity.ClaseInscripcion claseInscripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_suscripcion_id")
    private com.emotivapoli.club.domain.entity.ClubSuscripcion clubSuscripcion;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 3)
    private String currency = "EUR";

    @Column(length = 50)
    private String provider; // stripe, paypal, efectivo, transferencia

    @Column(name = "provider_payment_id", length = 255)
    private String providerPaymentId;

    @Column(name = "stripe_payment_intent_id", length = 255, unique = true)
    private String stripePaymentIntentId;

    @Column(nullable = false, length = 50)
    private String status = "pendiente"; // pendiente, completado, fallido, reembolsado

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

    public com.emotivapoli.usuario.domain.entity.Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(com.emotivapoli.usuario.domain.entity.Usuario usuario) {
        this.usuario = usuario;
    }

    public com.emotivapoli.reserva.domain.entity.Reserva getReserva() {
        return reserva;
    }

    public void setReserva(com.emotivapoli.reserva.domain.entity.Reserva reserva) {
        this.reserva = reserva;
    }

    public com.emotivapoli.clase.domain.entity.ClaseInscripcion getClaseInscripcion() {
        return claseInscripcion;
    }

    public void setClaseInscripcion(com.emotivapoli.clase.domain.entity.ClaseInscripcion claseInscripcion) {
        this.claseInscripcion = claseInscripcion;
    }

    public com.emotivapoli.club.domain.entity.ClubSuscripcion getClubSuscripcion() {
        return clubSuscripcion;
    }

    public void setClubSuscripcion(com.emotivapoli.club.domain.entity.ClubSuscripcion clubSuscripcion) {
        this.clubSuscripcion = clubSuscripcion;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getProviderPaymentId() {
        return providerPaymentId;
    }

    public void setProviderPaymentId(String providerPaymentId) {
        this.providerPaymentId = providerPaymentId;
    }

    public String getStripePaymentIntentId() {
        return stripePaymentIntentId;
    }

    public void setStripePaymentIntentId(String stripePaymentIntentId) {
        this.stripePaymentIntentId = stripePaymentIntentId;
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
