package com.emotivapoli.profile.infrastructure.repository;

import com.emotivapoli.usuario.domain.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio para acceso a perfiles públicos
 * Accede a la tabla de usuarios pero en el contexto del bounded context Profile
 */
@Repository
public interface ProfileRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findBySlug(String slug);

    Optional<Usuario> findBySlugAndStatusAndIsActive(String slug, String status, Boolean isActive);
}
