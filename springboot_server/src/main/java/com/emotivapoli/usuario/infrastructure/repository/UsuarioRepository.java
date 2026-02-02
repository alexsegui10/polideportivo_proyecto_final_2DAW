package com.emotivapoli.usuario.infrastructure.repository;

import com.emotivapoli.usuario.domain.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    Optional<Usuario> findBySlug(String slug);
    
    Optional<Usuario> findByEmail(String email);
    
    Optional<Usuario> findByDni(String dni);
    
    List<Usuario> findByRole(String role);
    
    List<Usuario> findByStatus(String status);
    
    boolean existsBySlug(String slug);
    
    boolean existsByEmail(String email);
    
    boolean existsByDni(String dni);
}
