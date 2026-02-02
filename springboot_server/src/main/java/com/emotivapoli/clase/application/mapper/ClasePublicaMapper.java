package com.emotivapoli.clase.application.mapper;

import com.emotivapoli.clase.domain.dto.ClasePublicaDTO;
import com.emotivapoli.clase.domain.entity.ClasePublica;
import com.emotivapoli.clase.presentation.schemas.request.ClaseCreateRequest;
import com.emotivapoli.clase.presentation.schemas.response.ClaseResponse;
import org.springframework.stereotype.Component;

@Component
public class ClasePublicaMapper {

    // Entity → DTO
    public ClasePublicaDTO toDTO(ClasePublica entity) {
        if (entity == null) return null;
        
        ClasePublicaDTO dto = new ClasePublicaDTO();
        dto.setId(entity.getId());
        dto.setUid(entity.getUid());
        dto.setSlug(entity.getSlug());
        dto.setNombre(entity.getNombre());
        dto.setDescripcion(entity.getDescripcion());
        dto.setImagen(entity.getImagen());
        dto.setEntrenadorId(entity.getEntrenador() != null ? entity.getEntrenador().getId() : null);
        dto.setPistaId(entity.getPista() != null ? entity.getPista().getId() : null);
        dto.setFechaHoraInicio(entity.getFechaHoraInicio());
        dto.setFechaHoraFin(entity.getFechaHoraFin());
        dto.setDuracionMinutos(entity.getDuracionMinutos());
        dto.setMaxParticipantes(entity.getMaxParticipantes());
        dto.setPrecio(entity.getPrecio());
        dto.setNivel(entity.getNivel());
        dto.setDeporte(entity.getDeporte());
        dto.setStatus(entity.getStatus());
        dto.setIsActive(entity.getIsActive());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    // DTO → Entity
    public ClasePublica toEntity(ClasePublicaDTO dto) {
        if (dto == null) return null;
        
        ClasePublica entity = new ClasePublica();
        entity.setId(dto.getId());
        entity.setUid(dto.getUid());
        entity.setSlug(dto.getSlug());
        entity.setNombre(dto.getNombre());
        entity.setDescripcion(dto.getDescripcion());
        entity.setImagen(dto.getImagen());
        entity.setFechaHoraInicio(dto.getFechaHoraInicio());
        entity.setFechaHoraFin(dto.getFechaHoraFin());
        entity.setDuracionMinutos(dto.getDuracionMinutos());
        entity.setMaxParticipantes(dto.getMaxParticipantes());
        entity.setPrecio(dto.getPrecio());
        entity.setNivel(dto.getNivel());
        entity.setDeporte(dto.getDeporte());
        entity.setStatus(dto.getStatus());
        entity.setIsActive(dto.getIsActive());
        return entity;
    }

    // CreateRequest → DTO
    public ClasePublicaDTO createRequestToDTO(ClaseCreateRequest request) {
        if (request == null) return null;
        
        ClasePublicaDTO dto = new ClasePublicaDTO();
        dto.setNombre(request.getNombre());
        dto.setDescripcion(request.getDescripcion());
        dto.setImagen(request.getImagen());
        dto.setEntrenadorId(request.getEntrenadorId());
        dto.setPistaId(request.getPistaId());
        dto.setFechaHoraInicio(request.getFechaHoraInicio());
        dto.setFechaHoraFin(request.getFechaHoraFin());
        dto.setDuracionMinutos(request.getDuracionMinutos());
        dto.setMaxParticipantes(request.getMaxParticipantes() != null ? request.getMaxParticipantes() : 15);
        dto.setPrecio(request.getPrecio() != null ? request.getPrecio() : java.math.BigDecimal.ZERO);
        dto.setNivel(request.getNivel());
        dto.setDeporte(request.getDeporte());
        dto.setStatus(request.getStatus() != null ? request.getStatus() : "programada");
        dto.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        return dto;
    }

    // DTO → Response
    public ClaseResponse toResponse(ClasePublicaDTO dto) {
        if (dto == null) return null;
        
        ClaseResponse response = new ClaseResponse();
        response.setId(dto.getId());
        response.setUid(dto.getUid());
        response.setSlug(dto.getSlug());
        response.setNombre(dto.getNombre());
        response.setDescripcion(dto.getDescripcion());
        response.setImagen(dto.getImagen());
        response.setEntrenadorId(dto.getEntrenadorId());
        response.setPistaId(dto.getPistaId());
        response.setFechaHoraInicio(dto.getFechaHoraInicio());
        response.setFechaHoraFin(dto.getFechaHoraFin());
        response.setDuracionMinutos(dto.getDuracionMinutos());
        response.setMaxParticipantes(dto.getMaxParticipantes());
        response.setPrecio(dto.getPrecio());
        response.setNivel(dto.getNivel());
        response.setDeporte(dto.getDeporte());
        response.setStatus(dto.getStatus());
        response.setIsActive(dto.getIsActive());
        response.setCreatedAt(dto.getCreatedAt());
        response.setUpdatedAt(dto.getUpdatedAt());
        return response;
    }
}
