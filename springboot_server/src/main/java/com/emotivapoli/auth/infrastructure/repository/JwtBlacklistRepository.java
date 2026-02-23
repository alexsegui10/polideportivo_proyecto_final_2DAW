package com.emotivapoli.auth.infrastructure.repository;

import com.emotivapoli.auth.domain.entity.JwtBlacklist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Repositorio para la blacklist de access tokens JWT.
 *
 * Operaciones:
 *   - existsByTokenHash  → comprobar en cada request si el token está revocado
 *   - deleteExpired      → limpieza periódica de entradas caducadas
 */
@Repository
public interface JwtBlacklistRepository extends JpaRepository<JwtBlacklist, UUID> {

    /** Comprueba si el hash del token está en la blacklist (token revocado). */
    boolean existsByTokenHash(String tokenHash);

    /** Elimina todas las entradas cuyo JWT ya ha expirado (limpieza periódica). */
    @Transactional
    @Modifying
    @Query("DELETE FROM JwtBlacklist j WHERE j.expiresAt < :now")
    void deleteExpiredBefore(@Param("now") LocalDateTime now);
}
