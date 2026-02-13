package com.emotivapoli.pista.presentation.router;

import com.emotivapoli.pista.presentation.controller.PistaController;
import com.emotivapoli.pista.presentation.request.PistaRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

/**
 * Router/Routes para pistas
 * Solo define los endpoints HTTP y delega al controlador
 */
@RestController
@RequestMapping("/api/pistas")
public class PistaRouter {

    private final PistaController pistaController;

    @Autowired
    public PistaRouter(PistaController pistaController) {
        this.pistaController = pistaController;
    }

    /**
     * GET /api/pistas - Obtener todas las pistas
     */
    @GetMapping
    public ResponseEntity<?> getAllPistas() {
        return pistaController.getAllPistas();
    }

    /**
     * GET /api/pistas/search - Búsqueda y filtrado de pistas con paginación
     * Query params:
     * - q: Texto de búsqueda por nombre
     * - tipo: Tipos de deporte separados por coma (ej: padel,tenis,futbol)
     * - precioMax: Precio máximo por hora
     * - page: Número de página (base 1, por defecto 1)
     * - limit: Tamaño de página (por defecto 12, máximo 100)
     * - sort: Ordenamiento (precio_asc, precio_desc, default)
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchPistas(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) BigDecimal precioMax,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int limit,
            @RequestParam(defaultValue = "default") String sort) {
        return pistaController.searchPistas(q, tipo, precioMax, page, limit, sort);
    }

    /**
     * GET /api/pistas/{slug} - Obtener una pista por slug
     */ 
    @GetMapping("/{slug}")
    public ResponseEntity<?> getPista(@PathVariable String slug) {
        return pistaController.getPistaBySlug(slug);
    }

    /**
     * POST /api/pistas - Crear una nueva pista
     */
    @PostMapping
    public ResponseEntity<?> createPista(@RequestBody PistaRequest request) {
        return pistaController.createPista(request);
    }

    /**
     * PUT /api/pistas/{slug} - Actualizar una pista existente
     */
    @PutMapping("/{slug}")
    public ResponseEntity<?> updatePista(@PathVariable String slug, @RequestBody PistaRequest request) {
        return pistaController.updatePistaBySlug(slug, request);
    }

    /**
     * DELETE /api/pistas/{slug} - Eliminar una pista
     */
    @DeleteMapping("/{slug}")
    public ResponseEntity<?> deletePista(@PathVariable String slug) {
        return pistaController.deletePistaBySlug(slug);
    }
}
