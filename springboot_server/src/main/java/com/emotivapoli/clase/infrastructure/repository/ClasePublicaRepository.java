package com.emotivapoli.clase.infrastructure.repository;

import com.emotivapoli.clase.domain.entity.ClasePublica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClasePublicaRepository extends JpaRepository<ClasePublica, Long> {
    Optional<ClasePublica> findBySlug(String slug);
    
    @Query("SELECT c FROM ClasePublica c WHERE c.status != 'eliminado' AND c.isActive = true")
    List<ClasePublica> findActivas();
    
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM ClasePublica c WHERE c.slug = ?1 AND c.status != 'eliminado'")
    boolean existsBySlugAndNotDeleted(String slug);
}
