package com.emotivapoli.clase.application.service;

import com.emotivapoli.clase.application.mapper.ClasePublicaMapper;
import com.emotivapoli.clase.domain.dto.ClasePublicaDTO;
import com.emotivapoli.clase.domain.entity.ClasePublica;
import com.emotivapoli.clase.infrastructure.repository.ClasePublicaRepository;
import com.emotivapoli.pista.domain.entity.Pista;
import com.emotivapoli.pista.infrastructure.repository.PistaRepository;
import com.emotivapoli.reserva.domain.entity.Reserva;
import com.emotivapoli.reserva.infrastructure.repository.ReservaRepository;
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
public class ClasePublicaService {

    @Autowired
    private ClasePublicaRepository claseRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PistaRepository pistaRepository;

    @Autowired
    private ClasePublicaMapper claseMapper;

    @Autowired
    private ReservaRepository reservaRepository;

    /**
     * Valida que no haya conflictos de horario con reservas u otras clases
     */
    private void validarConflictos(LocalDateTime inicio, LocalDateTime fin, Long pistaId, Long claseIdActual) {
        // Verificar conflictos con reservas
        List<Reserva> reservasConflict = reservaRepository.findAll().stream()
                .filter(r -> r.getIsActive() && r.getPista().getId().equals(pistaId))
                .filter(r -> hayConflictoHorario(inicio, fin, r.getFechaHoraInicio(), r.getFechaHoraFin()))
                .collect(Collectors.toList());

        if (!reservasConflict.isEmpty()) {
            throw new RuntimeException("Conflicto de horario: ya existe una reserva en esta pista");
        }

        // Verificar conflictos con otras clases
        List<ClasePublica> clasesConflict = claseRepository.findAll().stream()
                .filter(c -> c.getIsActive() && c.getPista().getId().equals(pistaId))
                .filter(c -> claseIdActual == null || !c.getId().equals(claseIdActual))
                .filter(c -> hayConflictoHorario(inicio, fin, c.getFechaHoraInicio(), c.getFechaHoraFin()))
                .collect(Collectors.toList());

        if (!clasesConflict.isEmpty()) {
            throw new RuntimeException("Conflicto de horario: ya existe otra clase en esta pista");
        }
    }

    /**
     * Detecta si dos rangos de fechas se solapan
     */
    private boolean hayConflictoHorario(LocalDateTime inicio1, LocalDateTime fin1,
            LocalDateTime inicio2, LocalDateTime fin2) {
        return (inicio1.isBefore(fin2) && fin1.isAfter(inicio2));
    }

    // Crear
    @Transactional
    public ClasePublicaDTO createClase(ClasePublicaDTO claseDTO) {
        // Generar slug
        String slug = SlugUtils.generateSlug(claseDTO.getNombre());

        if (claseRepository.existsBySlugAndNotDeleted(slug)) {
            slug = slug + "-" + System.currentTimeMillis();
        }

        claseDTO.setSlug(slug);
        claseDTO.setUid(UUID.randomUUID());

        ClasePublica clase = claseMapper.toEntity(claseDTO);

        // Asociar entrenador
        if (claseDTO.getEntrenadorId() != null) {
            Usuario entrenador = usuarioRepository.findById(claseDTO.getEntrenadorId())
                    .orElseThrow(() -> new RuntimeException("Entrenador no encontrado"));
            clase.setEntrenador(entrenador);
        }

        // Asociar pista
        if (claseDTO.getPistaId() != null) {
            Pista pista = pistaRepository.findById(claseDTO.getPistaId())
                    .orElseThrow(() -> new RuntimeException("Pista no encontrada"));
            clase.setPista(pista);
        }

        // VALIDAR QUE NO SEA FECHA PASADA
        if (claseDTO.getFechaHoraInicio().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("No se pueden crear clases en fechas pasadas");
        }

        // VALIDAR CONFLICTOS DE HORARIO
        validarConflictos(claseDTO.getFechaHoraInicio(), claseDTO.getFechaHoraFin(),
                claseDTO.getPistaId(), null);

        clase.setCreatedAt(LocalDateTime.now());
        clase.setUpdatedAt(LocalDateTime.now());

        ClasePublica saved = claseRepository.save(clase);
        return claseMapper.toDTO(saved);
    }

    // Listar
    public List<ClasePublicaDTO> getAllClases() {
        return claseRepository.findActivas().stream()
                .map(claseMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Por ID
    public ClasePublicaDTO getClaseById(Long id) {
        ClasePublica clase = claseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Clase no encontrada"));
        return claseMapper.toDTO(clase);
    }

    // Por slug
    public ClasePublicaDTO getClaseBySlug(String slug) {
        ClasePublica clase = claseRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Clase no encontrada con slug: " + slug));
        return claseMapper.toDTO(clase);
    }

    // Actualizar
    @Transactional
    public ClasePublicaDTO updateClase(Long id, ClasePublicaDTO claseDTO) {
        ClasePublica clase = claseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Clase no encontrada"));

        clase.setNombre(claseDTO.getNombre());
        clase.setDescripcion(claseDTO.getDescripcion());
        clase.setImagen(claseDTO.getImagen());
        clase.setFechaHoraInicio(claseDTO.getFechaHoraInicio());
        clase.setFechaHoraFin(claseDTO.getFechaHoraFin());
        clase.setDuracionMinutos(claseDTO.getDuracionMinutos());
        clase.setMaxParticipantes(claseDTO.getMaxParticipantes());
        clase.setPrecio(claseDTO.getPrecio() != null ? claseDTO.getPrecio() : java.math.BigDecimal.ZERO);
        clase.setNivel(claseDTO.getNivel());
        clase.setDeporte(claseDTO.getDeporte());
        clase.setStatus(claseDTO.getStatus());
        clase.setIsActive(claseDTO.getIsActive());

        if (claseDTO.getEntrenadorId() != null) {
            Usuario entrenador = usuarioRepository.findById(claseDTO.getEntrenadorId())
                    .orElseThrow(() -> new RuntimeException("Entrenador no encontrado"));
            clase.setEntrenador(entrenador);
        }

        if (claseDTO.getPistaId() != null) {
            Pista pista = pistaRepository.findById(claseDTO.getPistaId())
                    .orElseThrow(() -> new RuntimeException("Pista no encontrada"));
            clase.setPista(pista);
        }

        // VALIDAR CONFLICTOS DE HORARIO (excluyendo esta misma clase)
        validarConflictos(claseDTO.getFechaHoraInicio(), claseDTO.getFechaHoraFin(),
                claseDTO.getPistaId(), id);

        clase.setUpdatedAt(LocalDateTime.now());

        ClasePublica updated = claseRepository.save(clase);
        return claseMapper.toDTO(updated);
    }

    // Soft delete
    @Transactional
    public void deleteClase(Long id) {
        ClasePublica clase = claseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Clase no encontrada"));

        clase.setStatus("eliminado");
        clase.setIsActive(false);
        clase.setUpdatedAt(LocalDateTime.now());

        claseRepository.save(clase);
    }
}
