-- V1: Schema inicial - Emotiva Poli
-- Tablas base del sistema de gestión de polideportivo

-- Tabla: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
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

-- Tabla: pistas
CREATE TABLE IF NOT EXISTS pistas (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'disponible' CHECK (status IN ('disponible', 'ocupada', 'mantenimiento', 'eliminado')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    slug VARCHAR(255) UNIQUE NOT NULL,
    precio_hora DECIMAL(10, 2) NOT NULL,
    descripcion TEXT,
    imagen TEXT
);

-- Tabla: clubs
CREATE TABLE IF NOT EXISTS clubs (
    id BIGSERIAL PRIMARY KEY,
    uid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    deporte VARCHAR(100),
    imagen TEXT,
    entrenador_id BIGINT,
    max_miembros INTEGER NOT NULL DEFAULT 20,
    nivel VARCHAR(50) CHECK (nivel IN ('principiante', 'intermedio', 'avanzado')),
    precio_mensual DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'activo' CHECK (status IN ('activo', 'inactivo', 'completo', 'eliminado')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (entrenador_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Tabla: clases_publicas
CREATE TABLE IF NOT EXISTS clases_publicas (
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
    duracion_minutos INTEGER NOT NULL,
    max_participantes INTEGER NOT NULL DEFAULT 15,
    precio DECIMAL(10, 2) NOT NULL,
    nivel VARCHAR(50) CHECK (nivel IN ('principiante', 'intermedio', 'avanzado')),
    deporte VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'programada' CHECK (status IN ('programada', 'en_curso', 'finalizada', 'cancelada', 'eliminado')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (entrenador_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (pista_id) REFERENCES pistas(id) ON DELETE SET NULL
);

-- Tabla: reservas
CREATE TABLE IF NOT EXISTS reservas (
    id BIGSERIAL PRIMARY KEY,
    uid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    pista_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    club_id BIGINT,
    fecha_hora_inicio TIMESTAMP NOT NULL,
    fecha_hora_fin TIMESTAMP NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    metodo_pago VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'confirmada' CHECK (status IN ('pendiente', 'confirmada', 'cancelada', 'completada', 'eliminado')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    notas TEXT,
    tipo_reserva VARCHAR(50) DEFAULT 'individual' CHECK (tipo_reserva IN ('individual', 'club', 'clase')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pista_id) REFERENCES pistas(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE SET NULL
);

-- Tabla: club_miembros (Many-to-Many entre usuarios y clubs)
CREATE TABLE IF NOT EXISTS club_miembros (
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
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE (club_id, usuario_id)
);

-- Tabla: clase_inscripciones (Many-to-Many entre usuarios y clases_publicas)
CREATE TABLE IF NOT EXISTS clase_inscripciones (
    id BIGSERIAL PRIMARY KEY,
    uid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    clase_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'confirmada' CHECK (status IN ('confirmada', 'cancelada', 'asistio', 'ausente', 'eliminado')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    precio_pagado DECIMAL(10, 2) NOT NULL,
    metodo_pago VARCHAR(50),
    fecha_inscripcion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (clase_id) REFERENCES clases_publicas(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE (clase_id, usuario_id)
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_role ON usuarios(role);
CREATE INDEX idx_usuarios_status ON usuarios(status);
CREATE INDEX idx_pistas_status ON pistas(status);
CREATE INDEX idx_clubs_entrenador ON clubs(entrenador_id);
CREATE INDEX idx_clases_entrenador ON clases_publicas(entrenador_id);
CREATE INDEX idx_clases_pista ON clases_publicas(pista_id);
CREATE INDEX idx_reservas_pista ON reservas(pista_id);
CREATE INDEX idx_reservas_usuario ON reservas(usuario_id);
CREATE INDEX idx_reservas_fecha ON reservas(fecha_hora_inicio);
CREATE INDEX idx_club_miembros_club ON club_miembros(club_id);
CREATE INDEX idx_club_miembros_usuario ON club_miembros(usuario_id);
CREATE INDEX idx_clase_inscripciones_clase ON clase_inscripciones(clase_id);
CREATE INDEX idx_clase_inscripciones_usuario ON clase_inscripciones(usuario_id);
