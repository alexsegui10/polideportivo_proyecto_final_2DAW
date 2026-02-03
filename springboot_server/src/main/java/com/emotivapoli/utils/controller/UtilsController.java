package com.emotivapoli.utils.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador para utilidades generales del sistema
 */
@RestController
@RequestMapping("/api/utils")
@CrossOrigin(origins = "*")
public class UtilsController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Ejecuta las funciones SQL que actualizan automáticamente
     * los estados de clases y reservas basándose en fecha/hora actual
     */
    @PostMapping("/actualizar-estados")
    public ResponseEntity<String> actualizarEstados() {
        try {
            // Ejecutar función para actualizar clases
            jdbcTemplate.execute("SELECT actualizar_estado_clases()");
            
            // Ejecutar función para actualizar reservas
            jdbcTemplate.execute("SELECT actualizar_estado_reservas()");
            
            return ResponseEntity.ok("Estados actualizados correctamente");
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Error al actualizar estados: " + e.getMessage());
        }
    }
}
