package com.emotivapoli.club.application.service;

import com.emotivapoli.club.application.mapper.ClubSuscripcionMapper;
import com.emotivapoli.club.domain.dto.ClubSuscripcionDTO;
import com.emotivapoli.club.domain.entity.ClubMiembro;
import com.emotivapoli.club.domain.entity.ClubSuscripcion;
import com.emotivapoli.club.infrastructure.repository.ClubMiembroRepository;
import com.emotivapoli.club.infrastructure.repository.ClubSuscripcionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ClubSuscripcionService {

    @Autowired
    private ClubSuscripcionRepository clubSuscripcionRepository;

    @Autowired
    private ClubMiembroRepository clubMiembroRepository;

    @Autowired
    private ClubSuscripcionMapper clubSuscripcionMapper;

    /**
     * Crear suscripción mensual para un miembro
     * Valida que el miembro esté activo y no tenga suscripción activa
     */
    @Transactional
    public ClubSuscripcionDTO crearSuscripcion(UUID miembroUid, BigDecimal precioMensual) {
        ClubMiembro miembro = clubMiembroRepository.findByUid(miembroUid)
                .orElseThrow(() -> new RuntimeException("Miembro no encontrado con UID: " + miembroUid));

        if (!miembro.getStatus().equals("activo") || !miembro.getIsActive()) {
            throw new RuntimeException("El miembro debe estar activo para crear una suscripción");
        }

        clubSuscripcionRepository.findActivaByMiembroId(miembro.getId())
                .ifPresent(s -> {
                    throw new RuntimeException("El miembro ya tiene una suscripción activa");
                });

        BigDecimal precio = precioMensual != null ? precioMensual : miembro.getClub().getPrecioMensual();
        if (precio == null) {
            throw new RuntimeException("Debe proporcionar un precio mensual");
        }

        ClubSuscripcion suscripcion = new ClubSuscripcion();
        suscripcion.setUid(UUID.randomUUID());
        suscripcion.setClubMiembro(miembro);
        suscripcion.setFechaInicio(LocalDate.now());
        suscripcion.setPrecioMensual(precio);
        suscripcion.setStatus("activa");
        suscripcion.setIsActive(true);
        suscripcion.setProximoCobro(LocalDate.now().plusMonths(1)); // Primer cobro en 1 mes
        suscripcion.setIntentosCobro(0);
        suscripcion.setCreatedAt(LocalDateTime.now());
        suscripcion.setUpdatedAt(LocalDateTime.now());

        ClubSuscripcion saved = clubSuscripcionRepository.save(suscripcion);
        return clubSuscripcionMapper.toDTO(saved);
    }

    public ClubSuscripcionDTO getSuscripcionByUid(UUID uid) {
        ClubSuscripcion suscripcion = clubSuscripcionRepository.findByUid(uid)
                .orElseThrow(() -> new RuntimeException("Suscripción no encontrada con UID: " + uid));
        return clubSuscripcionMapper.toDTO(suscripcion);
    }

    public List<ClubSuscripcionDTO> getSuscripcionesByMiembroUid(UUID miembroUid) {
        ClubMiembro miembro = clubMiembroRepository.findByUid(miembroUid)
                .orElseThrow(() -> new RuntimeException("Miembro no encontrado"));
        
        return clubSuscripcionRepository.findByMiembroId(miembro.getId()).stream()
                .map(clubSuscripcionMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<ClubSuscripcionDTO> getSuscripcionesByClubId(Long clubId) {
        return clubSuscripcionRepository.findByClubId(clubId).stream()
                .map(clubSuscripcionMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void cancelarSuscripcion(UUID uid) {
        ClubSuscripcion suscripcion = clubSuscripcionRepository.findByUid(uid)
                .orElseThrow(() -> new RuntimeException("Suscripción no encontrada"));

        suscripcion.setStatus("cancelada");
        suscripcion.setIsActive(false);
        suscripcion.setFechaFin(LocalDate.now());
        suscripcion.setUpdatedAt(LocalDateTime.now());

        clubSuscripcionRepository.save(suscripcion);
    }

    @Transactional
    public void pausarSuscripcion(UUID uid) {
        ClubSuscripcion suscripcion = clubSuscripcionRepository.findByUid(uid)
                .orElseThrow(() -> new RuntimeException("Suscripción no encontrada"));

        if (!suscripcion.getStatus().equals("activa")) {
            throw new RuntimeException("Solo se pueden pausar suscripciones activas");
        }

        suscripcion.setStatus("pausada");
        suscripcion.setUpdatedAt(LocalDateTime.now());

        clubSuscripcionRepository.save(suscripcion);
    }

    @Transactional
    public void reanudarSuscripcion(UUID uid) {
        ClubSuscripcion suscripcion = clubSuscripcionRepository.findByUid(uid)
                .orElseThrow(() -> new RuntimeException("Suscripción no encontrada"));

        if (!suscripcion.getStatus().equals("pausada")) {
            throw new RuntimeException("Solo se pueden reanudar suscripciones pausadas");
        }

        suscripcion.setStatus("activa");
        suscripcion.setProximoCobro(LocalDate.now().plusMonths(1));
        suscripcion.setUpdatedAt(LocalDateTime.now());

        clubSuscripcionRepository.save(suscripcion);
    }

    /**
     * Registrar cobro exitoso
     * Actualiza próximo cobro y resetea intentos
     */
    @Transactional
    public void registrarCobroExitoso(UUID uid, Long pagoId) {
        ClubSuscripcion suscripcion = clubSuscripcionRepository.findByUid(uid)
                .orElseThrow(() -> new RuntimeException("Suscripción no encontrada"));

        suscripcion.setStatus("activa");
        suscripcion.setProximoCobro(suscripcion.getProximoCobro().plusMonths(1));
        suscripcion.setIntentosCobro(0);
        suscripcion.setUpdatedAt(LocalDateTime.now());

        clubSuscripcionRepository.save(suscripcion);
    }

    /**
     * Registrar cobro fallido
     * Incrementa intentos y marca como impago si supera 3 intentos
     */
    @Transactional
    public void registrarCobroFallido(UUID uid) {
        ClubSuscripcion suscripcion = clubSuscripcionRepository.findByUid(uid)
                .orElseThrow(() -> new RuntimeException("Suscripción no encontrada"));

        suscripcion.setIntentosCobro(suscripcion.getIntentosCobro() + 1);

        if (suscripcion.getIntentosCobro() >= 3) {
            suscripcion.setStatus("impago");
        } else {
            suscripcion.setStatus("impago");
        }

        suscripcion.setUpdatedAt(LocalDateTime.now());
        clubSuscripcionRepository.save(suscripcion);
    }

    public List<ClubSuscripcionDTO> getSuscripcionesPendientesCobro(LocalDate fecha) {
        return clubSuscripcionRepository.findPendientesCobro(fecha).stream()
                .map(clubSuscripcionMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<ClubSuscripcionDTO> getSuscripcionesImpagosRetryables() {
        return clubSuscripcionRepository.findImpagosRetryables().stream()
                .map(clubSuscripcionMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<ClubSuscripcionDTO> getAllSuscripcionesActivas() {
        return clubSuscripcionRepository.findActivas().stream()
                .map(clubSuscripcionMapper::toDTO)
                .collect(Collectors.toList());
    }
}
