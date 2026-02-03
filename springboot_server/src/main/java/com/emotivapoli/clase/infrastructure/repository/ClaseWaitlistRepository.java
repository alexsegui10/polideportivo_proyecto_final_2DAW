package com.emotivapoli.clase.infrastructure.repository;

import com.emotivapoli.clase.domain.entity.ClaseWaitlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClaseWaitlistRepository extends JpaRepository<ClaseWaitlist, Long> {
    
    Optional<ClaseWaitlist> findByUid(UUID uid);
    
    @Query("SELECT cw FROM ClaseWaitlist cw WHERE cw.clase.id = ?1 AND cw.status = 'esperando' AND cw.isActive = true ORDER BY cw.posicion ASC")
    List<ClaseWaitlist> findByClaseIdOrderByPosicion(Long claseId);
    
    @Query("SELECT cw FROM ClaseWaitlist cw WHERE cw.usuario.id = ?1 AND cw.status = 'esperando' AND cw.isActive = true")
    List<ClaseWaitlist> findByUsuarioIdEsperando(Long usuarioId);
    
    @Query("SELECT cw FROM ClaseWaitlist cw WHERE cw.clase.id = ?1 AND cw.usuario.id = ?2 AND cw.status = 'esperando'")
    Optional<ClaseWaitlist> findByClaseIdAndUsuarioIdEsperando(Long claseId, Long usuarioId);
    
    @Query("SELECT cw FROM ClaseWaitlist cw WHERE cw.clase.id = ?1 AND cw.status = 'esperando' AND cw.isActive = true ORDER BY cw.posicion ASC LIMIT 1")
    Optional<ClaseWaitlist> findPrimeroEnCola(Long claseId);
    
    @Query("SELECT COUNT(cw) FROM ClaseWaitlist cw WHERE cw.clase.id = ?1 AND cw.status = 'esperando' AND cw.isActive = true")
    Long countEsperandoByClaseId(Long claseId);
}
