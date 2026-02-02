package com.emotivapoli.pago.presentation.controller;

import com.emotivapoli.pago.application.mapper.PagoMapper;
import com.emotivapoli.pago.application.service.PagoService;
import com.emotivapoli.pago.domain.dto.PagoDTO;
import com.emotivapoli.pago.presentation.schemas.response.PagoResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class PagoController {

    @Autowired
    private PagoService pagoService;

    @Autowired
    private PagoMapper pagoMapper;

    // Listar
    public List<PagoResponse> getAllPagos() {
        return pagoService.getAllPagos().stream()
                .map(pagoMapper::toResponse)
                .collect(Collectors.toList());
    }

    // Por ID
    public PagoResponse getPagoById(Long id) {
        PagoDTO pagoDTO = pagoService.getPagoById(id);
        return pagoMapper.toResponse(pagoDTO);
    }

    // Por usuario
    public List<PagoResponse> getPagosByUsuarioId(Long usuarioId) {
        return pagoService.getPagosByUsuarioId(usuarioId).stream()
                .map(pagoMapper::toResponse)
                .collect(Collectors.toList());
    }
}
