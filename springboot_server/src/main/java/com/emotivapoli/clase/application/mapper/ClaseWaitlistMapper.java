package com.emotivapoli.clase.application.mapper;

import com.emotivapoli.clase.domain.dto.ClaseWaitlistDTO;
import com.emotivapoli.clase.domain.entity.ClaseWaitlist;
import com.emotivapoli.clase.presentation.schemas.response.ClaseWaitlistResponse;
import org.springframework.stereotype.Component;

@Component
public class ClaseWaitlistMapper {

    public ClaseWaitlistDTO toDTO(ClaseWaitlist entity) {
        if (entity == null) return null;
        
        ClaseWaitlistDTO dto = new ClaseWaitlistDTO();
        dto.setId(entity.getId());
        dto.setUid(entity.getUid());
        dto.setClaseId(entity.getClase() != null ? entity.getClase().getId() : null);
        dto.setUsuarioId(entity.getUsuario() != null ? entity.getUsuario().getId() : null);
        dto.setPosicion(entity.getPosicion());
        dto.setStatus(entity.getStatus());
        dto.setIsActive(entity.getIsActive());
        dto.setFechaRegistro(entity.getFechaRegistro());
        dto.setFechaNotificacion(entity.getFechaNotificacion());
        dto.setFechaExpiracion(entity.getFechaExpiracion());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        
        if (entity.getClase() != null) {
            dto.setClaseNombre(entity.getClase().getNombre());
            dto.setClaseFechaHoraInicio(entity.getClase().getFechaHoraInicio());
        }
        if (entity.getUsuario() != null) {
            dto.setUsuarioNombre(entity.getUsuario().getNombre());
            dto.setUsuarioEmail(entity.getUsuario().getEmail());
        }
        
        return dto;
    }

    public ClaseWaitlist toEntity(ClaseWaitlistDTO dto) {
        if (dto == null) return null;
        
        ClaseWaitlist entity = new ClaseWaitlist();
        entity.setId(dto.getId());
        entity.setUid(dto.getUid());
        entity.setPosicion(dto.getPosicion());
        entity.setStatus(dto.getStatus());
        entity.setIsActive(dto.getIsActive());
        return entity;
    }

    public ClaseWaitlistResponse toResponse(ClaseWaitlistDTO dto) {
        if (dto == null) return null;
        
        ClaseWaitlistResponse response = new ClaseWaitlistResponse();
        response.setId(dto.getId());
        response.setUid(dto.getUid());
        response.setClaseId(dto.getClaseId());
        response.setClaseNombre(dto.getClaseNombre());
        response.setClaseFechaHoraInicio(dto.getClaseFechaHoraInicio());
        response.setUsuarioId(dto.getUsuarioId());
        response.setUsuarioNombre(dto.getUsuarioNombre());
        response.setUsuarioEmail(dto.getUsuarioEmail());
        response.setPosicion(dto.getPosicion());
        response.setStatus(dto.getStatus());
        response.setIsActive(dto.getIsActive());
        response.setFechaRegistro(dto.getFechaRegistro());
        response.setFechaNotificacion(dto.getFechaNotificacion());
        response.setFechaExpiracion(dto.getFechaExpiracion());
        response.setCreatedAt(dto.getCreatedAt());
        response.setUpdatedAt(dto.getUpdatedAt());
        return response;
    }
}
