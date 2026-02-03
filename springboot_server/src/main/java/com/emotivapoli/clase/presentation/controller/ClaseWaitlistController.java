package com.emotivapoli.clase.presentation.controller;

import com.emotivapoli.clase.application.mapper.ClaseWaitlistMapper;
import com.emotivapoli.clase.application.service.ClaseWaitlistService;
import com.emotivapoli.clase.domain.dto.ClaseWaitlistDTO;
import com.emotivapoli.clase.presentation.schemas.request.ClaseWaitlistCreateRequest;
import com.emotivapoli.clase.presentation.schemas.response.ClaseWaitlistResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class ClaseWaitlistController {

    @Autowired
    private ClaseWaitlistService claseWaitlistService;

    @Autowired
    private ClaseWaitlistMapper claseWaitlistMapper;

    public ClaseWaitlistResponse agregarAWaitlist(ClaseWaitlistCreateRequest request) {
        ClaseWaitlistDTO dto = claseWaitlistService.agregarAWaitlist(
                request.getClaseId(),
                request.getUsuarioId()
        );
        return claseWaitlistMapper.toResponse(dto);
    }

    public List<ClaseWaitlistResponse> getWaitlistByClaseId(Long claseId) {
        return claseWaitlistService.getWaitlistByClaseId(claseId).stream()
                .map(claseWaitlistMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<ClaseWaitlistResponse> getWaitlistByUsuarioId(Long usuarioId) {
        return claseWaitlistService.getWaitlistByUsuarioId(usuarioId).stream()
                .map(claseWaitlistMapper::toResponse)
                .collect(Collectors.toList());
    }

    public ClaseWaitlistResponse getWaitlistByUid(String uid) {
        ClaseWaitlistDTO dto = claseWaitlistService.getWaitlistByUid(UUID.fromString(uid));
        return claseWaitlistMapper.toResponse(dto);
    }

    public void quitarDeWaitlist(String uid) {
        claseWaitlistService.quitarDeWaitlist(UUID.fromString(uid));
    }

    public void promoverPrimeroEnCola(Long claseId) {
        claseWaitlistService.promoverPrimeroEnCola(claseId);
    }
}
