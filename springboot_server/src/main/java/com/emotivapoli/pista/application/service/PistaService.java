package com.emotivapoli.pista.application.service;

import com.emotivapoli.pista.domain.dto.PistaDTO;
import com.emotivapoli.pista.domain.entity.Pista;
import com.emotivapoli.pista.infrastructure.mapper.PistaMapper;
import com.emotivapoli.pista.infrastructure.repository.PistaRepository;
import com.emotivapoli.utils.SlugUtils;
import com.emotivapoli.exception.DuplicateResourceException;
import com.emotivapoli.exception.ResourceNotFoundException;
import com.emotivapoli.exception.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PistaService {

    @Autowired
    private PistaRepository pistaRepository;

    @Autowired
    private PistaMapper pistaMapper;

    // Listar activas
    public List<PistaDTO> getAllPistas() {
        List<Pista> pistas = pistaRepository.findAll();
        return pistas.stream()
                .filter(p -> !"eliminado".equals(p.getStatus()))
                .map(pistaMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Por ID
    public PistaDTO getPistaById(Long id) {
        Pista pista = pistaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pista no encontrada con ID: " + id));
        return pistaMapper.toDTO(pista);
    }

    // Por slug
    public PistaDTO getPistaBySlug(String slug) {
        Pista pista = pistaRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Pista no encontrada con slug: " + slug));
        return pistaMapper.toDTO(pista);
    }

    // Crear
    public PistaDTO createPista(PistaDTO pistaDTO) {
        // Validar campos obligatorios
        if (pistaDTO.getNombre() == null || pistaDTO.getNombre().trim().isEmpty()) {
            throw new ValidationException("El nombre de la pista es obligatorio");
        }
        if (pistaDTO.getTipo() == null || pistaDTO.getTipo().trim().isEmpty()) {
            throw new ValidationException("El tipo de pista es obligatorio");
        }

        // Generar slug con 4 números aleatorios
        String slug = SlugUtils.generateSlug(pistaDTO.getNombre());

        Pista pista = pistaMapper.toEntity(pistaDTO);
        pista.setSlug(slug);
        pista.setIsActive(true);
        
        Pista savedPista = pistaRepository.save(pista);
        return pistaMapper.toDTO(savedPista);
    }

    // Actualizar
    public PistaDTO updatePista(Long id, PistaDTO pistaDTO) {
        Pista existingPista = pistaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pista no encontrada con ID: " + id));

        // Validar nombre si se está actualizando
        if (pistaDTO.getNombre() != null && pistaDTO.getNombre().trim().isEmpty()) {
            throw new ValidationException("El nombre de la pista no puede estar vacío");
        }

        String nuevoSlug = existingPista.getSlug();
        if (pistaDTO.getNombre() != null && !existingPista.getNombre().equals(pistaDTO.getNombre())) {
            nuevoSlug = SlugUtils.generateSlug(pistaDTO.getNombre());
        }

        existingPista.setNombre(pistaDTO.getNombre());
        existingPista.setTipo(pistaDTO.getTipo());
        existingPista.setStatus(pistaDTO.getStatus());
        existingPista.setIsActive(pistaDTO.getIsActive());
        existingPista.setSlug(nuevoSlug);
        existingPista.setPrecioHora(pistaDTO.getPrecioHora());
        existingPista.setDescripcion(pistaDTO.getDescripcion());
        existingPista.setImagen(pistaDTO.getImagen());

        Pista updatedPista = pistaRepository.save(existingPista);
        return pistaMapper.toDTO(updatedPista);
    }

    // Soft delete
    public void deletePista(Long id) {
        Pista pista = pistaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pista no encontrada con ID: " + id));

        pista.setStatus("eliminado");
        pista.setIsActive(false);
        
        pistaRepository.save(pista);
    }
}
