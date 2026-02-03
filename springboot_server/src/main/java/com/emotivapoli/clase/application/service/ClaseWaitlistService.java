package com.emotivapoli.clase.application.service;

import com.emotivapoli.clase.application.mapper.ClaseWaitlistMapper;
import com.emotivapoli.clase.domain.dto.ClaseWaitlistDTO;
import com.emotivapoli.clase.domain.entity.ClaseInscripcion;
import com.emotivapoli.clase.domain.entity.ClasePublica;
import com.emotivapoli.clase.domain.entity.ClaseWaitlist;
import com.emotivapoli.clase.infrastructure.repository.ClaseInscripcionRepository;
import com.emotivapoli.clase.infrastructure.repository.ClasePublicaRepository;
import com.emotivapoli.clase.infrastructure.repository.ClaseWaitlistRepository;
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
public class ClaseWaitlistService {

    @Autowired
    private ClaseWaitlistRepository claseWaitlistRepository;

    @Autowired
    private ClasePublicaRepository clasePublicaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ClaseInscripcionRepository claseInscripcionRepository;

    @Autowired
    private ClaseWaitlistMapper claseWaitlistMapper;

    /**
     * Añadir usuario a la lista de espera
     */
    @Transactional
    public ClaseWaitlistDTO agregarAWaitlist(Long claseId, Long usuarioId) {
        ClasePublica clase = clasePublicaRepository.findById(claseId)
                .orElseThrow(() -> new RuntimeException("Clase no encontrada"));

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Validar que no esté ya en waitlist
        claseWaitlistRepository.findByClaseIdAndUsuarioIdEsperando(claseId, usuarioId)
                .ifPresent(w -> {
                    throw new RuntimeException("El usuario ya está en la lista de espera");
                });

        // Validar que no esté inscrito
        claseInscripcionRepository.findByClaseIdAndUsuarioId(claseId, usuarioId)
                .ifPresent(i -> {
                    if (i.getStatus().equals("confirmada")) {
                        throw new RuntimeException("El usuario ya está inscrito en esta clase");
                    }
                });

        // Calcular posición (último + 1)
        Long count = claseWaitlistRepository.countEsperandoByClaseId(claseId);
        int posicion = count.intValue() + 1;

        ClaseWaitlist waitlist = new ClaseWaitlist();
        waitlist.setUid(UUID.randomUUID());
        waitlist.setClase(clase);
        waitlist.setUsuario(usuario);
        waitlist.setPosicion(posicion);
        waitlist.setStatus("esperando");
        waitlist.setIsActive(true);
        waitlist.setFechaRegistro(LocalDateTime.now());
        waitlist.setCreatedAt(LocalDateTime.now());
        waitlist.setUpdatedAt(LocalDateTime.now());

        ClaseWaitlist saved = claseWaitlistRepository.save(waitlist);
        return claseWaitlistMapper.toDTO(saved);
    }

    /**
     * Listar waitlist de una clase ordenada por posición
     */
    public List<ClaseWaitlistDTO> getWaitlistByClaseId(Long claseId) {
        return claseWaitlistRepository.findByClaseIdOrderByPosicion(claseId).stream()
                .map(claseWaitlistMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Listar waitlist del usuario
     */
    public List<ClaseWaitlistDTO> getWaitlistByUsuarioId(Long usuarioId) {
        return claseWaitlistRepository.findByUsuarioIdEsperando(usuarioId).stream()
                .map(claseWaitlistMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtener entrada de waitlist por UID
     */
    public ClaseWaitlistDTO getWaitlistByUid(UUID uid) {
        ClaseWaitlist waitlist = claseWaitlistRepository.findByUid(uid)
                .orElseThrow(() -> new RuntimeException("Entrada de waitlist no encontrada"));
        return claseWaitlistMapper.toDTO(waitlist);
    }

    /**
     * Quitar usuario de la waitlist
     */
    @Transactional
    public void quitarDeWaitlist(UUID uid) {
        ClaseWaitlist waitlist = claseWaitlistRepository.findByUid(uid)
                .orElseThrow(() -> new RuntimeException("Entrada no encontrada"));

        waitlist.setStatus("cancelado");
        waitlist.setIsActive(false);
        waitlist.setUpdatedAt(LocalDateTime.now());

        claseWaitlistRepository.save(waitlist);

        // Reordenar posiciones
        reordenarPosiciones(waitlist.getClase().getId());
    }

    /**
     * Promocionar al primer usuario en waitlist a inscripción
     * Llamado automáticamente cuando se cancela una inscripción
     */
    @Transactional
    public void promoverPrimeroEnCola(Long claseId) {
        try {
            // Verificar que haya espacio
            ClasePublica clase = clasePublicaRepository.findById(claseId)
                    .orElseThrow(() -> new RuntimeException("Clase no encontrada"));

            Long inscritos = claseInscripcionRepository.countInscritosConfirmadosByClaseId(claseId);
            if (inscritos >= clase.getMaxParticipantes()) {
                return; // No hay espacio
            }

            // Obtener el primero en cola
            claseWaitlistRepository.findPrimeroEnCola(claseId).ifPresent(waitlist -> {
                // Crear inscripción automáticamente
                ClaseInscripcion nuevaInscripcion = new ClaseInscripcion();
                nuevaInscripcion.setUid(UUID.randomUUID());
                nuevaInscripcion.setClase(waitlist.getClase());
                nuevaInscripcion.setUsuario(waitlist.getUsuario());
                nuevaInscripcion.setStatus("confirmada");
                nuevaInscripcion.setIsActive(true);
                nuevaInscripcion.setPrecioPagado(clase.getPrecio() != null ? clase.getPrecio() : BigDecimal.ZERO);
                nuevaInscripcion.setFechaInscripcion(LocalDateTime.now());
                nuevaInscripcion.setCreatedAt(LocalDateTime.now());
                nuevaInscripcion.setUpdatedAt(LocalDateTime.now());
                claseInscripcionRepository.save(nuevaInscripcion);
                
                // Marcar waitlist como convertido
                waitlist.setStatus("convertido");
                waitlist.setIsActive(false);
                waitlist.setFechaNotificacion(LocalDateTime.now());
                waitlist.setUpdatedAt(LocalDateTime.now());
                claseWaitlistRepository.save(waitlist);

                // Reordenar posiciones
                reordenarPosiciones(claseId);
            });
        } catch (Exception e) {
            // Si falla la promoción, solo registramos el error pero no lanzamos excepción
            // para que la eliminación de la inscripción original no falle
            System.err.println("Error al promocionar desde waitlist: " + e.getMessage());
        }
    }

    /**
     * Reordenar posiciones en la waitlist después de quitar a alguien
     */
    private void reordenarPosiciones(Long claseId) {
        List<ClaseWaitlist> waitlist = claseWaitlistRepository.findByClaseIdOrderByPosicion(claseId);
        int nuevaPosicion = 1;
        for (ClaseWaitlist w : waitlist) {
            w.setPosicion(nuevaPosicion++);
            w.setUpdatedAt(LocalDateTime.now());
        }
        claseWaitlistRepository.saveAll(waitlist);
    }
}
