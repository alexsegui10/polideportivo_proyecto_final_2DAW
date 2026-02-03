package com.emotivapoli.clase.application.mapper;

import com.emotivapoli.clase.domain.dto.ClaseInscripcionDTO;
import com.emotivapoli.clase.domain.entity.ClaseInscripcion;
import com.emotivapoli.clase.presentation.schemas.response.ClaseInscripcionResponse;
import org.springframework.stereotype.Component;

@Component
public class ClaseInscripcionMapper {

    public ClaseInscripcionDTO toDTO(ClaseInscripcion entity) {
        if (entity == null) return null;
        
        ClaseInscripcionDTO dto = new ClaseInscripcionDTO();
        dto.setId(entity.getId());
        dto.setUid(entity.getUid());
        dto.setClaseId(entity.getClase() != null ? entity.getClase().getId() : null);
        dto.setUsuarioId(entity.getUsuario() != null ? entity.getUsuario().getId() : null);
        dto.setStatus(entity.getStatus());
        dto.setIsActive(entity.getIsActive());
        dto.setPrecioPagado(entity.getPrecioPagado());
        dto.setMetodoPago(entity.getMetodoPago());
        dto.setFechaInscripcion(entity.getFechaInscripcion());
        dto.setCancelledAt(entity.getCancelledAt());
        dto.setCancelReason(entity.getCancelReason());
        dto.setRefundStatus(entity.getRefundStatus());
        dto.setRefundAmount(entity.getRefundAmount());
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

    public ClaseInscripcion toEntity(ClaseInscripcionDTO dto) {
        if (dto == null) return null;
        
        ClaseInscripcion entity = new ClaseInscripcion();
        entity.setId(dto.getId());
        entity.setUid(dto.getUid());
        entity.setStatus(dto.getStatus());
        entity.setIsActive(dto.getIsActive());
        entity.setPrecioPagado(dto.getPrecioPagado());
        entity.setMetodoPago(dto.getMetodoPago());
        return entity;
    }

    public ClaseInscripcionResponse toResponse(ClaseInscripcionDTO dto) {
        if (dto == null) return null;
        
        ClaseInscripcionResponse response = new ClaseInscripcionResponse();
        response.setId(dto.getId());
        response.setUid(dto.getUid());
        response.setClaseId(dto.getClaseId());
        response.setClaseNombre(dto.getClaseNombre());
        response.setClaseFechaHoraInicio(dto.getClaseFechaHoraInicio());
        response.setUsuarioId(dto.getUsuarioId());
        response.setUsuarioNombre(dto.getUsuarioNombre());
        response.setUsuarioEmail(dto.getUsuarioEmail());
        response.setStatus(dto.getStatus());
        response.setIsActive(dto.getIsActive());
        response.setPrecioPagado(dto.getPrecioPagado());
        response.setMetodoPago(dto.getMetodoPago());
        response.setFechaInscripcion(dto.getFechaInscripcion());
        response.setCancelledAt(dto.getCancelledAt());
        response.setCancelReason(dto.getCancelReason());
        response.setRefundStatus(dto.getRefundStatus());
        response.setRefundAmount(dto.getRefundAmount());
        response.setCreatedAt(dto.getCreatedAt());
        response.setUpdatedAt(dto.getUpdatedAt());
        return response;
    }
}
