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
     * Ejecuta cada 15 minutos para actualizar estados de reservas.
     * Cron: cada 15 minutos (0, 15, 30, 45)
     * Puedes cambiar a "0 0 * * * *" para ejecutar cada hora
     */
    @Scheduled(cron = "0 0/15 * * * *")
    @Transactional
    public void actualizarEstadosReservas() {
        try {
            logger.info("Ejecutando actualización automática de estados de reservas...");
            
            // Llamar a la función PostgreSQL
            List<?> resultado = entityManager
                .createNativeQuery("SELECT * FROM actualizar_estados_reservas()")
                .getResultList();
            
            if (!resultado.isEmpty()) {
                Object[] counts = (Object[]) resultado.get(0);
                Integer completadas = ((BigInteger) counts[0]).intValue();
                Integer canceladas = ((BigInteger) counts[1]).intValue();
                
                if (completadas > 0 || canceladas > 0) {
                    logger.info("Actualización completada: {} reservas marcadas como completadas, {} como canceladas", 
                        completadas, canceladas);
                } else {
                    logger.debug("No hay reservas para actualizar en este momento");
                }
            }
            
        } catch (Exception e) {
            logger.error("Error al actualizar estados de reservas automáticamente: {}", e.getMessage(), e);
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
