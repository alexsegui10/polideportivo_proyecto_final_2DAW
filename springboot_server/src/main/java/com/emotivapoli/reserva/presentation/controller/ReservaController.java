package com.emotivapoli.reserva.presentation.controller;

import com.emotivapoli.reserva.application.mapper.ReservaMapper;
import com.emotivapoli.reserva.application.service.ReservaService;
import com.emotivapoli.reserva.domain.dto.ReservaDTO;
import com.emotivapoli.reserva.presentation.schemas.request.ReservaCreateRequest;
import com.emotivapoli.reserva.presentation.schemas.request.ReservaUpdateRequest;
import com.emotivapoli.reserva.presentation.schemas.response.ReservaResponse;
import com.emotivapoli.reserva.presentation.schemas.response.ReservaWithPagoResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    @Autowired
    private ReservaMapper reservaMapper;

    // Listar
    public List<ReservaResponse> getAllReservas() {
        return reservaService.getAllReservas().stream()
                .map(reservaMapper::toResponse)
                .collect(Collectors.toList());
    }

    // Por slug (con pago)
    public ReservaWithPagoResponse getReservaBySlug(String slug) {
        return reservaService.getReservaBySlugWithPago(slug);
    }

    // Crear
    public ReservaResponse createReserva(ReservaCreateRequest request) {
        ReservaDTO reservaDTO = reservaMapper.createRequestToDTO(request);
        ReservaDTO createdReserva = reservaService.createReserva(reservaDTO);
        return reservaMapper.toResponse(createdReserva);
    }

    // Actualizar por slug
    public ReservaResponse updateReservaBySlug(String slug, ReservaUpdateRequest request) {
        ReservaWithPagoResponse existing = reservaService.getReservaBySlugWithPago(slug);
        
        ReservaDTO updateDTO = new ReservaDTO();
        updateDTO.setPistaId(request.getPistaId());
        updateDTO.setClubId(request.getClubId());
        updateDTO.setFechaHoraInicio(request.getFechaHoraInicio());
        updateDTO.setFechaHoraFin(request.getFechaHoraFin());
        updateDTO.setPrecio(request.getPrecio());
        updateDTO.setMetodoPago(request.getMetodoPago());
        updateDTO.setStatus(request.getStatus());
        updateDTO.setIsActive(request.getIsActive());
        updateDTO.setNotas(request.getNotas());
        updateDTO.setTipoReserva(request.getTipoReserva());
        
        ReservaDTO updatedReserva = reservaService.updateReserva(existing.getId(), updateDTO);
        return reservaMapper.toResponse(updatedReserva);
    }

    // Eliminar por slug
    public void deleteReservaBySlug(String slug) {
        ReservaWithPagoResponse existing = reservaService.getReservaBySlugWithPago(slug);
        reservaService.deleteReserva(existing.getId());
    }
}
