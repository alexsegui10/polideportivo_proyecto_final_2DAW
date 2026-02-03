package com.emotivapoli.club.application.service;

import com.emotivapoli.club.application.mapper.ClubMiembroMapper;
import com.emotivapoli.club.domain.dto.ClubMiembroDTO;
import com.emotivapoli.club.domain.entity.Club;
import com.emotivapoli.club.domain.entity.ClubMiembro;
import com.emotivapoli.club.infrastructure.repository.ClubMiembroRepository;
import com.emotivapoli.club.infrastructure.repository.ClubRepository;
import com.emotivapoli.club.infrastructure.repository.ClubSuscripcionRepository;
import com.emotivapoli.usuario.domain.entity.Usuario;
import com.emotivapoli.usuario.infrastructure.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ClubMiembroService {

    @Autowired
    private ClubMiembroRepository clubMiembroRepository;

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ClubSuscripcionRepository clubSuscripcionRepository;

    @Autowired
    private ClubMiembroMapper clubMiembroMapper;

    /**
     * Inscribir un usuario a un club
     * Si ya existe un registro previo (baja/expulsado), lo reactiva
     * Valida capacidad máxima y que no esté ya inscrito activo
     */
    @Transactional
    public ClubMiembroDTO inscribirMiembro(Long clubId, Long usuarioId) {
        // Validar que el club existe
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club no encontrado con ID: " + clubId));

        // Validar que el usuario existe
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + usuarioId));

        // Verificar si ya existe un registro para este usuario en este club
        Optional<ClubMiembro> miembroExistente = clubMiembroRepository.findByClubIdAndUsuarioId(clubId, usuarioId);
        
        if (miembroExistente.isPresent()) {
            ClubMiembro miembro = miembroExistente.get();
            
            // Si está activo, no se puede reinscribir
            if (miembro.getStatus().equals("activo")) {
                throw new RuntimeException("El usuario ya está inscrito en este club");
            }
            
            // Si está en baja o fue expulsado, reactivar su membresía
            if (miembro.getStatus().equals("inactivo") || miembro.getStatus().equals("expulsado")) {
                // Validar capacidad antes de reactivar
                Long miembrosActuales = clubMiembroRepository.countMiembrosActivosByClubId(clubId);
                if (club.getMaxMiembros() != null && miembrosActuales >= club.getMaxMiembros()) {
                    throw new RuntimeException("El club ha alcanzado su capacidad máxima de miembros");
                }
                
                miembro.setStatus("activo");
                miembro.setIsActive(true);
                miembro.setFechaBaja(null);
                miembro.setFechaInscripcion(LocalDateTime.now());
                miembro.setUpdatedAt(LocalDateTime.now());
                
                ClubMiembro reactivado = clubMiembroRepository.save(miembro);
                return clubMiembroMapper.toDTO(reactivado);
            }
        }

        // Validar capacidad máxima para nuevas inscripciones
        Long miembrosActuales = clubMiembroRepository.countMiembrosActivosByClubId(clubId);
        if (club.getMaxMiembros() != null && miembrosActuales >= club.getMaxMiembros()) {
            throw new RuntimeException("El club ha alcanzado su capacidad máxima de miembros");
        }

        // Crear nuevo miembro
        ClubMiembro miembro = new ClubMiembro();
        miembro.setUid(UUID.randomUUID());
        miembro.setClub(club);
        miembro.setUsuario(usuario);
        miembro.setStatus("activo");
        miembro.setIsActive(true);
        miembro.setFechaInscripcion(LocalDateTime.now());
        miembro.setCreatedAt(LocalDateTime.now());
        miembro.setUpdatedAt(LocalDateTime.now());

        ClubMiembro saved = clubMiembroRepository.save(miembro);
        return clubMiembroMapper.toDTO(saved);
    }

    /**
     * Listar miembros activos de un club
     */
    public List<ClubMiembroDTO> getMiembrosByClubId(Long clubId) {
        return clubMiembroRepository.findByClubIdActivos(clubId).stream()
                .map(m -> {
                    ClubMiembroDTO dto = clubMiembroMapper.toDTO(m);
                    // Verificar si tiene suscripción activa
                    boolean tieneSuscripcion = clubSuscripcionRepository
                            .findActivaByMiembroId(m.getId())
                            .isPresent();
                    dto.setTieneSuscripcionActiva(tieneSuscripcion);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    /**
     * Listar clubes donde el usuario es miembro
     */
    public List<ClubMiembroDTO> getClubsByUsuarioId(Long usuarioId) {
        return clubMiembroRepository.findByUsuarioId(usuarioId).stream()
                .map(clubMiembroMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtener miembro por UID
     */
    public ClubMiembroDTO getMiembroByUid(UUID uid) {
        ClubMiembro miembro = clubMiembroRepository.findByUid(uid)
                .orElseThrow(() -> new RuntimeException("Miembro no encontrado con UID: " + uid));
        
        ClubMiembroDTO dto = clubMiembroMapper.toDTO(miembro);
        
        // Verificar si tiene suscripción activa
        boolean tieneSuscripcion = clubSuscripcionRepository
                .findActivaByMiembroId(miembro.getId())
                .isPresent();
        dto.setTieneSuscripcionActiva(tieneSuscripcion);
        
        return dto;
    }

    /**
     * Dar de baja a un miembro (soft delete)
     * También cancela sus suscripciones activas
     */
    @Transactional
    public void darDeBajaMiembro(UUID uid) {
        ClubMiembro miembro = clubMiembroRepository.findByUid(uid)
                .orElseThrow(() -> new RuntimeException("Miembro no encontrado"));

        miembro.setStatus("inactivo");
        miembro.setIsActive(false);
        miembro.setFechaBaja(LocalDateTime.now());
        miembro.setUpdatedAt(LocalDateTime.now());

        clubMiembroRepository.save(miembro);

        // Cancelar suscripciones activas
        clubSuscripcionRepository.findActivaByMiembroId(miembro.getId())
                .ifPresent(suscripcion -> {
                    suscripcion.setStatus("cancelada");
                    suscripcion.setIsActive(false);
                    suscripcion.setFechaFin(java.time.LocalDate.now());
                    suscripcion.setUpdatedAt(LocalDateTime.now());
                    clubSuscripcionRepository.save(suscripcion);
                });
    }

    /**
     * Expulsar a un miembro del club
     */
    @Transactional
    public void expulsarMiembro(UUID uid) {
        ClubMiembro miembro = clubMiembroRepository.findByUid(uid)
                .orElseThrow(() -> new RuntimeException("Miembro no encontrado"));

        miembro.setStatus("expulsado");
        miembro.setIsActive(false);
        miembro.setFechaBaja(LocalDateTime.now());
        miembro.setUpdatedAt(LocalDateTime.now());

        clubMiembroRepository.save(miembro);

        // Cancelar suscripciones
        clubSuscripcionRepository.findActivaByMiembroId(miembro.getId())
                .ifPresent(suscripcion -> {
                    suscripcion.setStatus("cancelada");
                    suscripcion.setIsActive(false);
                    suscripcion.setFechaFin(java.time.LocalDate.now());
                    suscripcion.setUpdatedAt(LocalDateTime.now());
                    clubSuscripcionRepository.save(suscripcion);
                });
    }

    /**
     * Reactivar miembro (permite reactivar inactivos y expulsados)
     */
    @Transactional
    public ClubMiembroDTO reactivarMiembro(UUID uid) {
        ClubMiembro miembro = clubMiembroRepository.findByUid(uid)
                .orElseThrow(() -> new RuntimeException("Miembro no encontrado"));

        if (miembro.getStatus().equals("activo")) {
            throw new RuntimeException("El miembro ya está activo");
        }

        // Validar capacidad antes de reactivar
        Long miembrosActuales = clubMiembroRepository.countMiembrosActivosByClubId(miembro.getClub().getId());
        if (miembro.getClub().getMaxMiembros() != null && miembrosActuales >= miembro.getClub().getMaxMiembros()) {
            throw new RuntimeException("El club ha alcanzado su capacidad máxima de miembros");
        }


        miembro.setStatus("activo");
        miembro.setIsActive(true);
        miembro.setFechaBaja(null);
        miembro.setUpdatedAt(LocalDateTime.now());

        ClubMiembro saved = clubMiembroRepository.save(miembro);
        return clubMiembroMapper.toDTO(saved);
    }

    /**
     * Listar todos los miembros activos
     */
    public List<ClubMiembroDTO> getAllMiembrosActivos() {
        return clubMiembroRepository.findActivos().stream()
                .map(clubMiembroMapper::toDTO)
                .collect(Collectors.toList());
    }
}
