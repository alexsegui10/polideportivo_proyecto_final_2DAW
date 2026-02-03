package com.emotivapoli.club.application.mapper;

import com.emotivapoli.club.domain.dto.ClubSuscripcionDTO;
import com.emotivapoli.club.domain.entity.ClubSuscripcion;
import com.emotivapoli.club.presentation.schemas.response.ClubSuscripcionResponse;
import org.springframework.stereotype.Component;

@Component
public class ClubSuscripcionMapper {

    // Entity → DTO
    public ClubSuscripcionDTO toDTO(ClubSuscripcion entity) {
        if (entity == null) return null;
        
        ClubSuscripcionDTO dto = new ClubSuscripcionDTO();
        dto.setId(entity.getId());
        dto.setUid(entity.getUid());
        dto.setClubMiembroId(entity.getClubMiembro() != null ? entity.getClubMiembro().getId() : null);
        dto.setFechaInicio(entity.getFechaInicio());
        dto.setFechaFin(entity.getFechaFin());
        dto.setPrecioMensual(entity.getPrecioMensual());
        dto.setStatus(entity.getStatus());
        dto.setIsActive(entity.getIsActive());
        dto.setProximoCobro(entity.getProximoCobro());
        dto.setIntentosCobro(entity.getIntentosCobro());
        dto.setUltimoPagoId(entity.getUltimoPago() != null ? entity.getUltimoPago().getId() : null);
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        
        // Campos enriquecidos
        if (entity.getClubMiembro() != null) {
            dto.setClubMiembroUid(entity.getClubMiembro().getUid());
            if (entity.getClubMiembro().getClub() != null) {
                dto.setClubNombre(entity.getClubMiembro().getClub().getNombre());
            }
            if (entity.getClubMiembro().getUsuario() != null) {
                dto.setUsuarioNombre(entity.getClubMiembro().getUsuario().getNombre());
                dto.setUsuarioEmail(entity.getClubMiembro().getUsuario().getEmail());
            }
        }
        
        return dto;
    }

    // DTO → Entity (sin relaciones, se asignan en el servicio)
    public ClubSuscripcion toEntity(ClubSuscripcionDTO dto) {
        if (dto == null) return null;
        
        ClubSuscripcion entity = new ClubSuscripcion();
        entity.setId(dto.getId());
        entity.setUid(dto.getUid());
        entity.setFechaInicio(dto.getFechaInicio());
        entity.setFechaFin(dto.getFechaFin());
        entity.setPrecioMensual(dto.getPrecioMensual());
        entity.setStatus(dto.getStatus());
        entity.setIsActive(dto.getIsActive());
        entity.setProximoCobro(dto.getProximoCobro());
        entity.setIntentosCobro(dto.getIntentosCobro());
        return entity;
    }

    // DTO → Response
    public ClubSuscripcionResponse toResponse(ClubSuscripcionDTO dto) {
        if (dto == null) return null;
        
        ClubSuscripcionResponse response = new ClubSuscripcionResponse();
        response.setId(dto.getId());
        response.setUid(dto.getUid());
        response.setClubMiembroUid(dto.getClubMiembroUid());
        response.setClubNombre(dto.getClubNombre());
        response.setUsuarioNombre(dto.getUsuarioNombre());
        response.setUsuarioEmail(dto.getUsuarioEmail());
        response.setFechaInicio(dto.getFechaInicio());
        response.setFechaFin(dto.getFechaFin());
        response.setPrecioMensual(dto.getPrecioMensual());
        response.setStatus(dto.getStatus());
        response.setIsActive(dto.getIsActive());
        response.setProximoCobro(dto.getProximoCobro());
        response.setIntentosCobro(dto.getIntentosCobro());
        response.setCreatedAt(dto.getCreatedAt());
        response.setUpdatedAt(dto.getUpdatedAt());
        return response;
    }
}
