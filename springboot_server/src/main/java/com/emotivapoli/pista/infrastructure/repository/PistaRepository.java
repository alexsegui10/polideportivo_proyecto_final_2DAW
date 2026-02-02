package com.emotivapoli.pista.infrastructure.repository;

import com.emotivapoli.pista.domain.entity.Pista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PistaRepository extends JpaRepository<Pista, Long> {
    
    Optional<Pista> findBySlug(String slug);
    
    boolean existsBySlug(String slug);
}
