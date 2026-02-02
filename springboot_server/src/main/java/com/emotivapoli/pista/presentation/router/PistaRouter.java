package com.emotivapoli.pista.presentation.router;

import com.emotivapoli.pista.presentation.controller.PistaController;
import com.emotivapoli.pista.presentation.request.PistaRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
