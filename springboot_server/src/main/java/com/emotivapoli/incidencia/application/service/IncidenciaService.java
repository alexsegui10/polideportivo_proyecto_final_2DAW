package com.emotivapoli.incidencia.application.service;

import com.emotivapoli.exception.ResourceNotFoundException;
import com.emotivapoli.exception.ValidationException;
import com.emotivapoli.incidencia.domain.dto.IncidenciaDTO;
import com.emotivapoli.incidencia.domain.entity.Incidencia;
import com.emotivapoli.incidencia.infrastructure.mapper.IncidenciaMapper;
import com.emotivapoli.incidencia.infrastructure.repository.IncidenciaRepository;
import com.emotivapoli.usuario.domain.entity.Usuario;
import com.emotivapoli.usuario.infrastructure.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class IncidenciaService {

    private static final Set<String> TIPOS = Set.of("general", "reserva", "pista", "pago", "web");
    private static final Set<String> PRIORIDADES = Set.of("baja", "media", "alta");
    private static final Set<String> ESTADOS = Set.of("abierta", "en_proceso", "resuelta", "cerrada");

    @Autowired
    private IncidenciaRepository incidenciaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private IncidenciaMapper incidenciaMapper;

    public IncidenciaDTO createIncidencia(Long usuarioId, String titulo, String descripcion, String tipo, String prioridad, String pagina) {
        if (titulo == null || titulo.trim().isEmpty()) {
            throw new ValidationException("El titulo es obligatorio");
        }
        if (descripcion == null || descripcion.trim().isEmpty()) {
            throw new ValidationException("La descripcion es obligatoria");
        }

        String tipoNorm = (tipo == null || tipo.isBlank()) ? "general" : tipo.toLowerCase().trim();
        String prioridadNorm = (prioridad == null || prioridad.isBlank()) ? "media" : prioridad.toLowerCase().trim();

        if (!TIPOS.contains(tipoNorm)) {
            throw new ValidationException("Tipo de incidencia no valido");
        }
        if (!PRIORIDADES.contains(prioridadNorm)) {
            throw new ValidationException("Prioridad no valida");
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        Incidencia incidencia = new Incidencia();
        incidencia.setUsuario(usuario);
        incidencia.setTitulo(titulo.trim());
        incidencia.setDescripcion(descripcion.trim());
        incidencia.setTipo(tipoNorm);
        incidencia.setPrioridad(prioridadNorm);
        incidencia.setEstado("abierta");
        incidencia.setPagina((pagina == null || pagina.isBlank()) ? null : pagina.trim());

        return incidenciaMapper.toDTO(incidenciaRepository.save(incidencia));
    }

    public List<IncidenciaDTO> getMisIncidencias(Long usuarioId) {
        return incidenciaRepository.findByUsuario_IdOrderByCreatedAtDesc(usuarioId)
                .stream()
                .map(incidenciaMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<IncidenciaDTO> getIncidenciasAdmin(String estado) {
        if (estado != null && !estado.isBlank()) {
            String estadoNorm = estado.toLowerCase().trim();
            if (!ESTADOS.contains(estadoNorm)) {
                throw new ValidationException("Estado no valido");
            }
            return incidenciaRepository.findByEstadoOrderByCreatedAtDesc(estadoNorm)
                    .stream()
                    .map(incidenciaMapper::toDTO)
                    .collect(Collectors.toList());
        }

        return incidenciaRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(incidenciaMapper::toDTO)
                .collect(Collectors.toList());
    }

    public IncidenciaDTO updateEstado(Long incidenciaId, String nuevoEstado) {
        if (nuevoEstado == null || nuevoEstado.isBlank()) {
            throw new ValidationException("El estado es obligatorio");
        }

        String estadoNorm = nuevoEstado.toLowerCase().trim();
        if (!ESTADOS.contains(estadoNorm)) {
            throw new ValidationException("Estado no valido");
        }

        Incidencia incidencia = incidenciaRepository.findById(incidenciaId)
                .orElseThrow(() -> new ResourceNotFoundException("Incidencia no encontrada"));

        incidencia.setEstado(estadoNorm);
        return incidenciaMapper.toDTO(incidenciaRepository.save(incidencia));
    }
}
