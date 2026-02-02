package com.emotivapoli.reserva.infrastructure.repository;

import com.emotivapoli.reserva.domain.entity.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    Optional<Reserva> findBySlug(String slug);
    
    @Query("SELECT r FROM Reserva r WHERE r.status != 'eliminado' AND r.isActive = true")
    List<Reserva> findActivas();
    
    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM Reserva r WHERE r.slug = ?1 AND r.status != 'eliminado'")
    boolean existsBySlugAndNotDeleted(String slug);
}
