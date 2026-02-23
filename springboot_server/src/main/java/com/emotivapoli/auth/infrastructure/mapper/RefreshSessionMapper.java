package com.emotivapoli.auth.infrastructure.mapper;

import com.emotivapoli.auth.domain.dto.RefreshSessionDTO;
import com.emotivapoli.auth.domain.entity.RefreshSession;
import org.springframework.stereotype.Component;

/**
 * Mapper entre RefreshSession (Entity) y RefreshSessionDTO.
 * Sigue el mismo patrón que PistaMapper, UsuarioMapper, etc.
 */
@Component
public class RefreshSessionMapper {

    /** Convierte Entity → DTO */
    public RefreshSessionDTO toDTO(RefreshSession entity) {
        if (entity == null) return null;
        return new RefreshSessionDTO(
                entity.getId(),
                entity.getUserId(),
                entity.getDeviceId(),
                entity.getFamilyId(),
                entity.getCurrentTokenHash(),
                entity.getRevoked(),
                entity.getSessionVersion(),
                entity.getCreatedAt(),
                entity.getLastUsedAt()
        );
    }

    /** Convierte DTO → Entity */
    public RefreshSession toEntity(RefreshSessionDTO dto) {
        if (dto == null) return null;
        RefreshSession entity = new RefreshSession(
                dto.getUserId(),
                dto.getDeviceId(),
                dto.getFamilyId(),
                dto.getCurrentTokenHash(),
                dto.getSessionVersion()
        );
        entity.setId(dto.getId());
        entity.setRevoked(dto.getRevoked());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setLastUsedAt(dto.getLastUsedAt());
        return entity;
    }
}
