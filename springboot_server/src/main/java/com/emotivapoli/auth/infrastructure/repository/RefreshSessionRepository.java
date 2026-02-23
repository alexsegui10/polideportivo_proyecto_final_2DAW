package com.emotivapoli.auth.infrastructure.repository;

import com.emotivapoli.auth.domain.entity.RefreshSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repositorio JPA para RefreshSession.
 *

 *   - findByFamilyId         → rotación + detección de robo
 *   - findByUserIdAndDeviceId → revocar sesión anterior al hacer login
 *   - revokeAllByUserId       → logout global (sessionVersion)
 *   - revokeByUserIdAndDeviceId → logout por dispositivo
 *   - revokeByFamilyId        → blacklist de familia cuando se detecta reuse
 */
@Repository
public interface RefreshSessionRepository extends JpaRepository<RefreshSession, UUID> {

    /** Buscar sesión por familyId (para rotación y revocación) */
    Optional<RefreshSession> findByFamilyId(UUID familyId);

    /**
     * Buscar TODAS las sesiones de un dispositivo (pueden ser varias si hubo
     * múltiples logins sin logout). Se usa para revocarlas todas antes de crear una nueva.
     */
    List<RefreshSession> findByUserIdAndDeviceId(Long userId, String deviceId);

    /** Revocar todas las sesiones de un usuario (logout global) */
    @Transactional
    @Modifying
    @Query("UPDATE RefreshSession r SET r.revoked = true WHERE r.userId = :userId")
    void revokeAllByUserId(@Param("userId") Long userId);

    /** Revocar sesión de un dispositivo específico (logout por dispositivo) */
    @Transactional
    @Modifying
    @Query("UPDATE RefreshSession r SET r.revoked = true WHERE r.userId = :userId AND r.deviceId = :deviceId")
    void revokeByUserIdAndDeviceId(@Param("userId") Long userId, @Param("deviceId") String deviceId);

    /** Revocar toda una familia (token theft detection) */
    @Transactional
    @Modifying
    @Query("UPDATE RefreshSession r SET r.revoked = true WHERE r.familyId = :familyId")
    void revokeByFamilyId(@Param("familyId") UUID familyId);
}
