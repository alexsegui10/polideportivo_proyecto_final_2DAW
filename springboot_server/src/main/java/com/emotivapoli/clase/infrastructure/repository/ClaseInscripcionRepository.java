package com.emotivapoli.clase.infrastructure.repository;

import com.emotivapoli.clase.domain.entity.ClaseInscripcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClaseInscripcionRepository extends JpaRepository<ClaseInscripcion, Long> {
    
    Optional<ClaseInscripcion> findByUid(UUID uid);
    
    @Query("SELECT ci FROM ClaseInscripcion ci WHERE ci.clase.id = ?1 AND ci.status != 'eliminado' AND ci.isActive = true")
    List<ClaseInscripcion> findByClaseIdActivos(Long claseId);
    
    @Query("SELECT ci FROM ClaseInscripcion ci WHERE ci.usuario.id = ?1 AND ci.status != 'eliminado'")
    List<ClaseInscripcion> findByUsuarioId(Long usuarioId);
    
    // Busca TODAS las inscripciones (incluso eliminadas) para permitir reactivación
    @Query("SELECT ci FROM ClaseInscripcion ci WHERE ci.clase.id = ?1 AND ci.usuario.id = ?2")
    Optional<ClaseInscripcion> findByClaseIdAndUsuarioId(Long claseId, Long usuarioId);
    
    @Query("SELECT COUNT(ci) FROM ClaseInscripcion ci WHERE ci.clase.id = ?1 AND ci.status = 'confirmada' AND ci.isActive = true")
    Long countInscritosConfirmadosByClaseId(Long claseId);
    
    @Query("SELECT ci FROM ClaseInscripcion ci WHERE ci.status = 'confirmada' AND ci.isActive = true")
    List<ClaseInscripcion> findConfirmadas();
}
