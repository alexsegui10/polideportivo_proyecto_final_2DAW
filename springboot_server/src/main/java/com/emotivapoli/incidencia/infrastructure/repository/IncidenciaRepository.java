package com.emotivapoli.incidencia.infrastructure.repository;

import com.emotivapoli.incidencia.domain.entity.Incidencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidenciaRepository extends JpaRepository<Incidencia, Long> {
    List<Incidencia> findByUsuario_IdOrderByCreatedAtDesc(Long usuarioId);
    List<Incidencia> findByEstadoOrderByCreatedAtDesc(String estado);
    List<Incidencia> findAllByOrderByCreatedAtDesc();
}
