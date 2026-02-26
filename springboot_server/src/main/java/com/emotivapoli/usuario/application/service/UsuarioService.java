package com.emotivapoli.usuario.application.service;

import com.emotivapoli.usuario.domain.dto.UsuarioDTO;
import com.emotivapoli.usuario.domain.entity.Usuario;
import com.emotivapoli.usuario.infrastructure.mapper.UsuarioMapper;
import com.emotivapoli.usuario.infrastructure.repository.UsuarioRepository;
import com.emotivapoli.utils.SlugUtils;
import com.emotivapoli.exception.DuplicateResourceException;
import com.emotivapoli.exception.ResourceNotFoundException;
import com.emotivapoli.exception.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioMapper usuarioMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Listar activos
    public List<UsuarioDTO> getAllUsuarios() {
        return usuarioRepository.findAll().stream()
                .filter(u -> !"eliminado".equals(u.getStatus()))
                .map(usuarioMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Por ID
    public UsuarioDTO getUsuarioById(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));
        return usuarioMapper.toDTO(usuario);
    }

    /**
     * Obtener usuario por slug
     */
    public UsuarioDTO getUsuarioBySlug(String slug) {
        Usuario usuario = usuarioRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con slug: " + slug));
        return usuarioMapper.toDTO(usuario);
    }

    /**
     * Obtener usuario por email
     */
    public UsuarioDTO getUsuarioByEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con email: " + email));
        return usuarioMapper.toDTO(usuario);
    }

    // Por role
    public List<UsuarioDTO> getUsuariosByRole(String role) {
        return usuarioRepository.findByRole(role).stream()
                .filter(u -> !"eliminado".equals(u.getStatus()))
                .map(usuarioMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Crear
    public UsuarioDTO createUsuario(UsuarioDTO usuarioDTO, String passwordHash) {
        // Validar campos obligatorios
        if (usuarioDTO.getNombre() == null || usuarioDTO.getNombre().trim().isEmpty()) {
            throw new ValidationException("El nombre es obligatorio");
        }
        if (usuarioDTO.getEmail() == null || usuarioDTO.getEmail().trim().isEmpty()) {
            throw new ValidationException("El email es obligatorio");
        }
        if (passwordHash == null || passwordHash.trim().isEmpty()) {
            throw new ValidationException("La contraseña es obligatoria");
        }
        if (usuarioDTO.getRole() == null || usuarioDTO.getRole().trim().isEmpty()) {
            throw new ValidationException("El rol es obligatorio");
        }

        // Generar slug con 4 números aleatorios
        String apellidos = usuarioDTO.getApellidos() != null ? usuarioDTO.getApellidos() : "";
        String slug = SlugUtils.generateSlug(usuarioDTO.getNombre(), apellidos);
        
        // Verificar que el email no existe EN USUARIOS NO ELIMINADOS
        usuarioRepository.findByEmail(usuarioDTO.getEmail())
                .filter(u -> !"eliminado".equals(u.getStatus()))
                .ifPresent(u -> {
                    throw new DuplicateResourceException("Ya existe un usuario con el email: " + usuarioDTO.getEmail());
                });

        Usuario usuario = usuarioMapper.toEntity(usuarioDTO);
        usuario.setUid(UUID.randomUUID());
        usuario.setSlug(slug);
        usuario.setPasswordHash(passwordHash);
        usuario.setIsActive(true);
        usuario.setCreatedAt(LocalDateTime.now());
        usuario.setUpdatedAt(LocalDateTime.now());

        Usuario savedUsuario = usuarioRepository.save(usuario);
        return usuarioMapper.toDTO(savedUsuario);
    }
    
    // Actualizar
    public UsuarioDTO updateUsuario(Long id, UsuarioDTO usuarioDTO) {
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));

        // Verificar email único si se está cambiando
        if (usuarioDTO.getEmail() != null && !usuarioDTO.getEmail().equals(usuarioExistente.getEmail())) {
            if (usuarioRepository.existsByEmail(usuarioDTO.getEmail())) {
                throw new DuplicateResourceException("Ya existe un usuario con el email: " + usuarioDTO.getEmail());
            }
            usuarioExistente.setEmail(usuarioDTO.getEmail());
        }

        // Verificar DNI único si se está cambiando
        if (usuarioDTO.getDni() != null && !usuarioDTO.getDni().equals(usuarioExistente.getDni())) {
            if (usuarioRepository.existsByDni(usuarioDTO.getDni())) {
                throw new DuplicateResourceException("Ya existe un usuario con el DNI: " + usuarioDTO.getDni());
            }
            usuarioExistente.setDni(usuarioDTO.getDni());
        }

        // Actualizar campos
        if (usuarioDTO.getNombre() != null) usuarioExistente.setNombre(usuarioDTO.getNombre());
        if (usuarioDTO.getApellidos() != null) usuarioExistente.setApellidos(usuarioDTO.getApellidos());
        if (usuarioDTO.getTelefono() != null) usuarioExistente.setTelefono(usuarioDTO.getTelefono());
        if (usuarioDTO.getFechaNacimiento() != null) usuarioExistente.setFechaNacimiento(usuarioDTO.getFechaNacimiento());
        if (usuarioDTO.getAvatar() != null) usuarioExistente.setAvatar(usuarioDTO.getAvatar());
        if (usuarioDTO.getRole() != null) usuarioExistente.setRole(usuarioDTO.getRole());
        if (usuarioDTO.getStatus() != null) usuarioExistente.setStatus(usuarioDTO.getStatus());
        if (usuarioDTO.getIsActive() != null) usuarioExistente.setIsActive(usuarioDTO.getIsActive());
        if (usuarioDTO.getEspecialidad() != null) usuarioExistente.setEspecialidad(usuarioDTO.getEspecialidad());
        if (usuarioDTO.getCertificaciones() != null) usuarioExistente.setCertificaciones(usuarioDTO.getCertificaciones());
        if (usuarioDTO.getBio() != null) usuarioExistente.setBio(usuarioDTO.getBio());
        if (usuarioDTO.getDireccion() != null) usuarioExistente.setDireccion(usuarioDTO.getDireccion());
        if (usuarioDTO.getCiudad() != null) usuarioExistente.setCiudad(usuarioDTO.getCiudad());
        if (usuarioDTO.getCodigoPostal() != null) usuarioExistente.setCodigoPostal(usuarioDTO.getCodigoPostal());

        usuarioExistente.setUpdatedAt(LocalDateTime.now());

        Usuario usuarioActualizado = usuarioRepository.save(usuarioExistente);
        return usuarioMapper.toDTO(usuarioActualizado);
    }

    /**
     * Cambiar contraseña verificando la actual.
     * Solo el propio usuario puede llamar a este método (verificación en el controller).
     */
    public void changePassword(Long id, String currentPassword, String newPassword) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));

        // Verificar que la contraseña actual es correcta
        if (!passwordEncoder.matches(currentPassword, usuario.getPasswordHash())) {
            throw new AccessDeniedException("La contraseña actual es incorrecta");
        }

        // Codificar y guardar la nueva contraseña
        usuario.setPasswordHash(passwordEncoder.encode(newPassword));
        usuario.setUpdatedAt(LocalDateTime.now());
        usuarioRepository.save(usuario);
    }

    /**
     * Eliminar usuario (soft delete)
     */
    public void deleteUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));

        usuario.setStatus("eliminado");
        usuario.setIsActive(false);
        usuario.setUpdatedAt(LocalDateTime.now());

        usuarioRepository.save(usuario);
    }

    /**
     * Actualizar último login
     */
    public void updateLastLogin(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

        usuario.setLastLogin(LocalDateTime.now());
        usuario.setUpdatedAt(LocalDateTime.now());

        usuarioRepository.save(usuario);
    }
}
