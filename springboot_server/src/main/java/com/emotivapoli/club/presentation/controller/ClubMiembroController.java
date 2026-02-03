package com.emotivapoli.club.presentation.controller;

import com.emotivapoli.club.application.mapper.ClubMiembroMapper;
import com.emotivapoli.club.application.service.ClubMiembroService;
import com.emotivapoli.club.domain.dto.ClubMiembroDTO;
import com.emotivapoli.club.presentation.schemas.request.ClubMiembroCreateRequest;
import com.emotivapoli.club.presentation.schemas.response.ClubMiembroResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Controlador para gestión de miembros de club
 * Lógica de presentación: validación de requests y mapeo a responses
 */
@Component
public class ClubMiembroController {

    @Autowired
    private ClubMiembroService clubMiembroService;

    @Autowired
    private ClubMiembroMapper clubMiembroMapper;

    /**
     * Inscribir usuario a un club
     */
    public ClubMiembroResponse inscribirMiembro(ClubMiembroCreateRequest request) {
        ClubMiembroDTO dto = clubMiembroService.inscribirMiembro(request.getClubId(), request.getUsuarioId());
        return clubMiembroMapper.toResponse(dto);
    }

    /**
     * Listar miembros activos de un club
     */
    public List<ClubMiembroResponse> getMiembrosByClubId(Long clubId) {
        return clubMiembroService.getMiembrosByClubId(clubId).stream()
                .map(clubMiembroMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Listar clubes donde el usuario es miembro
     */
    public List<ClubMiembroResponse> getClubsByUsuarioId(Long usuarioId) {
        return clubMiembroService.getClubsByUsuarioId(usuarioId).stream()
                .map(clubMiembroMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener miembro por UID
     */
    public ClubMiembroResponse getMiembroByUid(String uid) {
        ClubMiembroDTO dto = clubMiembroService.getMiembroByUid(UUID.fromString(uid));
        return clubMiembroMapper.toResponse(dto);
    }

    /**
     * Dar de baja a un miembro
     */
    public void darDeBajaMiembro(String uid) {
        clubMiembroService.darDeBajaMiembro(UUID.fromString(uid));
    }

    /**
     * Expulsar miembro del club
     */
    public void expulsarMiembro(String uid) {
        clubMiembroService.expulsarMiembro(UUID.fromString(uid));
    }

    /**
     * Reactivar miembro
     */
    public ClubMiembroResponse reactivarMiembro(String uid) {
        ClubMiembroDTO dto = clubMiembroService.reactivarMiembro(UUID.fromString(uid));
        return clubMiembroMapper.toResponse(dto);
    }

    /**
     * Listar todos los miembros activos
     */
    public List<ClubMiembroResponse> getAllMiembrosActivos() {
        return clubMiembroService.getAllMiembrosActivos().stream()
                .map(clubMiembroMapper::toResponse)
                .collect(Collectors.toList());
    }
}
