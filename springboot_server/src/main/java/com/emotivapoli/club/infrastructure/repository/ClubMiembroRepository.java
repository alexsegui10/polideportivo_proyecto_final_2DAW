package com.emotivapoli.club.infrastructure.repository;

import com.emotivapoli.club.domain.entity.ClubMiembro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClubMiembroRepository extends JpaRepository<ClubMiembro, Long> {
    
    Optional<ClubMiembro> findByUid(UUID uid);
    
    @Query("SELECT cm FROM ClubMiembro cm WHERE cm.club.id = ?1 AND cm.status != 'eliminado'")
    List<ClubMiembro> findByClubIdActivos(Long clubId);
    
    @Query("SELECT cm FROM ClubMiembro cm WHERE cm.usuario.id = ?1 AND cm.status != 'eliminado'")
    List<ClubMiembro> findByUsuarioId(Long usuarioId);
    
    @Query("SELECT cm FROM ClubMiembro cm WHERE cm.club.id = ?1 AND cm.usuario.id = ?2 AND cm.status != 'eliminado'")
    Optional<ClubMiembro> findByClubIdAndUsuarioId(Long clubId, Long usuarioId);
    
    @Query("SELECT COUNT(cm) FROM ClubMiembro cm WHERE cm.club.id = ?1 AND cm.status = 'activo' AND cm.isActive = true")
    Long countMiembrosActivosByClubId(Long clubId);
    
    @Query("SELECT cm FROM ClubMiembro cm WHERE cm.status != 'eliminado' AND cm.isActive = true")
    List<ClubMiembro> findActivos();
}
