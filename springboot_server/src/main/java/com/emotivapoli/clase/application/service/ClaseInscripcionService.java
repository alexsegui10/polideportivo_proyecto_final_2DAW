package com.emotivapoli.clase.application.service;

import com.emotivapoli.clase.application.mapper.ClaseInscripcionMapper;
import com.emotivapoli.clase.domain.dto.ClaseInscripcionDTO;
import com.emotivapoli.clase.domain.entity.ClaseInscripcion;
import com.emotivapoli.clase.domain.entity.ClasePublica;
import com.emotivapoli.clase.infrastructure.repository.ClaseInscripcionRepository;
import com.emotivapoli.clase.infrastructure.repository.ClasePublicaRepository;
import com.emotivapoli.usuario.domain.entity.Usuario;
import com.emotivapoli.usuario.infrastructure.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ClaseInscripcionService {

    @Autowired
    private ClaseInscripcionRepository claseInscripcionRepository;

    @Autowired
    private ClasePublicaRepository clasePublicaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ClaseInscripcionMapper claseInscripcionMapper;

    @Autowired
    private ClaseWaitlistService claseWaitlistService;

    /**
     * Inscribir usuario a una clase
     * Valida capacidad máxima y duplicados
     * Si ya existe una inscripción previa (eliminada/cancelada), la reactiva
     */
    @Transactional
    public ClaseInscripcionDTO inscribirUsuario(Long claseId, Long usuarioId, BigDecimal precioPagado, String metodoPago) {
        ClasePublica clase = clasePublicaRepository.findById(claseId)
                .orElseThrow(() -> new RuntimeException("Clase no encontrada"));

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar si ya existe una inscripción (activa o inactiva)
        java.util.Optional<ClaseInscripcion> inscripcionExistente = 
            claseInscripcionRepository.findByClaseIdAndUsuarioId(claseId, usuarioId);
        
        if (inscripcionExistente.isPresent()) {
            ClaseInscripcion inscripcion = inscripcionExistente.get();
            
            // Si está confirmada y activa, no puede reinscribirse
            if (inscripcion.getStatus().equals("confirmada") && inscripcion.getIsActive()) {
                throw new RuntimeException("El usuario ya está inscrito en esta clase");
            }
            
            // Si está cancelada o eliminada, reactivar
            if (inscripcion.getStatus().equals("cancelada") || 
                inscripcion.getStatus().equals("eliminado") ||
                !inscripcion.getIsActive()) {
                
                // Validar capacidad antes de reactivar
                Long inscritos = claseInscripcionRepository.countInscritosConfirmadosByClaseId(claseId);
                if (inscritos >= clase.getMaxParticipantes()) {
                    throw new RuntimeException("La clase ha alcanzado su capacidad máxima");
                }
                
                // Reactivar la inscripción existente
                BigDecimal precio = precioPagado != null ? precioPagado : (clase.getPrecio() != null ? clase.getPrecio() : BigDecimal.ZERO);
                inscripcion.setStatus("confirmada");
                inscripcion.setIsActive(true);
                inscripcion.setPrecioPagado(precio);
                inscripcion.setMetodoPago(metodoPago != null ? metodoPago : "gratuita");
                inscripcion.setFechaInscripcion(LocalDateTime.now());
                inscripcion.setCancelledAt(null);
                inscripcion.setCancelReason(null);
                inscripcion.setUpdatedAt(LocalDateTime.now());
                
                ClaseInscripcion reactivada = claseInscripcionRepository.save(inscripcion);
                return claseInscripcionMapper.toDTO(reactivada);
            }
        }

        // Validar capacidad para nuevas inscripciones
        Long inscritos = claseInscripcionRepository.countInscritosConfirmadosByClaseId(claseId);
        if (inscritos >= clase.getMaxParticipantes()) {
            throw new RuntimeException("La clase ha alcanzado su capacidad máxima");
        }

        // Usar precio de la clase si no se proporciona
        BigDecimal precio = precioPagado != null ? precioPagado : (clase.getPrecio() != null ? clase.getPrecio() : BigDecimal.ZERO);

        ClaseInscripcion inscripcion = new ClaseInscripcion();
        inscripcion.setUid(UUID.randomUUID());
        inscripcion.setClase(clase);
        inscripcion.setUsuario(usuario);
        inscripcion.setStatus("confirmada");
        inscripcion.setIsActive(true);
        inscripcion.setPrecioPagado(precio);
        inscripcion.setMetodoPago(metodoPago != null ? metodoPago : "gratuita");
        inscripcion.setFechaInscripcion(LocalDateTime.now());
        inscripcion.setCreatedAt(LocalDateTime.now());
        inscripcion.setUpdatedAt(LocalDateTime.now());

        ClaseInscripcion saved = claseInscripcionRepository.save(inscripcion);
        return claseInscripcionMapper.toDTO(saved);
    }

    /**
     * Listar inscritos en una clase
     */
    public List<ClaseInscripcionDTO> getInscritosByClaseId(Long claseId) {
        return claseInscripcionRepository.findByClaseIdActivos(claseId).stream()
                .map(claseInscripcionMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Listar clases donde el usuario está inscrito
     */
    public List<ClaseInscripcionDTO> getClasesByUsuarioId(Long usuarioId) {
        return claseInscripcionRepository.findByUsuarioId(usuarioId).stream()
                .map(claseInscripcionMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtener inscripción por UID
     */
    public ClaseInscripcionDTO getInscripcionByUid(UUID uid) {
        ClaseInscripcion inscripcion = claseInscripcionRepository.findByUid(uid)
                .orElseThrow(() -> new RuntimeException("Inscripción no encontrada"));
        return claseInscripcionMapper.toDTO(inscripcion);
    }

    /**
     * Cancelar inscripción
     * Promociona automáticamente al primer usuario en waitlist si existe
     */
    @Transactional
    public void cancelarInscripcion(UUID uid, String cancelReason) {
        ClaseInscripcion inscripcion = claseInscripcionRepository.findByUid(uid)
                .orElseThrow(() -> new RuntimeException("Inscripción no encontrada"));

        inscripcion.setStatus("cancelada");
        inscripcion.setCancelledAt(LocalDateTime.now());
        inscripcion.setCancelReason(cancelReason);
        inscripcion.setUpdatedAt(LocalDateTime.now());

        claseInscripcionRepository.save(inscripcion);

        // Auto-promocionar al primer usuario en waitlist
        claseWaitlistService.promoverPrimeroEnCola(inscripcion.getClase().getId());
    }

    /**
     * Eliminar inscripción (admin)
     * También promociona waitlist
     */
    @Transactional
    public void eliminarInscripcion(UUID uid) {
        ClaseInscripcion inscripcion = claseInscripcionRepository.findByUid(uid)
                .orElseThrow(() -> new RuntimeException("Inscripción no encontrada"));

        Long claseId = inscripcion.getClase().getId();

        inscripcion.setStatus("eliminado");
        inscripcion.setIsActive(false);
        inscripcion.setUpdatedAt(LocalDateTime.now());

        claseInscripcionRepository.save(inscripcion);

        // Auto-promocionar
        claseWaitlistService.promoverPrimeroEnCola(claseId);
    }

    /**
     * Marcar como asistido
     * Solo se permite si la clase ya empezó (fecha_inicio <= ahora)
     */
    @Transactional
    public void marcarAsistencia(UUID uid, boolean asistio) {
        ClaseInscripcion inscripcion = claseInscripcionRepository.findByUid(uid)
                .orElseThrow(() -> new RuntimeException("Inscripción no encontrada"));

        // VALIDAR QUE LA CLASE YA HAYA EMPEZADO
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime inicioClase = inscripcion.getClase().getFechaHoraInicio();
        
        if (inicioClase.isAfter(ahora)) {
            throw new RuntimeException("No se puede marcar asistencia antes de que empiece la clase");
        }

        inscripcion.setStatus(asistio ? "asistio" : "ausente");
        inscripcion.setUpdatedAt(LocalDateTime.now());

        claseInscripcionRepository.save(inscripcion);
    }

    /**
     * Listar todas las inscripciones confirmadas
     */
    public List<ClaseInscripcionDTO> getAllConfirmadas() {
        return claseInscripcionRepository.findConfirmadas().stream()
                .map(claseInscripcionMapper::toDTO)
                .collect(Collectors.toList());
    }
}
