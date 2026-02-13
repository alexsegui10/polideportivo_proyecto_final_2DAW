package com.emotivapoli.pista.infrastructure.repository;

import com.emotivapoli.pista.domain.entity.Pista;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public interface PistaRepository extends JpaRepository<Pista, Long>, JpaSpecificationExecutor<Pista> {
    
    Optional<Pista> findBySlug(String slug);
    
    boolean existsBySlug(String slug);
    
    /**
     * Búsqueda dinámica de pistas con filtros
     */
    default Page<Pista> searchPistas(String q, String tipos, BigDecimal precioMax, Pageable pageable) {
        Specification<Pista> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            // Filtro: solo pistas activas y no eliminadas
            predicates.add(criteriaBuilder.isTrue(root.get("isActive")));
            predicates.add(criteriaBuilder.notEqual(root.get("status"), "eliminado"));
            
            // Búsqueda por nombre (LIKE %q%)
            if (q != null && !q.trim().isEmpty()) {
                String searchPattern = "%" + q.toLowerCase() + "%";
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("nombre")), 
                    searchPattern
                ));
            }
            
            // Filtro por tipos de deporte (normaliza acentos)
            if (tipos != null && !tipos.trim().isEmpty()) {
                String[] tiposArray = tipos.split(",");
                List<Predicate> tipoPredicates = new ArrayList<>();
                for (String tipo : tiposArray) {
                    String tipoNormalizado = tipo.trim().toLowerCase()
                        .replace("á", "a")
                        .replace("é", "e")
                        .replace("í", "i")
                        .replace("ó", "o")
                        .replace("ú", "u");
                    
                    // Comparar sin acentos usando función SQL TRANSLATE
                    tipoPredicates.add(criteriaBuilder.like(
                        criteriaBuilder.function("TRANSLATE", String.class,
                            criteriaBuilder.lower(root.get("tipo")),
                            criteriaBuilder.literal("áéíóúÁÉÍÓÚ"),
                            criteriaBuilder.literal("aeiouAEIOU")
                        ),
                        tipoNormalizado
                    ));
                }
                predicates.add(criteriaBuilder.or(tipoPredicates.toArray(new Predicate[0])));
            }
            
            // Filtro por precio máximo
            if (precioMax != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("precioHora"), precioMax));
            }
            
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
        
        return findAll(spec, pageable);
    }
}
