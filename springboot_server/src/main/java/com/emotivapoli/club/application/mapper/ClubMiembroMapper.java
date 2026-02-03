package com.emotivapoli.club.application.mapper;

import com.emotivapoli.club.domain.dto.ClubMiembroDTO;
import com.emotivapoli.club.domain.entity.ClubMiembro;
import com.emotivapoli.club.presentation.schemas.response.ClubMiembroResponse;
import org.springframework.stereotype.Component;

@Component
public class ClubMiembroMapper {

    // Entity → DTO
    public ClubMiembroDTO toDTO(ClubMiembro entity) {
        if (entity == null) return null;
        
        ClubMiembroDTO dto = new ClubMiembroDTO();
        dto.setId(entity.getId());
        dto.setUid(entity.getUid());
        dto.setClubId(entity.getClub() != null ? entity.getClub().getId() : null);
        dto.setUsuarioId(entity.getUsuario() != null ? entity.getUsuario().getId() : null);
        dto.setStatus(entity.getStatus());
        dto.setIsActive(entity.getIsActive());
        dto.setFechaInscripcion(entity.getFechaInscripcion());
        dto.setFechaBaja(entity.getFechaBaja());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        
        // Campos enriquecidos
        if (entity.getClub() != null) {
            dto.setClubNombre(entity.getClub().getNombre());
        }
        if (entity.getUsuario() != null) {
            dto.setUsuarioNombre(entity.getUsuario().getNombre());
            dto.setUsuarioEmail(entity.getUsuario().getEmail());
        }
        
        return dto;
    }

    // DTO → Entity (sin relaciones, se asignan en el servicio)
    public ClubMiembro toEntity(ClubMiembroDTO dto) {
        if (dto == null) return null;
        
        ClubMiembro entity = new ClubMiembro();
        entity.setId(dto.getId());
        entity.setUid(dto.getUid());
        entity.setStatus(dto.getStatus());
        entity.setIsActive(dto.getIsActive());
        entity.setFechaInscripcion(dto.getFechaInscripcion());
        entity.setFechaBaja(dto.getFechaBaja());
        return entity;
    }

    // DTO → Response
    public ClubMiembroResponse toResponse(ClubMiembroDTO dto) {
        if (dto == null) return null;
        
        ClubMiembroResponse response = new ClubMiembroResponse();
        response.setId(dto.getId());
        response.setUid(dto.getUid());
        response.setClubId(dto.getClubId());
        response.setClubNombre(dto.getClubNombre());
        response.setUsuarioId(dto.getUsuarioId());
        response.setUsuarioNombre(dto.getUsuarioNombre());
        response.setUsuarioEmail(dto.getUsuarioEmail());
        response.setStatus(dto.getStatus());
        response.setIsActive(dto.getIsActive());
        response.setTieneSuscripcionActiva(dto.getTieneSuscripcionActiva());
        response.setFechaInscripcion(dto.getFechaInscripcion());
        response.setFechaBaja(dto.getFechaBaja());
        response.setCreatedAt(dto.getCreatedAt());
        response.setUpdatedAt(dto.getUpdatedAt());
        return response;
    }
}
