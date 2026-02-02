package com.emotivapoli.pago.application.service;

import com.emotivapoli.pago.application.mapper.PagoMapper;
import com.emotivapoli.pago.domain.dto.PagoDTO;
import com.emotivapoli.pago.domain.entity.Pago;
import com.emotivapoli.pago.infrastructure.repository.PagoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PagoService {

    @Autowired
    private PagoRepository pagoRepository;

    @Autowired
    private PagoMapper pagoMapper;

    // Listar
    public List<PagoDTO> getAllPagos() {
        return pagoRepository.findAll().stream()
                .map(pagoMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Por ID
    public PagoDTO getPagoById(Long id) {
        Pago pago = pagoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado con ID: " + id));
        return pagoMapper.toDTO(pago);
    }

    // Por usuario
    public List<PagoDTO> getPagosByUsuarioId(Long usuarioId) {
        return pagoRepository.findByUsuarioId(usuarioId).stream()
                .map(pagoMapper::toDTO)
                .collect(Collectors.toList());
    }
}
