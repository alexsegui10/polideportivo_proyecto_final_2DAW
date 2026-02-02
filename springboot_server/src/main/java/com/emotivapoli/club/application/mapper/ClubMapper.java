package com.emotivapoli.club.application.mapper;

import com.emotivapoli.club.domain.dto.ClubDTO;
import com.emotivapoli.club.domain.entity.Club;
import com.emotivapoli.club.presentation.schemas.request.ClubCreateRequest;
import com.emotivapoli.club.presentation.schemas.request.ClubUpdateRequest;
import com.emotivapoli.club.presentation.schemas.response.ClubResponse;
import org.springframework.stereotype.Component;

@Component
public class ClubMapper {

    // Entity → DTO
    public ClubDTO toDTO(Club entity) {
        if (entity == null) return null;
        
        ClubDTO dto = new ClubDTO();
        dto.setId(entity.getId());
        dto.setUid(entity.getUid());
        dto.setSlug(entity.getSlug());
        dto.setNombre(entity.getNombre());
        dto.setDescripcion(entity.getDescripcion());
        dto.setDeporte(entity.getDeporte());
        dto.setImagen(entity.getImagen());
        dto.setEntrenadorId(entity.getEntrenador() != null ? entity.getEntrenador().getId() : null);
        dto.setMaxMiembros(entity.getMaxMiembros());
        dto.setNivel(entity.getNivel());
        dto.setPrecioMensual(entity.getPrecioMensual());
        dto.setStatus(entity.getStatus());
        dto.setIsActive(entity.getIsActive());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    // DTO → Entity
    public Club toEntity(ClubDTO dto) {
        if (dto == null) return null;
        
        Club entity = new Club();
        entity.setId(dto.getId());
        entity.setUid(dto.getUid());
        entity.setSlug(dto.getSlug());
        entity.setNombre(dto.getNombre());
        entity.setDescripcion(dto.getDescripcion());
        entity.setDeporte(dto.getDeporte());
        entity.setImagen(dto.getImagen());
        entity.setMaxMiembros(dto.getMaxMiembros());
        entity.setNivel(dto.getNivel());
        entity.setPrecioMensual(dto.getPrecioMensual());
        entity.setStatus(dto.getStatus());
        entity.setIsActive(dto.getIsActive());
        return entity;
    }

    // CreateRequest → DTO
    public ClubDTO createRequestToDTO(ClubCreateRequest request) {
        if (request == null) return null;
        
        ClubDTO dto = new ClubDTO();
        dto.setNombre(request.getNombre());
        dto.setDescripcion(request.getDescripcion());
        dto.setDeporte(request.getDeporte());
        dto.setImagen(request.getImagen());
        dto.setEntrenadorId(request.getEntrenadorId());
        dto.setMaxMiembros(request.getMaxMiembros() != null ? request.getMaxMiembros() : 20);
        dto.setNivel(request.getNivel());
        dto.setPrecioMensual(request.getPrecioMensual());
        dto.setStatus(request.getStatus() != null ? request.getStatus() : "activo");
        dto.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        return dto;
    }

    // DTO → Response
    public ClubResponse toResponse(ClubDTO dto) {
        if (dto == null) return null;
        
        ClubResponse response = new ClubResponse();
        response.setId(dto.getId());
        response.setUid(dto.getUid());
        response.setSlug(dto.getSlug());
        response.setNombre(dto.getNombre());
        response.setDescripcion(dto.getDescripcion());
        response.setDeporte(dto.getDeporte());
        response.setImagen(dto.getImagen());
        response.setEntrenadorId(dto.getEntrenadorId());
        response.setMaxMiembros(dto.getMaxMiembros());
        response.setNivel(dto.getNivel());
        response.setPrecioMensual(dto.getPrecioMensual());
        response.setStatus(dto.getStatus());
        response.setIsActive(dto.getIsActive());
        response.setCreatedAt(dto.getCreatedAt());
        response.setUpdatedAt(dto.getUpdatedAt());
        return response;
    }
}
