package com.emotivapoli.incidencia.presentation.controller;

import com.emotivapoli.incidencia.application.service.IncidenciaService;
import com.emotivapoli.incidencia.domain.dto.IncidenciaDTO;
import com.emotivapoli.incidencia.presentation.request.IncidenciaCreateRequest;
import com.emotivapoli.incidencia.presentation.request.IncidenciaEstadoUpdateRequest;
import com.emotivapoli.incidencia.presentation.response.IncidenciaResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class IncidenciaController {

    @Autowired
    private IncidenciaService incidenciaService;

    public IncidenciaResponse createIncidencia(Long usuarioId, IncidenciaCreateRequest request) {
        IncidenciaDTO dto = incidenciaService.createIncidencia(
                usuarioId,
                request.getTitulo(),
                request.getDescripcion(),
                request.getTipo(),
                request.getPrioridad(),
                request.getPagina()
        );
        return toResponse(dto);
    }

    public List<IncidenciaResponse> getMisIncidencias(Long usuarioId) {
        return incidenciaService.getMisIncidencias(usuarioId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<IncidenciaResponse> getIncidenciasAdmin(String estado) {
        return incidenciaService.getIncidenciasAdmin(estado)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public IncidenciaResponse updateEstado(Long incidenciaId, IncidenciaEstadoUpdateRequest request) {
        return toResponse(incidenciaService.updateEstado(incidenciaId, request.getEstado()));
    }

    private IncidenciaResponse toResponse(IncidenciaDTO dto) {
        IncidenciaResponse response = new IncidenciaResponse();
        response.setId(dto.getId());
        response.setUsuarioId(dto.getUsuarioId());
        response.setUsuarioNombre(dto.getUsuarioNombre());
        response.setTitulo(dto.getTitulo());
        response.setDescripcion(dto.getDescripcion());
        response.setTipo(dto.getTipo());
        response.setPrioridad(dto.getPrioridad());
        response.setEstado(dto.getEstado());
        response.setPagina(dto.getPagina());
        response.setCreatedAt(dto.getCreatedAt());
        response.setUpdatedAt(dto.getUpdatedAt());
        return response;
    }
}
