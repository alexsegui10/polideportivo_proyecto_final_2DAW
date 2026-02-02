package com.emotivapoli.reserva.application.mapper;

import com.emotivapoli.reserva.domain.dto.ReservaDTO;
import com.emotivapoli.reserva.domain.entity.Reserva;
import com.emotivapoli.reserva.presentation.schemas.request.ReservaCreateRequest;
import com.emotivapoli.reserva.presentation.schemas.response.ReservaResponse;
import org.springframework.stereotype.Component;

@Component
public class ReservaMapper {

    // Entity → DTO
    public ReservaDTO toDTO(Reserva entity) {
        if (entity == null)
            return null;

        ReservaDTO dto = new ReservaDTO();
        dto.setId(entity.getId());
        dto.setUid(entity.getUid());
        dto.setSlug(entity.getSlug());
        dto.setPistaId(entity.getPista() != null ? entity.getPista().getId() : null);
        dto.setUsuarioId(entity.getUsuario() != null ? entity.getUsuario().getId() : null);
        dto.setUsuarioNombre(entity.getUsuario() != null ? entity.getUsuario().getNombre() : null);
        dto.setUsuarioApellidos(entity.getUsuario() != null ? entity.getUsuario().getApellidos() : null);
        dto.setClubId(entity.getClub() != null ? entity.getClub().getId() : null);
        dto.setFechaHoraInicio(entity.getFechaHoraInicio());
        dto.setFechaHoraFin(entity.getFechaHoraFin());
        dto.setPrecio(entity.getPrecio());
        dto.setMetodoPago(entity.getMetodoPago());
        dto.setStatus(entity.getStatus());
        dto.setIsActive(entity.getIsActive());
        dto.setNotas(entity.getNotas());
        dto.setTipoReserva(entity.getTipoReserva());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    // DTO → Entity
    public Reserva toEntity(ReservaDTO dto) {
        if (dto == null)
            return null;

        Reserva entity = new Reserva();
        entity.setId(dto.getId());
        entity.setUid(dto.getUid());
        entity.setSlug(dto.getSlug());
        entity.setFechaHoraInicio(dto.getFechaHoraInicio());
        entity.setFechaHoraFin(dto.getFechaHoraFin());
        entity.setPrecio(dto.getPrecio());
        entity.setMetodoPago(dto.getMetodoPago());
        entity.setStatus(dto.getStatus());
        entity.setIsActive(dto.getIsActive());
        entity.setNotas(dto.getNotas());
        entity.setTipoReserva(dto.getTipoReserva());
        return entity;
    }

    // CreateRequest → DTO
    public ReservaDTO createRequestToDTO(ReservaCreateRequest request) {
        if (request == null)
            return null;

        ReservaDTO dto = new ReservaDTO();
        dto.setPistaId(request.getPistaId());
        dto.setUsuarioId(request.getUsuarioId());
        dto.setClubId(request.getClubId());
        dto.setFechaHoraInicio(request.getFechaHoraInicio());
        dto.setFechaHoraFin(request.getFechaHoraFin());
        dto.setPrecio(request.getPrecio());
        dto.setMetodoPago(request.getMetodoPago());
        dto.setStatus(request.getStatus() != null ? request.getStatus() : "confirmada");
        dto.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        dto.setNotas(request.getNotas());
        dto.setTipoReserva(request.getTipoReserva() != null ? request.getTipoReserva() : "individual");
        return dto;
    }

    // DTO → Response
    public ReservaResponse toResponse(ReservaDTO dto) {
        if (dto == null)
            return null;

        ReservaResponse response = new ReservaResponse();
        response.setId(dto.getId());
        response.setUid(dto.getUid());
        response.setSlug(dto.getSlug());
        response.setPistaId(dto.getPistaId());
        response.setUsuarioId(dto.getUsuarioId());
        response.setUsuarioNombre(dto.getUsuarioNombre());
        response.setUsuarioApellidos(dto.getUsuarioApellidos());
        response.setClubId(dto.getClubId());
        response.setFechaHoraInicio(dto.getFechaHoraInicio());
        response.setFechaHoraFin(dto.getFechaHoraFin());
        response.setPrecio(dto.getPrecio());
        response.setMetodoPago(dto.getMetodoPago());
        response.setStatus(dto.getStatus());
        response.setIsActive(dto.getIsActive());
        response.setNotas(dto.getNotas());
        response.setTipoReserva(dto.getTipoReserva());
        response.setCreatedAt(dto.getCreatedAt());
        response.setUpdatedAt(dto.getUpdatedAt());
        return response;
    }
}
