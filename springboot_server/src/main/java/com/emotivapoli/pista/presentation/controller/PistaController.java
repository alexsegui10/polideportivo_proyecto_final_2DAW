package com.emotivapoli.pista.presentation.controller;

import com.emotivapoli.pista.application.service.PistaService;
import com.emotivapoli.pista.domain.dto.PistaDTO;
import com.emotivapoli.pista.presentation.request.PistaRequest;
import com.emotivapoli.pista.presentation.response.PistaResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

    /**
     * Búsqueda y filtrado de pistas con paginación
     * 
     * @param q Texto de búsqueda por nombre
     * @param tipo Tipos de deporte (separados por coma: padel,tenis,futbol)
     * @param precioMax Precio máximo por hora
     * @param page Número de página (base 1 por defecto)
     * @param limit Tamaño de página (por defecto 12)
     * @param sort Ordenamiento: precio_asc, precio_desc, o default
     * @return ResponseEntity con paginación y lista de pistas
     */
    public ResponseEntity<Map<String, Object>> searchPistas(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) BigDecimal precioMax,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int limit,
            @RequestParam(defaultValue = "default") String sort) {
        
        // Convertir página de base 1 a base 0 para Spring Data
        int pageNumber = Math.max(0, page - 1);
        
        // Validar limit
        int validLimit = Math.min(Math.max(1, limit), 100); // Entre 1 y 100
        
        // Ejecutar búsqueda
        Page<PistaDTO> pistasPage = pistaService.searchPistas(q, tipo, precioMax, pageNumber, validLimit, sort);
        
        // Convertir a Response
        List<PistaResponse> content = pistasPage.getContent().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        
        // Construir respuesta con metadatos de paginación
        Map<String, Object> response = new HashMap<>();
        response.put("content", content);
        response.put("totalElements", pistasPage.getTotalElements());
        response.put("totalPages", pistasPage.getTotalPages());
        response.put("size", pistasPage.getSize());
        response.put("number", pistasPage.getNumber() + 1); // Convertir de vuelta a base 1
        response.put("numberOfElements", pistasPage.getNumberOfElements());
        response.put("first", pistasPage.isFirst());
        response.put("last", pistasPage.isLast());
        response.put("empty", pistasPage.isEmpty());
        
        return ResponseEntity.ok(response);
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
    