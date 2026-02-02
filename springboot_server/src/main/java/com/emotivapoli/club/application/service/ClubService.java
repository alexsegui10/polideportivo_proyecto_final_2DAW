package com.emotivapoli.club.application.service;

import com.emotivapoli.club.application.mapper.ClubMapper;
import com.emotivapoli.club.domain.dto.ClubDTO;
import com.emotivapoli.club.domain.entity.Club;
import com.emotivapoli.club.infrastructure.repository.ClubRepository;
import com.emotivapoli.usuario.domain.entity.Usuario;
import com.emotivapoli.usuario.infrastructure.repository.UsuarioRepository;
import com.emotivapoli.utils.SlugUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ClubService {

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ClubMapper clubMapper;

    // Crear
    @Transactional
    public ClubDTO createClub(ClubDTO clubDTO) {
        // Generar slug
        String slug = SlugUtils.generateSlug(clubDTO.getNombre());
        
        // Verificar slug único
        if (clubRepository.existsBySlugAndNotDeleted(slug)) {
            slug = slug + "-" + System.currentTimeMillis();
        }
        
        clubDTO.setSlug(slug);
        clubDTO.setUid(UUID.randomUUID());
        
        Club club = clubMapper.toEntity(clubDTO);
        
        // Asociar entrenador si existe
        if (clubDTO.getEntrenadorId() != null) {
            Usuario entrenador = usuarioRepository.findById(clubDTO.getEntrenadorId())
                    .orElseThrow(() -> new RuntimeException("Entrenador no encontrado"));
            club.setEntrenador(entrenador);
        }
        
        club.setCreatedAt(LocalDateTime.now());
        club.setUpdatedAt(LocalDateTime.now());
        
        Club saved = clubRepository.save(club);
        return clubMapper.toDTO(saved);
    }

    // Listar activos
    public List<ClubDTO> getAllClubs() {
        return clubRepository.findActivos().stream()
                .map(clubMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Por ID
    public ClubDTO getClubById(Long id) {
        Club club = clubRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Club no encontrado con ID: " + id));
        return clubMapper.toDTO(club);
    }

    // Por slug
    public ClubDTO getClubBySlug(String slug) {
        Club club = clubRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Club no encontrado con slug: " + slug));
        return clubMapper.toDTO(club);
    }

    // Actualizar
    @Transactional
    public ClubDTO updateClub(Long id, ClubDTO clubDTO) {
        Club club = clubRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Club no encontrado"));
        
        club.setNombre(clubDTO.getNombre());
        club.setDescripcion(clubDTO.getDescripcion());
        club.setDeporte(clubDTO.getDeporte());
        club.setImagen(clubDTO.getImagen());
        club.setMaxMiembros(clubDTO.getMaxMiembros());
        club.setNivel(clubDTO.getNivel());
        club.setPrecioMensual(clubDTO.getPrecioMensual());
        club.setStatus(clubDTO.getStatus());
        club.setIsActive(clubDTO.getIsActive());
        
        // Actualizar entrenador
        if (clubDTO.getEntrenadorId() != null) {
            Usuario entrenador = usuarioRepository.findById(clubDTO.getEntrenadorId())
                    .orElseThrow(() -> new RuntimeException("Entrenador no encontrado"));
            club.setEntrenador(entrenador);
        }
        
        club.setUpdatedAt(LocalDateTime.now());
        
        Club updated = clubRepository.save(club);
        return clubMapper.toDTO(updated);
    }

    // Soft delete
    @Transactional
    public void deleteClub(Long id) {
        Club club = clubRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Club no encontrado"));
        
        club.setStatus("eliminado");
        club.setIsActive(false);
        club.setUpdatedAt(LocalDateTime.now());
        
        clubRepository.save(club);
    }
}
