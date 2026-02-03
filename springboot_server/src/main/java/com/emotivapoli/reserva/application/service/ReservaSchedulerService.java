package com.emotivapoli.reserva.application.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.util.List;

/**
 * Servicio para actualizar automáticamente los estados de las reservas.
 * Ejecuta una función PostgreSQL cada 15 minutos que:
 * - Cambia reservas confirmadas a completadas si su hora de fin ya pasó
 * - Cambia reservas pendientes a canceladas si su hora de inicio ya pasó
 */
@Service
public class ReservaSchedulerService {

    private static final Logger logger = LoggerFactory.getLogger(ReservaSchedulerService.class);

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Ejecuta cada 5 minutos para actualizar estados de reservas y clases.
     */
    @Scheduled(cron = "0 0/5 * * * *")
    @Transactional
    public void actualizarEstadosReservas() {
        try {
            logger.info("Ejecutando actualización automática de estados...");
            
            // Llamar a las funciones PostgreSQL (void functions)
            entityManager.createNativeQuery("SELECT actualizar_estado_reservas()").executeUpdate();
            entityManager.createNativeQuery("SELECT actualizar_estado_clases()").executeUpdate();
            
            logger.info("Estados actualizados correctamente");
            
        } catch (Exception e) {
            logger.error("Error al actualizar estados automáticamente: {}", e.getMessage(), e);
        }
    }

    /**
     * Método público para forzar actualización manual (útil para testing o endpoints admin)
     */
    @Transactional
    public void forzarActualizacion() {
        logger.info("Actualizacion manual forzada de estados de reservas");
        actualizarEstadosReservas();
    }
}
