package com.emotivapoli.clase.presentation.controller;

import com.emotivapoli.clase.application.mapper.ClaseInscripcionMapper;
import com.emotivapoli.clase.application.service.ClaseInscripcionService;
import com.emotivapoli.clase.domain.dto.ClaseInscripcionDTO;
import com.emotivapoli.clase.presentation.schemas.request.ClaseInscripcionCreateRequest;
import com.emotivapoli.clase.presentation.schemas.response.ClaseInscripcionResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class ClaseInscripcionController {

    @Autowired
    private ClaseInscripcionService claseInscripcionService;

    @Autowired
    private ClaseInscripcionMapper claseInscripcionMapper;

    public ClaseInscripcionResponse inscribirUsuario(ClaseInscripcionCreateRequest request) {
        ClaseInscripcionDTO dto = claseInscripcionService.inscribirUsuario(
                request.getClaseId(),
                request.getUsuarioId(),
                request.getPrecioPagado(),
                request.getMetodoPago()
        );
        return claseInscripcionMapper.toResponse(dto);
    }

    public List<ClaseInscripcionResponse> getInscritosByClaseId(Long claseId) {
        return claseInscripcionService.getInscritosByClaseId(claseId).stream()
                .map(claseInscripcionMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<ClaseInscripcionResponse> getClasesByUsuarioId(Long usuarioId) {
        return claseInscripcionService.getClasesByUsuarioId(usuarioId).stream()
                .map(claseInscripcionMapper::toResponse)
                .collect(Collectors.toList());
    }

    public ClaseInscripcionResponse getInscripcionByUid(String uid) {
        ClaseInscripcionDTO dto = claseInscripcionService.getInscripcionByUid(UUID.fromString(uid));
        return claseInscripcionMapper.toResponse(dto);
    }

    public void cancelarInscripcion(String uid, String cancelReason) {
        claseInscripcionService.cancelarInscripcion(UUID.fromString(uid), cancelReason);
    }

    public void eliminarInscripcion(String uid) {
        claseInscripcionService.eliminarInscripcion(UUID.fromString(uid));
    }

    public void marcarAsistencia(String uid, boolean asistio) {
        claseInscripcionService.marcarAsistencia(UUID.fromString(uid), asistio);
    }

    public List<ClaseInscripcionResponse> getAllConfirmadas() {
        return claseInscripcionService.getAllConfirmadas().stream()
                .map(claseInscripcionMapper::toResponse)
                .collect(Collectors.toList());
    }
}
