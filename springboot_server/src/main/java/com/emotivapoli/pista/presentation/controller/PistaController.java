package com.emotivapoli.pista.presentation.controller;

import com.emotivapoli.pista.application.service.PistaService;
import com.emotivapoli.pista.domain.dto.PistaDTO;
import com.emotivapoli.pista.presentation.request.PistaRequest;
import com.emotivapoli.pista.presentation.response.PistaResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controlador para gestión de pistas
 * Recibe los datos del request, coordina con el servicio y devuelve la respuesta
 */
@Component
public class PistaController {

    private final PistaService pistaService;

    @Autowired
    public PistaController(PistaService pistaService) {
        this.pistaService = pistaService;
    }

    /**
     * Obtener todas las pistas
     */
    public ResponseEntity<List<PistaResponse>> getAllPistas() {
        List<PistaDTO> pistasDTO = pistaService.getAllPistas();
        
        List<PistaResponse> response = pistasDTO.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Obtener una pista por ID
     */
    public ResponseEntity<PistaResponse> getPistaById(@PathVariable Long id) {
        PistaDTO pistaDTO = pistaService.getPistaById(id);
        PistaResponse response = convertToResponse(pistaDTO);
        return ResponseEntity.ok(response);
    }

    /**
     * Crear una nueva pista
     */
    public ResponseEntity<PistaResponse> createPista(@RequestBody PistaRequest request) {
        PistaDTO pistaDTO = convertToDTO(request);
        PistaDTO createdPista = pistaService.createPista(pistaDTO);
        PistaResponse response = convertToResponse(createdPista);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Actualizar una pista existente
     */
    public ResponseEntity<PistaResponse> updatePista(@PathVariable Long id, @RequestBody PistaRequest request) {
        PistaDTO pistaDTO = convertToDTO(request);
        PistaDTO updatedPista = pistaService.updatePista(id, pistaDTO);
        PistaResponse response = convertToResponse(updatedPista);
        return ResponseEntity.ok(response);
    }

    /**
     * Eliminar una pista
     */
    public ResponseEntity<Void> deletePista(@PathVariable Long id) {
        pistaService.deletePista(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Obtener una pista por slug
     */
    public ResponseEntity<PistaResponse> getPistaBySlug(String slug) {
        PistaDTO pistaDTO = pistaService.getPistaBySlug(slug);
        PistaResponse response = convertToResponse(pistaDTO);
        return ResponseEntity.ok(response);
    }

    /**
     * Actualizar una pista por slug
     */
    public ResponseEntity<PistaResponse> updatePistaBySlug(String slug, PistaRequest request) {
        // Obtener ID desde slug
        PistaDTO pistaDTO = pistaService.getPistaBySlug(slug);
        return updatePista(pistaDTO.getId(), request);
    }

    /**
     * Eliminar una pista por slug
     */
    public ResponseEntity<Void> deletePistaBySlug(String slug) {
        // Obtener ID desde slug
        PistaDTO pistaDTO = pistaService.getPistaBySlug(slug);
        pistaService.deletePista(pistaDTO.getId());
        return ResponseEntity.noContent().build();
    }

    // === MÉTODOS DE CONVERSIÓN ===

    /**
     * Convertir PistaRequest a PistaDTO
     */
    private PistaDTO convertToDTO(PistaRequest request) {
        PistaDTO dto = new PistaDTO();
        dto.setNombre(request.getNombre());
        dto.setTipo(request.getTipo());
        dto.setStatus(request.getStatus());
        dto.setIsActive(request.getIsActive());
        dto.setSlug(request.getSlug());
        dto.setPrecioHora(request.getPrecioHora());
        dto.setDescripcion(request.getDescripcion());
        dto.setImagen(request.getImagen());
        return dto;
    }

    /**
     * Convertir PistaDTO a PistaResponse
     */
    private PistaResponse convertToResponse(PistaDTO dto) {
        PistaResponse response = new PistaResponse();
        response.setId(dto.getId());
        response.setNombre(dto.getNombre());
        response.setTipo(dto.getTipo());
        response.setStatus(dto.getStatus());
        response.setIsActive(dto.getIsActive());
        response.setSlug(dto.getSlug());
        response.setPrecioHora(dto.getPrecioHora());
        response.setDescripcion(dto.getDescripcion());
        response.setImagen(dto.getImagen());
        return response;
    }
}
    