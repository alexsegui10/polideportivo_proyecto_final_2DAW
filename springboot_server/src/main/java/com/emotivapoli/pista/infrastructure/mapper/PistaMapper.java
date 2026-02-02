package com.emotivapoli.pista.infrastructure.mapper;

import com.emotivapoli.pista.domain.dto.PistaDTO;
import com.emotivapoli.pista.domain.entity.Pista;
import org.springframework.stereotype.Component;

@Component
public class PistaMapper {

    /**
     * Convierte una Entity a DTO
     */
    public PistaDTO toDTO(Pista entity) {
        if (entity == null) {
            return null;
        }

        return new PistaDTO(
            entity.getId(),
            entity.getNombre(),
            entity.getTipo(),
            entity.getStatus(),
            entity.getIsActive(),
            entity.getSlug(),
            entity.getPrecioHora(),
            entity.getDescripcion(),
            entity.getImagen()
        );
    }

    /**
     * Convierte un DTO a Entity
     */
    public Pista toEntity(PistaDTO dto) {
        if (dto == null) {
            return null;
        }

        return new Pista(
            dto.getId(),
            dto.getNombre(),
            dto.getTipo(),
            dto.getStatus(),
            dto.getIsActive(),
            dto.getSlug(),
            dto.getPrecioHora(),
            dto.getDescripcion(),
            dto.getImagen()
        );
    }
}
