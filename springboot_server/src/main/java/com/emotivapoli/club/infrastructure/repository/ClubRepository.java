package com.emotivapoli.club.infrastructure.repository;

import com.emotivapoli.club.domain.entity.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClubRepository extends JpaRepository<Club, Long> {
    Optional<Club> findBySlug(String slug);
    
    @Query("SELECT c FROM Club c WHERE c.status != 'eliminado' AND c.isActive = true")
    List<Club> findActivos();
    
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Club c WHERE c.slug = ?1 AND c.status != 'eliminado'")
    boolean existsBySlugAndNotDeleted(String slug);
}
