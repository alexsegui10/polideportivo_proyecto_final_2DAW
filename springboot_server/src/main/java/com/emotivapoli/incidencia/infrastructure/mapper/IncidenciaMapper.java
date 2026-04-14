package com.emotivapoli.incidencia.infrastructure.mapper;

import com.emotivapoli.incidencia.domain.dto.IncidenciaDTO;
import com.emotivapoli.incidencia.domain.entity.Incidencia;
import org.springframework.stereotype.Component;

@Component
public class IncidenciaMapper {

    public IncidenciaDTO toDTO(Incidencia entity) {
        if (entity == null) return null;

        IncidenciaDTO dto = new IncidenciaDTO();
        dto.setId(entity.getId());
        dto.setUsuarioId(entity.getUsuario() != null ? entity.getUsuario().getId() : null);
        if (entity.getUsuario() != null) {
            String nombre = entity.getUsuario().getNombre() != null ? entity.getUsuario().getNombre() : "";
            String apellidos = entity.getUsuario().getApellidos() != null ? entity.getUsuario().getApellidos() : "";
            dto.setUsuarioNombre((nombre + " " + apellidos).trim());
        }
        dto.setTitulo(entity.getTitulo());
        dto.setDescripcion(entity.getDescripcion());
        dto.setTipo(entity.getTipo());
        dto.setPrioridad(entity.getPrioridad());
        dto.setEstado(entity.getEstado());
        dto.setPagina(entity.getPagina());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }
}
