package com.emotivapoli.reserva.presentation.schemas.request;

import jakarta.validation.constraints.Pattern;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ReservaCreateRequest {
    private Long pistaId;
    private Long usuarioId;
    private Long clubId;
    private LocalDateTime fechaHoraInicio;
    private LocalDateTime fechaHoraFin;
    private BigDecimal precio;

    @Pattern(regexp = "^(efectivo|tarjeta|transferencia)$", message = "El método de pago debe ser uno de: efectivo, tarjeta, transferencia")
    private String metodoPago;

    @Pattern(regexp = "^(pendiente|confirmada|cancelada|completada|eliminado)$", message = "El estado debe ser uno de: pendiente, confirmada, cancelada, completada, eliminado")
    private String status;

    private Boolean isActive;
    private String notas;

    @Pattern(regexp = "^(individual|club|clase)$", message = "El tipo de reserva debe ser uno de: individual, club, clase")
    private String tipoReserva;

    // Getters y Setters
    public Long getPistaId() {
        return pistaId;
    }

    public void setPistaId(Long pistaId) {
        this.pistaId = pistaId;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public Long getClubId() {
        return clubId;
    }

    public void setClubId(Long clubId) {
        this.clubId = clubId;
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

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
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

    public String getNotas() {
        return notas;
    }

    public void setNotas(String notas) {
        this.notas = notas;
    }

    public String getTipoReserva() {
        return tipoReserva;
    }

    public void setTipoReserva(String tipoReserva) {
        this.tipoReserva = tipoReserva;
    }
}
