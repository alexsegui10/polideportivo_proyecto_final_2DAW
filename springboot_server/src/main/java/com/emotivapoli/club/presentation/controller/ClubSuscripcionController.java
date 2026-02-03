package com.emotivapoli.club.presentation.controller;

import com.emotivapoli.club.application.mapper.ClubSuscripcionMapper;
import com.emotivapoli.club.application.service.ClubSuscripcionService;
import com.emotivapoli.club.domain.dto.ClubSuscripcionDTO;
import com.emotivapoli.club.presentation.schemas.request.ClubSuscripcionCreateRequest;
import com.emotivapoli.club.presentation.schemas.response.ClubSuscripcionResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Controlador para gestión de suscripciones mensuales
 * Lógica de presentación: validación y transformación de datos
 */
@Component
public class ClubSuscripcionController {

    @Autowired
    private ClubSuscripcionService clubSuscripcionService;

    @Autowired
    private ClubSuscripcionMapper clubSuscripcionMapper;

    /**
     * Crear suscripción mensual para un miembro
     */
    public ClubSuscripcionResponse crearSuscripcion(ClubSuscripcionCreateRequest request) {
        ClubSuscripcionDTO dto = clubSuscripcionService.crearSuscripcion(
                UUID.fromString(request.getMiembroUid()), 
                request.getPrecioMensual()
        );
        return clubSuscripcionMapper.toResponse(dto);
    }

    /**
     * Obtener suscripción por UID
     */
    public ClubSuscripcionResponse getSuscripcionByUid(String uid) {
        ClubSuscripcionDTO dto = clubSuscripcionService.getSuscripcionByUid(UUID.fromString(uid));
        return clubSuscripcionMapper.toResponse(dto);
    }

    /**
     * Listar suscripciones de un miembro
     */
    public List<ClubSuscripcionResponse> getSuscripcionesByMiembroUid(String miembroUid) {
        return clubSuscripcionService.getSuscripcionesByMiembroUid(UUID.fromString(miembroUid)).stream()
                .map(clubSuscripcionMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Listar suscripciones de un club
     */
    public List<ClubSuscripcionResponse> getSuscripcionesByClubId(Long clubId) {
        return clubSuscripcionService.getSuscripcionesByClubId(clubId).stream()
                .map(clubSuscripcionMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Cancelar suscripción
     */
    public void cancelarSuscripcion(String uid) {
        clubSuscripcionService.cancelarSuscripcion(UUID.fromString(uid));
    }

    /**
     * Pausar suscripción
     */
    public void pausarSuscripcion(String uid) {
        clubSuscripcionService.pausarSuscripcion(UUID.fromString(uid));
    }

    /**
     * Reanudar suscripción pausada
     */
    public void reanudarSuscripcion(String uid) {
        clubSuscripcionService.reanudarSuscripcion(UUID.fromString(uid));
    }

    /**
     * Registrar cobro exitoso (llamado por webhook de Stripe)
     */
    public void registrarCobroExitoso(String uid, Long pagoId) {
        clubSuscripcionService.registrarCobroExitoso(UUID.fromString(uid), pagoId);
    }

    /**
     * Registrar cobro fallido (llamado por webhook de Stripe)
     */
    public void registrarCobroFallido(String uid) {
        clubSuscripcionService.registrarCobroFallido(UUID.fromString(uid));
    }

    /**
     * Obtener suscripciones pendientes de cobro (para cron job)
     */
    public List<ClubSuscripcionResponse> getSuscripcionesPendientesCobro(String fecha) {
        LocalDate localDate = fecha != null ? LocalDate.parse(fecha) : LocalDate.now();
        return clubSuscripcionService.getSuscripcionesPendientesCobro(localDate).stream()
                .map(clubSuscripcionMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener suscripciones con impago para reintentar
     */
    public List<ClubSuscripcionResponse> getSuscripcionesImpagosRetryables() {
        return clubSuscripcionService.getSuscripcionesImpagosRetryables().stream()
                .map(clubSuscripcionMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Listar todas las suscripciones activas
     */
    public List<ClubSuscripcionResponse> getAllSuscripcionesActivas() {
        return clubSuscripcionService.getAllSuscripcionesActivas().stream()
                .map(clubSuscripcionMapper::toResponse)
                .collect(Collectors.toList());
    }
}
