-- =====================================================
-- SCRIPT COMPLETO DE CREACIÓN DE TABLAS
-- Polideportivo Emotiva - Sistema de Gestión Completo
-- =====================================================

-- =====================================================
-- TABLA: usuarios
-- Gestión de todos los usuarios del sistema
-- =====================================================
CREATE TABLE IF NOT EXISTS usuarios (
    -- Identificación
    id BIGSERIAL PRIMARY KEY,
    uid VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    
    -- Datos personales
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    dni VARCHAR(20) UNIQUE,
    fecha_nacimiento DATE,
    
    -- Avatar/Foto
    avatar TEXT,
    
    -- Autenticación
    password_hash VARCHAR(255) NOT NULL,
    
    -- Rol y estado
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'cliente', 'entrenador')),
    status VARCHAR(20) NOT NULL DEFAULT 'activo' CHECK (status IN ('activo', 'pendiente', 'suspendido', 'inactivo')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- Información adicional
    direccion TEXT,
    ciudad VARCHAR(100),
    codigo_postal VARCHAR(10),
    
    -- Campos específicos entrenador
    especialidad VARCHAR(100),
    certificaciones TEXT,
    bio TEXT,
    
    -- Auditoría
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    
    CONSTRAINT usuarios_email_lower_check CHECK (email = LOWER(email))
);

-- Índices para usuarios
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_role ON usuarios(role);
CREATE INDEX idx_usuarios_status ON usuarios(status);
CREATE INDEX idx_usuarios_slug ON usuarios(slug);
CREATE INDEX idx_usuarios_is_active ON usuarios(is_active);


