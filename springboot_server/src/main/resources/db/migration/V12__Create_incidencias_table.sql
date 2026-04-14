-- V12: Tabla de incidencias (MVP)
CREATE TABLE IF NOT EXISTS incidencias (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    titulo VARCHAR(120) NOT NULL,
    descripcion TEXT NOT NULL,
    tipo VARCHAR(50) NOT NULL DEFAULT 'general' CHECK (tipo IN ('general', 'reserva', 'pista', 'pago', 'web')),
    prioridad VARCHAR(20) NOT NULL DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta')),
    estado VARCHAR(20) NOT NULL DEFAULT 'abierta' CHECK (estado IN ('abierta', 'en_proceso', 'resuelta', 'cerrada')),
    pagina VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_incidencias_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_incidencias_usuario ON incidencias(usuario_id);
CREATE INDEX IF NOT EXISTS idx_incidencias_estado ON incidencias(estado);
CREATE INDEX IF NOT EXISTS idx_incidencias_created_at ON incidencias(created_at DESC);
