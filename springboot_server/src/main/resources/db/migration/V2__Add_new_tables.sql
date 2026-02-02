-- ============================================
-- MIGRACIÓN V2: Nuevas Tablas del Sistema
-- ============================================
-- Añade 4 nuevas tablas para funcionalidades críticas:
-- 1. eventos_pista: Control de solapes y ocupación
-- 2. pagos: Trazabilidad completa de transacciones
-- 3. club_suscripciones: Cobros recurrentes mensuales
-- 4. clase_waitlist: Listas de espera con gestión de aforo
-- ============================================

-- ============================================
-- TABLA 8: EVENTOS_PISTA (Control de Solapes)
-- ============================================
CREATE TABLE eventos_pista (
    id BIGSERIAL PRIMARY KEY,
    uid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    pista_id BIGINT NOT NULL,
    tipo_evento VARCHAR(50) NOT NULL CHECK (tipo_evento IN ('reserva', 'clase', 'mantenimiento', 'bloqueo')),
    reserva_id BIGINT,
    clase_publica_id BIGINT,
    fecha_hora_inicio TIMESTAMP NOT NULL,
    fecha_hora_fin TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'confirmado' CHECK (status IN ('confirmado', 'cancelado', 'eliminado')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Validaciones de fechas
    CONSTRAINT chk_eventos_pista_fechas CHECK (fecha_hora_inicio < fecha_hora_fin),
    
    -- Validación de exclusividad según tipo_evento
    CONSTRAINT chk_eventos_pista_exclusividad CHECK (
        (tipo_evento = 'reserva' AND reserva_id IS NOT NULL AND clase_publica_id IS NULL) OR
        (tipo_evento = 'clase' AND clase_publica_id IS NOT NULL AND reserva_id IS NULL) OR
        (tipo_evento IN ('mantenimiento', 'bloqueo') AND reserva_id IS NULL AND clase_publica_id IS NULL)
    ),
    
    -- Foreign Keys con CASCADE para evitar conflictos con CHECK
    CONSTRAINT fk_eventos_pista_pista FOREIGN KEY (pista_id) REFERENCES pistas(id) ON DELETE CASCADE,
    CONSTRAINT fk_eventos_pista_reserva FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE,
    CONSTRAINT fk_eventos_pista_clase FOREIGN KEY (clase_publica_id) REFERENCES clases_publicas(id) ON DELETE CASCADE
);

-- Índices para eventos_pista (críticos para rendimiento de detección de solapes)
CREATE INDEX idx_eventos_pista_pista ON eventos_pista(pista_id);
CREATE INDEX idx_eventos_pista_fecha_inicio ON eventos_pista(fecha_hora_inicio);
CREATE INDEX idx_eventos_pista_fecha_fin ON eventos_pista(fecha_hora_fin);
CREATE INDEX idx_eventos_pista_rango ON eventos_pista(pista_id, fecha_hora_inicio, fecha_hora_fin);
CREATE INDEX idx_eventos_pista_solapes ON eventos_pista(pista_id, status, is_active, fecha_hora_inicio, fecha_hora_fin);

COMMENT ON TABLE eventos_pista IS 'Control centralizado de ocupación de pistas para evitar solapes';
COMMENT ON COLUMN eventos_pista.tipo_evento IS 'Tipo: reserva (FK a reservas), clase (FK a clases_publicas), mantenimiento, bloqueo';
COMMENT ON CONSTRAINT chk_eventos_pista_exclusividad ON eventos_pista IS 'Garantiza que solo un FK esté activo según tipo_evento';

-- ============================================
-- TABLA 9: CLUB_SUSCRIPCIONES (Cobros Recurrentes)
-- ============================================
-- NOTA: Se crea ANTES que pagos para resolver dependencia circular
CREATE TABLE club_suscripciones (
    id BIGSERIAL PRIMARY KEY,
    uid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    club_miembro_id BIGINT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    precio_mensual DECIMAL(10,2) NOT NULL CHECK (precio_mensual >= 0),
    status VARCHAR(50) NOT NULL DEFAULT 'activa' CHECK (status IN ('activa', 'pausada', 'cancelada', 'vencida', 'impago')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    proximo_cobro DATE NOT NULL,
    intentos_cobro INTEGER DEFAULT 0 CHECK (intentos_cobro >= 0),
    ultimo_pago_id BIGINT,  -- FK añadida después de crear pagos
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys (ultimo_pago_id se añade después con ALTER TABLE)
    CONSTRAINT fk_club_suscripciones_club_miembro FOREIGN KEY (club_miembro_id) REFERENCES club_miembros(id) ON DELETE CASCADE
);

-- Índices para club_suscripciones
CREATE INDEX idx_club_suscripciones_miembro ON club_suscripciones(club_miembro_id);
CREATE INDEX idx_club_suscripciones_proximo_cobro ON club_suscripciones(proximo_cobro);
CREATE INDEX idx_club_suscripciones_status ON club_suscripciones(status);

COMMENT ON TABLE club_suscripciones IS 'Gestión de suscripciones mensuales recurrentes para membresías de clubs';
COMMENT ON COLUMN club_suscripciones.proximo_cobro IS 'Fecha del próximo intento de cobro automático (cron job diario)';
COMMENT ON COLUMN club_suscripciones.intentos_cobro IS 'Contador de intentos fallidos. Si > 3, cambiar status a impago';

-- ============================================
-- TABLA 10: PAGOS (Trazabilidad de Transacciones)
-- ============================================
CREATE TABLE pagos (
    id BIGSERIAL PRIMARY KEY,
    uid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    usuario_id BIGINT NOT NULL,
    reserva_id BIGINT,
    clase_inscripcion_id BIGINT,
    club_suscripcion_id BIGINT,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
    provider VARCHAR(50) CHECK (provider IN ('stripe', 'paypal', 'efectivo', 'transferencia')),
    provider_payment_id VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'completado', 'fallido', 'reembolsado')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Validación: exactamente uno de los 3 FKs debe estar lleno
    CONSTRAINT chk_pagos_exclusividad CHECK (
        (reserva_id IS NOT NULL AND clase_inscripcion_id IS NULL AND club_suscripcion_id IS NULL) OR
        (reserva_id IS NULL AND clase_inscripcion_id IS NOT NULL AND club_suscripcion_id IS NULL) OR
        (reserva_id IS NULL AND clase_inscripcion_id IS NULL AND club_suscripcion_id IS NOT NULL)
    ),
    
    -- Foreign Keys (SET NULL en origen porque el pago debe persistir para auditoría)
    CONSTRAINT fk_pagos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_pagos_reserva FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE SET NULL,
    CONSTRAINT fk_pagos_clase_inscripcion FOREIGN KEY (clase_inscripcion_id) REFERENCES clase_inscripciones(id) ON DELETE SET NULL,
    CONSTRAINT fk_pagos_club_suscripcion FOREIGN KEY (club_suscripcion_id) REFERENCES club_suscripciones(id) ON DELETE SET NULL
);

-- Índices para pagos
CREATE INDEX idx_pagos_usuario ON pagos(usuario_id);
CREATE INDEX idx_pagos_reserva ON pagos(reserva_id);
CREATE INDEX idx_pagos_clase_inscripcion ON pagos(clase_inscripcion_id);
CREATE INDEX idx_pagos_club_suscripcion ON pagos(club_suscripcion_id);
CREATE INDEX idx_pagos_status ON pagos(status);
CREATE INDEX idx_pagos_usuario_status ON pagos(usuario_id, status);

COMMENT ON TABLE pagos IS 'Trazabilidad completa de todos los pagos con FKs directas a reserva, inscripción o suscripción';
COMMENT ON CONSTRAINT chk_pagos_exclusividad ON pagos IS 'Garantiza que el pago esté asociado a exactamente una fuente';

-- ============================================
-- Añadir FK de club_suscripciones -> pagos
-- ============================================
-- Ahora que pagos existe, podemos añadir la FK circular
ALTER TABLE club_suscripciones 
ADD CONSTRAINT fk_club_suscripciones_ultimo_pago 
FOREIGN KEY (ultimo_pago_id) REFERENCES pagos(id) ON DELETE SET NULL;

-- ============================================
-- TABLA 11: CLASE_WAITLIST (Listas de Espera)
-- ============================================
CREATE TABLE clase_waitlist (
    id BIGSERIAL PRIMARY KEY,
    uid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    clase_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    posicion INTEGER NOT NULL CHECK (posicion > 0),
    status VARCHAR(50) NOT NULL DEFAULT 'esperando' CHECK (status IN ('esperando', 'notificado', 'convertido', 'cancelado', 'expirado')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_notificacion TIMESTAMP,
    fecha_expiracion TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraint: un usuario solo puede estar una vez en la lista de espera de una clase
    CONSTRAINT uk_clase_waitlist_clase_usuario UNIQUE(clase_id, usuario_id),
    
    -- Foreign Keys
    CONSTRAINT fk_clase_waitlist_clase FOREIGN KEY (clase_id) REFERENCES clases_publicas(id) ON DELETE CASCADE,
    CONSTRAINT fk_clase_waitlist_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Índices para clase_waitlist
CREATE INDEX idx_clase_waitlist_clase ON clase_waitlist(clase_id);
CREATE INDEX idx_clase_waitlist_usuario ON clase_waitlist(usuario_id);
CREATE INDEX idx_clase_waitlist_posicion ON clase_waitlist(clase_id, posicion);

COMMENT ON TABLE clase_waitlist IS 'Lista de espera ordenada por posición cuando las clases alcanzan max_participantes';
COMMENT ON COLUMN clase_waitlist.posicion IS 'Orden en la cola (1 = primero). Al cancelar inscripción, notificar posición 1';
COMMENT ON COLUMN clase_waitlist.fecha_expiracion IS 'Límite para aceptar plaza (ej: +24h desde notificación). Si expira, pasar al siguiente';
