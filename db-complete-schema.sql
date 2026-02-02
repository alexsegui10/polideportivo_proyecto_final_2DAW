-- ============================================
-- SCHEMA COMPLETO - Emotiva Poli
-- Sistema de Gestión de Polideportivo
-- ============================================
-- Este script crea TODA la base de datos desde cero
-- Incluye: 11 tablas, 21 FKs, 33 índices, CHECK constraints
-- ============================================

-- Limpiar schema existente (CUIDADO: borra todos los datos)
DROP TABLE IF EXISTS clase_waitlist CASCADE;
DROP TABLE IF EXISTS club_suscripciones CASCADE;
DROP TABLE IF EXISTS pagos CASCADE;
DROP TABLE IF EXISTS eventos_pista CASCADE;
DROP TABLE IF EXISTS clase_inscripciones CASCADE;
DROP TABLE IF EXISTS club_miembros CASCADE;
DROP TABLE IF EXISTS reservas CASCADE;
DROP TABLE IF EXISTS clases_publicas CASCADE;
DROP TABLE IF EXISTS clubs CASCADE;
DROP TABLE IF EXISTS pistas CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- ============================================
-- TABLA 1: USUARIOS
-- ============================================
CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    uid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(150),
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    dni VARCHAR(20) UNIQUE,
    fecha_nacimiento DATE,
    avatar TEXT,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'cliente' CHECK (role IN ('admin', 'cliente', 'entrenador')),
    status VARCHAR(50) NOT NULL DEFAULT 'activo' CHECK (status IN ('activo', 'inactivo', 'suspendido', 'eliminado')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    especialidad VARCHAR(100),
    certificaciones TEXT,
    bio TEXT,
    direccion TEXT,
    ciudad VARCHAR(100),
    codigo_postal VARCHAR(10),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_role ON usuarios(role);
CREATE INDEX idx_usuarios_status ON usuarios(status);

-- ============================================
-- TABLA 2: PISTAS
-- ============================================
CREATE TABLE pistas (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('padel', 'tenis', 'futbol-sala', 'baloncesto')),
    status VARCHAR(50) NOT NULL DEFAULT 'disponible' CHECK (status IN ('disponible', 'mantenimiento', 'eliminado')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    slug VARCHAR(255) UNIQUE NOT NULL,
    precio_hora DECIMAL(10,2) NOT NULL CHECK (precio_hora >= 0),
    descripcion TEXT,
    imagen TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pistas_status ON pistas(status);

COMMENT ON COLUMN pistas.status IS 'disponible, mantenimiento, eliminado (NO ocupada - se calcula desde eventos_pista)';

-- ============================================
-- TABLA 3: CLUBS
-- ============================================
CREATE TABLE clubs (
    id BIGSERIAL PRIMARY KEY,
    uid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    deporte VARCHAR(100),
    imagen TEXT,
    entrenador_id BIGINT,
    max_miembros INTEGER NOT NULL DEFAULT 20 CHECK (max_miembros > 0),
    nivel VARCHAR(50) CHECK (nivel IN ('principiante', 'intermedio', 'avanzado')),
    precio_mensual DECIMAL(10,2) NOT NULL CHECK (precio_mensual >= 0),
    status VARCHAR(50) NOT NULL DEFAULT 'activo' CHECK (status IN ('activo', 'inactivo', 'completo', 'eliminado')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_clubs_entrenador FOREIGN KEY (entrenador_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE INDEX idx_clubs_entrenador ON clubs(entrenador_id);

-- ============================================
-- TABLA 4: CLASES PÚBLICAS
-- ============================================
CREATE TABLE clases_publicas (
    id BIGSERIAL PRIMARY KEY,
    uid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    imagen TEXT,
    entrenador_id BIGINT,
    pista_id BIGINT,
    fecha_hora_inicio TIMESTAMP NOT NULL,
    fecha_hora_fin TIMESTAMP NOT NULL,
    duracion_minutos INTEGER NOT NULL CHECK (duracion_minutos > 0),
    max_participantes INTEGER NOT NULL DEFAULT 15 CHECK (max_participantes > 0),
    precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
    nivel VARCHAR(50) CHECK (nivel IN ('principiante', 'intermedio', 'avanzado')),
    deporte VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'programada' CHECK (status IN ('programada', 'en_curso', 'finalizada', 'cancelada', 'eliminado')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_clases_publicas_fechas CHECK (fecha_hora_inicio < fecha_hora_fin),
    CONSTRAINT fk_clases_publicas_entrenador FOREIGN KEY (entrenador_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    CONSTRAINT fk_clases_publicas_pista FOREIGN KEY (pista_id) REFERENCES pistas(id) ON DELETE SET NULL
);

CREATE INDEX idx_clases_entrenador ON clases_publicas(entrenador_id);
CREATE INDEX idx_clases_pista ON clases_publicas(pista_id);

-- ============================================
-- TABLA 5: RESERVAS
-- ============================================
CREATE TABLE reservas (
    id BIGSERIAL PRIMARY KEY,
    uid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    pista_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    club_id BIGINT,
    fecha_hora_inicio TIMESTAMP NOT NULL,
    fecha_hora_fin TIMESTAMP NOT NULL,
    precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
    metodo_pago VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'confirmada' CHECK (status IN ('pendiente', 'confirmada', 'cancelada', 'completada', 'eliminado')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    notas TEXT,
    tipo_reserva VARCHAR(50) DEFAULT 'individual' CHECK (tipo_reserva IN ('individual', 'club')),
    cancelled_at TIMESTAMP,
    cancel_reason TEXT,
    refund_status VARCHAR(50) CHECK (refund_status IN ('no_aplica', 'pendiente', 'procesado', 'rechazado')),
    refund_amount DECIMAL(10,2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_reservas_fechas CHECK (fecha_hora_inicio < fecha_hora_fin),
    CONSTRAINT fk_reservas_pista FOREIGN KEY (pista_id) REFERENCES pistas(id) ON DELETE CASCADE,
    CONSTRAINT fk_reservas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_reservas_club FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE SET NULL
);

CREATE INDEX idx_reservas_pista ON reservas(pista_id);
CREATE INDEX idx_reservas_usuario ON reservas(usuario_id);
CREATE INDEX idx_reservas_fecha ON reservas(fecha_hora_inicio);

COMMENT ON COLUMN reservas.tipo_reserva IS 'individual o club (NO clase - las clases usan clases_publicas)';

-- ============================================
-- TABLA 6: CLUB_MIEMBROS (Many-to-Many)
-- ============================================
CREATE TABLE club_miembros (
    id BIGSERIAL PRIMARY KEY,
    uid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    club_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'activo' CHECK (status IN ('activo', 'inactivo', 'expulsado', 'eliminado')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_inscripcion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_baja TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uk_club_miembros_club_usuario UNIQUE(club_id, usuario_id),
    CONSTRAINT fk_club_miembros_club FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
    CONSTRAINT fk_club_miembros_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE INDEX idx_club_miembros_club ON club_miembros(club_id);
CREATE INDEX idx_club_miembros_usuario ON club_miembros(usuario_id);

-- ============================================
-- TABLA 7: CLASE_INSCRIPCIONES (Many-to-Many)
-- ============================================
CREATE TABLE clase_inscripciones (
    id BIGSERIAL PRIMARY KEY,
    uid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    clase_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'confirmada' CHECK (status IN ('confirmada', 'cancelada', 'asistio', 'ausente', 'eliminado')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    precio_pagado DECIMAL(10,2) NOT NULL CHECK (precio_pagado >= 0),
    metodo_pago VARCHAR(50),
    fecha_inscripcion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancel_reason TEXT,
    refund_status VARCHAR(50) CHECK (refund_status IN ('no_aplica', 'pendiente', 'procesado', 'rechazado')),
    refund_amount DECIMAL(10,2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uk_clase_inscripciones_clase_usuario UNIQUE(clase_id, usuario_id),
    CONSTRAINT fk_clase_inscripciones_clase FOREIGN KEY (clase_id) REFERENCES clases_publicas(id) ON DELETE CASCADE,
    CONSTRAINT fk_clase_inscripciones_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE INDEX idx_clase_inscripciones_clase ON clase_inscripciones(clase_id);
CREATE INDEX idx_clase_inscripciones_usuario ON clase_inscripciones(usuario_id);

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
    
    CONSTRAINT chk_eventos_pista_fechas CHECK (fecha_hora_inicio < fecha_hora_fin),
    CONSTRAINT chk_eventos_pista_exclusividad CHECK (
        (tipo_evento = 'reserva' AND reserva_id IS NOT NULL AND clase_publica_id IS NULL) OR
        (tipo_evento = 'clase' AND clase_publica_id IS NOT NULL AND reserva_id IS NULL) OR
        (tipo_evento IN ('mantenimiento', 'bloqueo') AND reserva_id IS NULL AND clase_publica_id IS NULL)
    ),
    CONSTRAINT fk_eventos_pista_pista FOREIGN KEY (pista_id) REFERENCES pistas(id) ON DELETE CASCADE,
    CONSTRAINT fk_eventos_pista_reserva FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE,
    CONSTRAINT fk_eventos_pista_clase FOREIGN KEY (clase_publica_id) REFERENCES clases_publicas(id) ON DELETE CASCADE
);

CREATE INDEX idx_eventos_pista_pista ON eventos_pista(pista_id);
CREATE INDEX idx_eventos_pista_fecha_inicio ON eventos_pista(fecha_hora_inicio);
CREATE INDEX idx_eventos_pista_fecha_fin ON eventos_pista(fecha_hora_fin);
CREATE INDEX idx_eventos_pista_rango ON eventos_pista(pista_id, fecha_hora_inicio, fecha_hora_fin);
CREATE INDEX idx_eventos_pista_solapes ON eventos_pista(pista_id, status, is_active, fecha_hora_inicio, fecha_hora_fin);

COMMENT ON TABLE eventos_pista IS 'Control centralizado de ocupación de pistas para evitar solapes';
COMMENT ON CONSTRAINT chk_eventos_pista_exclusividad ON eventos_pista IS 'Garantiza que solo un FK esté activo según tipo_evento y previene conflictos con ON DELETE CASCADE';

-- ============================================
-- TABLA 9: CLUB_SUSCRIPCIONES (Cobros Recurrentes)
-- ============================================
-- Se crea ANTES de pagos para resolver dependencia circular
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
    ultimo_pago_id BIGINT, -- FK se añade después con ALTER TABLE
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_club_suscripciones_club_miembro FOREIGN KEY (club_miembro_id) REFERENCES club_miembros(id) ON DELETE CASCADE
    -- FK a pagos se añade al final para evitar dependencia circular
);

CREATE INDEX idx_club_suscripciones_miembro ON club_suscripciones(club_miembro_id);
CREATE INDEX idx_club_suscripciones_proximo_cobro ON club_suscripciones(proximo_cobro);
CREATE INDEX idx_club_suscripciones_status ON club_suscripciones(status);

COMMENT ON COLUMN club_suscripciones.proximo_cobro IS 'Cron job diario verifica esta fecha para cobros automáticos';

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
    
    CONSTRAINT chk_pagos_exclusividad CHECK (
        (reserva_id IS NOT NULL AND clase_inscripcion_id IS NULL AND club_suscripcion_id IS NULL) OR
        (reserva_id IS NULL AND clase_inscripcion_id IS NOT NULL AND club_suscripcion_id IS NULL) OR
        (reserva_id IS NULL AND clase_inscripcion_id IS NULL AND club_suscripcion_id IS NOT NULL)
    ),
    CONSTRAINT fk_pagos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_pagos_reserva FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE SET NULL,
    CONSTRAINT fk_pagos_clase_inscripcion FOREIGN KEY (clase_inscripcion_id) REFERENCES clase_inscripciones(id) ON DELETE SET NULL,
    CONSTRAINT fk_pagos_club_suscripcion FOREIGN KEY (club_suscripcion_id) REFERENCES club_suscripciones(id) ON DELETE SET NULL
);

CREATE INDEX idx_pagos_usuario ON pagos(usuario_id);
CREATE INDEX idx_pagos_reserva ON pagos(reserva_id);
CREATE INDEX idx_pagos_clase_inscripcion ON pagos(clase_inscripcion_id);
CREATE INDEX idx_pagos_club_suscripcion ON pagos(club_suscripcion_id);
CREATE INDEX idx_pagos_status ON pagos(status);
CREATE INDEX idx_pagos_usuario_status ON pagos(usuario_id, status);

COMMENT ON TABLE pagos IS 'Trazabilidad completa de todos los pagos con FKs directas';

-- Añadir FK de club_suscripciones a pagos (resuelve dependencia circular)
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
    
    CONSTRAINT uk_clase_waitlist_clase_usuario UNIQUE(clase_id, usuario_id),
    CONSTRAINT fk_clase_waitlist_clase FOREIGN KEY (clase_id) REFERENCES clases_publicas(id) ON DELETE CASCADE,
    CONSTRAINT fk_clase_waitlist_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE INDEX idx_clase_waitlist_clase ON clase_waitlist(clase_id);
CREATE INDEX idx_clase_waitlist_usuario ON clase_waitlist(usuario_id);
CREATE INDEX idx_clase_waitlist_posicion ON clase_waitlist(clase_id, posicion);

COMMENT ON TABLE clase_waitlist IS 'Lista de espera ordenada cuando clases alcanzan max_participantes';

-- ============================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- ============================================

-- Usuario Admin
INSERT INTO usuarios (slug, nombre, email, password_hash, role) VALUES
('admin', 'Administrador', 'admin@emotivapoli.com', '$2a$10$abcdefghijklmnopqrstuv', 'admin');

-- Pistas de ejemplo
INSERT INTO pistas (nombre, tipo, slug, precio_hora) VALUES
('Pista Pádel 1', 'padel', 'pista-padel-1', 15.00),
('Pista Tenis 1', 'tenis', 'pista-tenis-1', 20.00),
('Pista Fútbol Sala', 'futbol-sala', 'pista-futbol-sala-1', 40.00);

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
COMMENT ON DATABASE emotivapoli IS 'Sistema completo de gestión de polideportivo - 11 tablas, 21 FKs, 33 índices';
