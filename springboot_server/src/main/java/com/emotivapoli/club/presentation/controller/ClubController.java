package com.emotivapoli.club.presentation.controller;

import com.emotivapoli.club.application.mapper.ClubMapper;
import com.emotivapoli.club.application.service.ClubService;
import com.emotivapoli.club.domain.dto.ClubDTO;
import com.emotivapoli.club.presentation.schemas.request.ClubCreateRequest;
import com.emotivapoli.club.presentation.schemas.request.ClubUpdateRequest;
import com.emotivapoli.club.presentation.schemas.response.ClubResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ClubController {

    @Autowired
    private ClubService clubService;

    @Autowired
    private ClubMapper clubMapper;

    // Listar
    public List<ClubResponse> getAllClubs() {
        return clubService.getAllClubs().stream()
                .map(clubMapper::toResponse)
                .collect(Collectors.toList());
    }

    // Por slug
    public ClubResponse getClubBySlug(String slug) {
        ClubDTO clubDTO = clubService.getClubBySlug(slug);
        return clubMapper.toResponse(clubDTO);
    }

    // Crear
    public ClubResponse createClub(ClubCreateRequest request) {
        ClubDTO clubDTO = clubMapper.createRequestToDTO(request);
        ClubDTO createdClub = clubService.createClub(clubDTO);
        return clubMapper.toResponse(createdClub);
    }

    // Actualizar por slug
    public ClubResponse updateClubBySlug(String slug, ClubUpdateRequest request) {
        ClubDTO existing = clubService.getClubBySlug(slug);
        
        ClubDTO updateDTO = new ClubDTO();
        updateDTO.setNombre(request.getNombre());
        updateDTO.setDescripcion(request.getDescripcion());
        updateDTO.setDeporte(request.getDeporte());
        updateDTO.setImagen(request.getImagen());
        updateDTO.setEntrenadorId(request.getEntrenadorId());
        updateDTO.setMaxMiembros(request.getMaxMiembros());
        updateDTO.setNivel(request.getNivel());
        updateDTO.setPrecioMensual(request.getPrecioMensual());
        updateDTO.setStatus(request.getStatus());
        updateDTO.setIsActive(request.getIsActive());
        
        ClubDTO updatedClub = clubService.updateClub(existing.getId(), updateDTO);
        return clubMapper.toResponse(updatedClub);
    }

    // Eliminar por slug
    public void deleteClubBySlug(String slug) {
        ClubDTO existing = clubService.getClubBySlug(slug);
        clubService.deleteClub(existing.getId());
    }
}
