package com.emotivapoli.club.presentation.controller;

import com.emotivapoli.club.application.mapper.ClubMapper;
import com.emotivapoli.club.application.service.ClubService;
import com.emotivapoli.club.domain.dto.ClubDTO;
import com.emotivapoli.club.presentation.schemas.request.ClubCreateRequest;
import com.emotivapoli.club.presentation.schemas.request.ClubUpdateRequest;
import com.emotivapoli.club.presentation.schemas.response.ClubResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

    // Búsqueda con filtros y paginación
    public ResponseEntity<Map<String, Object>> searchClubs(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String deporte,
            @RequestParam(required = false) String nivel,
            @RequestParam(required = false) BigDecimal precioMax,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int limit,
            @RequestParam(defaultValue = "default") String sort) {

        int pageNumber = Math.max(0, page - 1);
        int validLimit = Math.min(Math.max(1, limit), 100);

        Page<ClubDTO> clubsPage = clubService.searchClubs(q, deporte, nivel, precioMax, pageNumber, validLimit, sort);

        List<ClubResponse> content = clubsPage.getContent().stream()
                .map(clubMapper::toResponse)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("content", content);
        response.put("totalElements", clubsPage.getTotalElements());
        response.put("totalPages", clubsPage.getTotalPages());
        response.put("size", clubsPage.getSize());
        response.put("number", clubsPage.getNumber() + 1);
        response.put("numberOfElements", clubsPage.getNumberOfElements());
        response.put("first", clubsPage.isFirst());
        response.put("last", clubsPage.isLast());
        response.put("empty", clubsPage.isEmpty());

        return ResponseEntity.ok(response);
    }
}
