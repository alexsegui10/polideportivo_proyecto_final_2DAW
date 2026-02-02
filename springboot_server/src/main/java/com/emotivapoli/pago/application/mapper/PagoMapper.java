package com.emotivapoli.pago.application.mapper;

import com.emotivapoli.pago.domain.dto.PagoDTO;
import com.emotivapoli.pago.domain.entity.Pago;
import com.emotivapoli.pago.presentation.schemas.response.PagoResponse;
import org.springframework.stereotype.Component;

@Component
public class PagoMapper {

    // Entity → DTO
    public PagoDTO toDTO(Pago entity) {
        if (entity == null) return null;
        
        PagoDTO dto = new PagoDTO();
        dto.setId(entity.getId());
        dto.setUid(entity.getUid());
        dto.setUsuarioId(entity.getUsuario() != null ? entity.getUsuario().getId() : null);
        dto.setReservaId(entity.getReserva() != null ? entity.getReserva().getId() : null);
        dto.setClaseInscripcionId(entity.getClaseInscripcion() != null ? entity.getClaseInscripcion().getId() : null);
        dto.setClubSuscripcionId(entity.getClubSuscripcion() != null ? entity.getClubSuscripcion().getId() : null);
        dto.setAmount(entity.getAmount());
        dto.setCurrency(entity.getCurrency());
        dto.setProvider(entity.getProvider());
        dto.setProviderPaymentId(entity.getProviderPaymentId());
        dto.setStatus(entity.getStatus());
        dto.setIsActive(entity.getIsActive());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    // DTO → Response
    public PagoResponse toResponse(PagoDTO dto) {
        if (dto == null) return null;
        
        PagoResponse response = new PagoResponse();
        response.setId(dto.getId());
        response.setUid(dto.getUid());
        response.setUsuarioId(dto.getUsuarioId());
        response.setReservaId(dto.getReservaId());
        response.setClaseInscripcionId(dto.getClaseInscripcionId());
        response.setClubSuscripcionId(dto.getClubSuscripcionId());
        response.setAmount(dto.getAmount());
        response.setCurrency(dto.getCurrency());
        response.setProvider(dto.getProvider());
        response.setProviderPaymentId(dto.getProviderPaymentId());
        response.setStatus(dto.getStatus());
        response.setIsActive(dto.getIsActive());
        response.setCreatedAt(dto.getCreatedAt());
        response.setUpdatedAt(dto.getUpdatedAt());
        return response;
    }
}