-- =====================================================
-- TABLA: clubs
-- Clubs deportivos gestionados por entrenadores
-- =====================================================
CREATE TABLE IF NOT EXISTS clubs (
    -- Identificación
    id BIGSERIAL PRIMARY KEY,
    uid VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    
    -- Información básica
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    deporte VARCHAR(50) NOT NULL,
    
    -- Imagen
    imagen TEXT,
    
    -- Relaciones
    entrenador_id BIGINT REFERENCES usuarios(id) ON DELETE SET NULL,
    
    -- Configuración
    max_miembros INT DEFAULT 20,
    nivel VARCHAR(20) CHECK (nivel IN ('principiante', 'intermedio', 'avanzado', 'mixto')),
    precio_mensual DECIMAL(10,2),
    
    -- Estado
    status VARCHAR(20) NOT NULL DEFAULT 'activo' CHECK (status IN ('activo', 'inactivo', 'lleno', 'suspendido')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- Auditoría
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para clubs
CREATE INDEX idx_clubs_entrenador ON clubs(entrenador_id);
CREATE INDEX idx_clubs_deporte ON clubs(deporte);
CREATE INDEX idx_clubs_status ON clubs(status);
CREATE INDEX idx_clubs_slug ON clubs(slug);
CREATE INDEX idx_clubs_is_active ON clubs(is_active);


-- =====================================================
-- TABLA: club_miembros
-- Membresías de clientes en clubs
-- =====================================================
CREATE TABLE IF NOT EXISTS club_miembros (
    -- Identificación
    id BIGSERIAL PRIMARY KEY,
    uid VARCHAR(100) UNIQUE NOT NULL,
    
    -- Relaciones
    club_id BIGINT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    usuario_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    
    -- Estado
    status VARCHAR(20) NOT NULL DEFAULT 'activo' CHECK (status IN ('activo', 'inactivo', 'expulsado')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- Auditoría
    fecha_inscripcion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_baja TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(club_id, usuario_id)
);

-- Índices para club_miembros
CREATE INDEX idx_club_miembros_club ON club_miembros(club_id);
CREATE INDEX idx_club_miembros_usuario ON club_miembros(usuario_id);
CREATE INDEX idx_club_miembros_status ON club_miembros(status);


-- =====================================================
-- TABLA: clases_publicas
-- Clases públicas creadas por entrenadores
-- =====================================================
CREATE TABLE IF NOT EXISTS clases_publicas (
    -- Identificación
    id BIGSERIAL PRIMARY KEY,
    uid VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    
    -- Información básica
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    
    -- Imagen
    imagen TEXT,
    
    -- Relaciones
    entrenador_id BIGINT REFERENCES usuarios(id) ON DELETE SET NULL,
    pista_id BIGINT REFERENCES pistas(id) ON DELETE SET NULL,
    
    -- Programación
    fecha_hora_inicio TIMESTAMP NOT NULL,
    fecha_hora_fin TIMESTAMP NOT NULL,
    duracion_minutos INT NOT NULL,
    
    -- Configuración
    max_participantes INT DEFAULT 10,
    precio DECIMAL(10,2),
    nivel VARCHAR(20) CHECK (nivel IN ('principiante', 'intermedio', 'avanzado', 'todos')),
    deporte VARCHAR(50) NOT NULL,
    
    -- Estado
    status VARCHAR(20) NOT NULL DEFAULT 'programada' CHECK (status IN ('programada', 'en_curso', 'completada', 'cancelada')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- Auditoría
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para clases_publicas
CREATE INDEX idx_clases_entrenador ON clases_publicas(entrenador_id);
CREATE INDEX idx_clases_pista ON clases_publicas(pista_id);
CREATE INDEX idx_clases_fecha ON clases_publicas(fecha_hora_inicio);
CREATE INDEX idx_clases_status ON clases_publicas(status);
CREATE INDEX idx_clases_slug ON clases_publicas(slug);
CREATE INDEX idx_clases_is_active ON clases_publicas(is_active);


-- =====================================================
-- TABLA: clase_inscripciones
-- Inscripciones de usuarios a clases públicas
-- =====================================================
CREATE TABLE IF NOT EXISTS clase_inscripciones (
    -- Identificación
    id BIGSERIAL PRIMARY KEY,
    uid VARCHAR(100) UNIQUE NOT NULL,
    
    -- Relaciones
    clase_id BIGINT NOT NULL REFERENCES clases_publicas(id) ON DELETE CASCADE,
    usuario_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    
    -- Estado
    status VARCHAR(20) NOT NULL DEFAULT 'confirmada' CHECK (status IN ('confirmada', 'cancelada', 'asistio', 'no_asistio')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- Pago
    precio_pagado DECIMAL(10,2),
    metodo_pago VARCHAR(50),
    
    -- Auditoría
    fecha_inscripcion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_cancelacion TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(clase_id, usuario_id)
);

-- Índices para clase_inscripciones
CREATE INDEX idx_clase_inscripciones_clase ON clase_inscripciones(clase_id);
CREATE INDEX idx_clase_inscripciones_usuario ON clase_inscripciones(usuario_id);
CREATE INDEX idx_clase_inscripciones_status ON clase_inscripciones(status);


-- =====================================================
-- TABLA: reservas
-- Reservas de pistas (personales o de clubs)
-- =====================================================
CREATE TABLE IF NOT EXISTS reservas (
    -- Identificación
    id BIGSERIAL PRIMARY KEY,
    uid VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    
    -- Relaciones
    pista_id BIGINT NOT NULL REFERENCES pistas(id) ON DELETE CASCADE,
    usuario_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    club_id BIGINT REFERENCES clubs(id) ON DELETE SET NULL,
    
    -- Programación
    fecha_hora_inicio TIMESTAMP NOT NULL,
    fecha_hora_fin TIMESTAMP NOT NULL,
    
    -- Precio y pago
    precio DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(50),
    
    -- Estado
    status VARCHAR(20) NOT NULL DEFAULT 'confirmada' CHECK (status IN ('confirmada', 'cancelada', 'completada', 'no_show')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- Información adicional
    notas TEXT,
    tipo_reserva VARCHAR(20) DEFAULT 'personal' CHECK (tipo_reserva IN ('personal', 'club', 'clase')),
    
    -- Auditoría
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_cancelacion TIMESTAMP,
    
    UNIQUE(pista_id, fecha_hora_inicio)
);

-- Índices para reservas
CREATE INDEX idx_reservas_pista ON reservas(pista_id);
CREATE INDEX idx_reservas_usuario ON reservas(usuario_id);
CREATE INDEX idx_reservas_club ON reservas(club_id);
CREATE INDEX idx_reservas_fecha_inicio ON reservas(fecha_hora_inicio);
CREATE INDEX idx_reservas_status ON reservas(status);
CREATE INDEX idx_reservas_slug ON reservas(slug);
CREATE INDEX idx_reservas_is_active ON reservas(is_active);


-- =====================================================
-- DATOS INICIALES: Usuario Admin por defecto
-- =====================================================
INSERT INTO usuarios (
    uid, slug, nombre, apellidos, email, telefono, 
    password_hash, role, status, is_active, avatar
) VALUES (
    'admin-000-000-001',
    'admin-emotiva',
    'Admin',
    'Emotiva Poli',
    'admin@emotivapoli.com',
    '666777888',
    -- Contraseña: admin123 (deberás usar bcrypt en producción)
    '$2a$10$xQPwJvKz6Qy8GYc6qJZ0Vu7K9qJZ0Vu7K9qJZ0Vu7K9qJZ0Vu7K9q',
    'admin',
    'activo',
    true,
    'https://ui-avatars.com/api/?name=Admin+Emotiva&background=2985a3&color=fff&size=200'
) ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- VERIFICACIÓN: Mostrar todas las tablas creadas
-- =====================================================
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as num_columns
FROM information_schema.tables t
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
ORDER BY table_name;
