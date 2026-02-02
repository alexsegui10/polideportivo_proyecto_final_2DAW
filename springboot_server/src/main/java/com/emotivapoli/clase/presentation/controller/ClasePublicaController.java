package com.emotivapoli.clase.presentation.controller;

import com.emotivapoli.clase.application.mapper.ClasePublicaMapper;
import com.emotivapoli.clase.application.service.ClasePublicaService;
import com.emotivapoli.clase.domain.dto.ClasePublicaDTO;
import com.emotivapoli.clase.presentation.schemas.request.ClaseCreateRequest;
import com.emotivapoli.clase.presentation.schemas.request.ClaseUpdateRequest;
import com.emotivapoli.clase.presentation.schemas.response.ClaseResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ClasePublicaController {

    @Autowired
    private ClasePublicaService claseService;

    @Autowired
    private ClasePublicaMapper claseMapper;

    // Listar
    public List<ClaseResponse> getAllClases() {
        return claseService.getAllClases().stream()
                .map(claseMapper::toResponse)
                .collect(Collectors.toList());
    }

    // Por slug
    public ClaseResponse getClaseBySlug(String slug) {
        ClasePublicaDTO claseDTO = claseService.getClaseBySlug(slug);
        return claseMapper.toResponse(claseDTO);
    }

    // Crear
    public ClaseResponse createClase(ClaseCreateRequest request) {
        ClasePublicaDTO claseDTO = claseMapper.createRequestToDTO(request);
        ClasePublicaDTO createdClase = claseService.createClase(claseDTO);
        return claseMapper.toResponse(createdClase);
    }

    // Actualizar por slug
    public ClaseResponse updateClaseBySlug(String slug, ClaseUpdateRequest request) {
        ClasePublicaDTO existing = claseService.getClaseBySlug(slug);
        
        ClasePublicaDTO updateDTO = new ClasePublicaDTO();
        updateDTO.setNombre(request.getNombre());
        updateDTO.setDescripcion(request.getDescripcion());
        updateDTO.setImagen(request.getImagen());
        updateDTO.setEntrenadorId(request.getEntrenadorId());
        updateDTO.setPistaId(request.getPistaId());
        updateDTO.setFechaHoraInicio(request.getFechaHoraInicio());
        updateDTO.setFechaHoraFin(request.getFechaHoraFin());
        updateDTO.setDuracionMinutos(request.getDuracionMinutos());
        updateDTO.setMaxParticipantes(request.getMaxParticipantes());
        updateDTO.setNivel(request.getNivel());
        updateDTO.setDeporte(request.getDeporte());
        updateDTO.setStatus(request.getStatus());
        updateDTO.setIsActive(request.getIsActive());
        
        ClasePublicaDTO updatedClase = claseService.updateClase(existing.getId(), updateDTO);
        return claseMapper.toResponse(updatedClase);
    }

    // Eliminar por slug
    public void deleteClaseBySlug(String slug) {
        ClasePublicaDTO existing = claseService.getClaseBySlug(slug);
        claseService.deleteClase(existing.getId());
    }
}
