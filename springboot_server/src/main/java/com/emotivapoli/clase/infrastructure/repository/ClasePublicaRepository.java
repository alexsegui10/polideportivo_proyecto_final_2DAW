package com.emotivapoli.clase.infrastructure.repository;

import com.emotivapoli.clase.domain.entity.ClasePublica;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClasePublicaRepository extends JpaRepository<ClasePublica, Long>, JpaSpecificationExecutor<ClasePublica> {
    Optional<ClasePublica> findBySlug(String slug);
    
    @Query("SELECT c FROM ClasePublica c WHERE c.status != 'eliminado' AND c.isActive = true")
    List<ClasePublica> findActivas();
    
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM ClasePublica c WHERE c.slug = ?1 AND c.status != 'eliminado'")
    boolean existsBySlugAndNotDeleted(String slug);

    /**
     * Búsqueda dinámica de clases con filtros
     */
    default Page<ClasePublica> searchClases(String q, String deporte, String nivel, BigDecimal precioMax, Pageable pageable) {
        Specification<ClasePublica> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Solo clases activas y no eliminadas
            predicates.add(criteriaBuilder.isTrue(root.get("isActive")));
            predicates.add(criteriaBuilder.notEqual(root.get("status"), "eliminado"));

            // Búsqueda por nombre
            if (q != null && !q.trim().isEmpty()) {
                String searchPattern = "%" + q.toLowerCase() + "%";
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("nombre")),
                    searchPattern
                ));
            }

            // Filtro por deporte
            if (deporte != null && !deporte.trim().isEmpty()) {
                String deporteNormalizado = deporte.trim().toLowerCase()
                    .replace("á", "a").replace("é", "e")
                    .replace("í", "i").replace("ó", "o").replace("ú", "u");
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.function("TRANSLATE", String.class,
                        criteriaBuilder.lower(root.get("deporte")),
                        criteriaBuilder.literal("áéíóúÁÉÍÓÚ"),
                        criteriaBuilder.literal("aeiouAEIOU")),
                    deporteNormalizado
                ));
            }

            // Filtro por nivel
            if (nivel != null && !nivel.trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(
                    criteriaBuilder.lower(root.get("nivel")),
                    nivel.trim().toLowerCase()
                ));
            }

            // Filtro por precio máximo
            if (precioMax != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("precio"), precioMax));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        return findAll(spec, pageable);
    }
}
