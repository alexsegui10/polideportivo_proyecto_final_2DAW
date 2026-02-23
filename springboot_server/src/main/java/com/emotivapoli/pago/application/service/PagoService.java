package com.emotivapoli.pago.application.service;

import com.emotivapoli.pago.application.mapper.PagoMapper;
import com.emotivapoli.pago.domain.dto.PagoDTO;
import com.emotivapoli.pago.domain.entity.Pago;
import com.emotivapoli.pago.infrastructure.repository.PagoRepository;
import com.emotivapoli.usuario.domain.entity.Usuario;
import com.emotivapoli.usuario.infrastructure.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PagoService {

    @Autowired
    private PagoRepository pagoRepository;

    @Autowired
    private PagoMapper pagoMapper;

    @Autowired
    private UsuarioRepository usuarioRepository;

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

    // Mis pagos (usuario autenticado desde JWT)
    public List<PagoDTO> getMisPagos() {
        // Obtener email del usuario autenticado desde SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        // Buscar usuario por email
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con email: " + email));
        
        // Obtener pagos del usuario
        return pagoRepository.findByUsuarioId(usuario.getId()).stream()
                .map(pagoMapper::toDTO)
                .collect(Collectors.toList());
    }
}
