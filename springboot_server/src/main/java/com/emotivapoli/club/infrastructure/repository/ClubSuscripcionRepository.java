package com.emotivapoli.club.infrastructure.repository;

import com.emotivapoli.club.domain.entity.ClubSuscripcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClubSuscripcionRepository extends JpaRepository<ClubSuscripcion, Long> {
    
    Optional<ClubSuscripcion> findByUid(UUID uid);
    
    @Query("SELECT cs FROM ClubSuscripcion cs WHERE cs.clubMiembro.id = ?1 AND cs.isActive = true AND cs.status != 'cancelada'")
    Optional<ClubSuscripcion> findActivaByMiembroId(Long miembroId);
    
    @Query("SELECT cs FROM ClubSuscripcion cs WHERE cs.clubMiembro.id = ?1 AND cs.isActive = true ORDER BY cs.createdAt DESC")
    List<ClubSuscripcion> findByMiembroId(Long miembroId);
    
    @Query("SELECT cs FROM ClubSuscripcion cs WHERE cs.clubMiembro.club.id = ?1 AND cs.isActive = true ORDER BY cs.createdAt DESC")
    List<ClubSuscripcion> findByClubId(Long clubId);
    
    @Query("SELECT cs FROM ClubSuscripcion cs WHERE cs.proximoCobro <= ?1 AND cs.status = 'activa' AND cs.isActive = true")
    List<ClubSuscripcion> findPendientesCobro(LocalDate fecha);
    
    @Query("SELECT cs FROM ClubSuscripcion cs WHERE cs.status = 'impago' AND cs.intentosCobro < 3")
    List<ClubSuscripcion> findImpagosRetryables();
    
    @Query("SELECT cs FROM ClubSuscripcion cs WHERE cs.status != 'cancelada' AND cs.isActive = true")
    List<ClubSuscripcion> findActivas();
}
