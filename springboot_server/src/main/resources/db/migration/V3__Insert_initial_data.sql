-- V3__Insert_initial_data.sql
-- Datos realistas para el polideportivo Emotiva

-- ============================================
-- USUARIOS (5 entrenadores + 15 clientes)
-- ============================================
-- Contraseña por defecto: "password123" (en producción usar hash BCrypt)
INSERT INTO usuarios (uid, slug, nombre, email, telefono, password_hash, role, status, is_active, created_at, updated_at) VALUES
-- ENTRENADORES
(gen_random_uuid(), 'carlos-martinez', 'Carlos Martínez', 'carlos.martinez@emotivapoli.com', '634567890', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhbm', 'entrenador', 'activo', true, NOW(), NOW()),
(gen_random_uuid(), 'ana-garcia', 'Ana García', 'ana.garcia@emotivapoli.com', '645678901', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhbm', 'entrenador', 'activo', true, NOW(), NOW()),
(gen_random_uuid(), 'luis-fernandez', 'Luis Fernández', 'luis.fernandez@emotivapoli.com', '656789012', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhbm', 'entrenador', 'activo', true, NOW(), NOW()),
(gen_random_uuid(), 'marta-lopez', 'Marta López', 'marta.lopez@emotivapoli.com', '667890123', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhbm', 'entrenador', 'activo', true, NOW(), NOW()),
(gen_random_uuid(), 'javier-ruiz', 'Javier Ruiz', 'javier.ruiz@emotivapoli.com', '678901234', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhbm', 'entrenador', 'activo', true, NOW(), NOW()),

-- CLIENTES
(gen_random_uuid(), 'maria-sanchez', 'María Sánchez', 'maria.sanchez@example.com', '689012345', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhbm', 'cliente', 'activo', true, NOW(), NOW()),
(gen_random_uuid(), 'pedro-gomez', 'Pedro Gómez', 'pedro.gomez@example.com', '690123456', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhbm', 'cliente', 'activo', true, NOW(), NOW()),
(gen_random_uuid(), 'laura-martin', 'Laura Martín', 'laura.martin@example.com', '601234567', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhbm', 'cliente', 'activo', true, NOW(), NOW()),
(gen_random_uuid(), 'david-rodriguez', 'David Rodríguez', 'david.rodriguez@example.com', '612345678', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhbm', 'cliente', 'activo', true, NOW(), NOW()),
(gen_random_uuid(), 'sofia-hernandez', 'Sofía Hernández', 'sofia.hernandez@example.com', '623456789', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhbm', 'cliente', 'activo', true, NOW(), NOW()),
(gen_random_uuid(), 'miguel-diaz', 'Miguel Díaz', 'miguel.diaz@example.com', '634567891', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhbm', 'cliente', 'activo', true, NOW(), NOW()),
(gen_random_uuid(), 'carmen-moreno', 'Carmen Moreno', 'carmen.moreno@example.com', '645678902', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhbm', 'cliente', 'activo', true, NOW(), NOW()),
(gen_random_uuid(), 'alberto-jimenez', 'Alberto Jiménez', 'alberto.jimenez@example.com', '656789013', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhbm', 'cliente', 'activo', true, NOW(), NOW()),
(gen_random_uuid(), 'elena-navarro', 'Elena Navarro', 'elena.navarro@example.com', '667890124', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhbm', 'cliente', 'activo', true, NOW(), NOW()),
(gen_random_uuid(), 'raul-torres', 'Raúl Torres', 'raul.torres@example.com', '678901235', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhbm', 'cliente', 'activo', true, NOW(), NOW()),
(gen_random_uuid(), 'cristina-vega', 'Cristina Vega', 'cristina.vega@example.com', '689012346', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhbm', 'cliente', 'activo', true, NOW(), NOW()),
(gen_random_uuid(), 'pablo-castro', 'Pablo Castro', 'pablo.castro@example.com', '690123457', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhbm', 'cliente', 'activo', true, NOW(), NOW()),
(gen_random_uuid(), 'isabel-ramos', 'Isabel Ramos', 'isabel.ramos@example.com', '601234568', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhbm', 'cliente', 'activo', true, NOW(), NOW()),
(gen_random_uuid(), 'sergio-ortiz', 'Sergio Ortiz', 'sergio.ortiz@example.com', '612345679', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhbm', 'cliente', 'activo', true, NOW(), NOW()),
(gen_random_uuid(), 'beatriz-mendez', 'Beatriz Méndez', 'beatriz.mendez@example.com', '623456790', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhbm', 'cliente', 'activo', true, NOW(), NOW());

-- ============================================
-- PISTAS (8 pistas de diferentes deportes)
-- ============================================
INSERT INTO pistas (slug, nombre, tipo, precio_hora, status, descripcion, imagen, is_active) VALUES
('pista-padel-1', 'Pista Pádel 1', 'Pádel', 25.00, 'disponible', 'Pista de pádel con césped sintético en Zona Norte. Capacidad: 4 personas', 'https://example.com/padel1.jpg', true),
('pista-padel-2', 'Pista Pádel 2', 'Pádel', 25.00, 'disponible', 'Pista de pádel con césped sintético en Zona Norte. Capacidad: 4 personas', 'https://example.com/padel2.jpg', true),
('pista-tenis-1', 'Pista Tenis 1', 'Tenis', 30.00, 'disponible', 'Pista de tenis con tierra batida en Zona Sur. Capacidad: 2 personas', 'https://example.com/tenis1.jpg', true),
('pista-tenis-2', 'Pista Tenis 2', 'Tenis', 28.00, 'disponible', 'Pista de tenis dura en Zona Sur. Capacidad: 2 personas', 'https://example.com/tenis2.jpg', true),
('pista-futbol-sala', 'Pista Fútbol Sala', 'Fútbol Sala', 50.00, 'disponible', 'Pista de fútbol sala en Pabellón Central. Capacidad: 14 personas', 'https://example.com/futsal.jpg', true),
('pista-baloncesto', 'Pista Baloncesto', 'Baloncesto', 45.00, 'disponible', 'Pista de baloncesto en Pabellón Central. Capacidad: 10 personas', 'https://example.com/basket.jpg', true),
('sala-spinning', 'Sala Spinning', 'Spinning', 15.00, 'disponible', 'Sala de spinning en Planta Baja. Capacidad: 20 personas', 'https://example.com/spinning.jpg', true),
('sala-yoga', 'Sala Yoga', 'Yoga', 12.00, 'disponible', 'Sala de yoga en Planta Primera. Capacidad: 15 personas', 'https://example.com/yoga.jpg', true);

-- ============================================
-- CLUBS (4 clubs deportivos)
-- ============================================
INSERT INTO clubs (uid, slug, nombre, descripcion, deporte, imagen, entrenador_id, max_miembros, nivel, precio_mensual, status, is_active, created_at, updated_at) VALUES
(gen_random_uuid(), 'club-padel-avanzado', 'Club Pádel Avanzado', 'Club para jugadores experimentados de pádel que buscan mejorar su técnica y competir', 'Pádel', 'https://example.com/club-padel.jpg', (SELECT id FROM usuarios WHERE slug = 'carlos-martinez'), 20, 'avanzado', 45.00, 'activo', true, NOW(), NOW()),
(gen_random_uuid(), 'club-tenis-principiante', 'Club Tenis Iniciación', 'Aprende tenis desde cero con entrenamientos personalizados', 'Tenis', 'https://example.com/club-tenis.jpg', (SELECT id FROM usuarios WHERE slug = 'ana-garcia'), 15, 'principiante', 40.00, 'activo', true, NOW(), NOW()),
(gen_random_uuid(), 'club-spinning-intensivo', 'Club Spinning Intensivo', 'Sesiones de spinning de alta intensidad para mejorar resistencia cardiovascular', 'Spinning', 'https://example.com/club-spinning.jpg', (SELECT id FROM usuarios WHERE slug = 'marta-lopez'), 25, 'intermedio', 35.00, 'activo', true, NOW(), NOW()),
(gen_random_uuid(), 'club-yoga-mindfulness', 'Club Yoga & Mindfulness', 'Yoga, meditación y técnicas de relajación para todos los niveles', 'Yoga', 'https://example.com/club-yoga.jpg', (SELECT id FROM usuarios WHERE slug = 'luis-fernandez'), 18, 'principiante', 38.00, 'activo', true, NOW(), NOW());

-- ============================================
-- CLASES PÚBLICAS (10 clases programadas - GRATIS)
-- ============================================
-- Clases para la próxima semana (enero 2026)
INSERT INTO clases_publicas (uid, slug, nombre, descripcion, imagen, entrenador_id, pista_id, fecha_hora_inicio, fecha_hora_fin, duracion_minutos, max_participantes, precio, nivel, deporte, status, is_active, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    'yoga-principiantes-lunes-27-enero',
    'Yoga para Principiantes',
    'Clase de yoga suave ideal para iniciarse en esta disciplina',
    'https://example.com/clase-yoga.jpg',
    (SELECT id FROM usuarios WHERE slug = 'luis-fernandez'),
    (SELECT id FROM pistas WHERE slug = 'sala-yoga'),
    TIMESTAMP '2026-01-27 10:00:00',
    TIMESTAMP '2026-01-27 11:00:00',
    60,
    15,
    0.00,
    'principiante',
    'Yoga',
    'programada',
    true,
    NOW(),
    NOW()
UNION ALL
SELECT 
    gen_random_uuid(),
    'spinning-intenso-lunes-27-enero',
    'Spinning Intenso',
    'Clase de spinning de alta intensidad con intervalos',
    'https://example.com/clase-spinning.jpg',
    (SELECT id FROM usuarios WHERE slug = 'marta-lopez'),
    (SELECT id FROM pistas WHERE slug = 'sala-spinning'),
    TIMESTAMP '2026-01-27 18:00:00',
    TIMESTAMP '2026-01-27 19:00:00',
    60,
    20,
    0.00,
    'intermedio',
    'Spinning',
    'programada',
    true,
    NOW(),
    NOW()
UNION ALL
SELECT 
    gen_random_uuid(),
    'padel-iniciacion-martes-28-enero',
    'Pádel Iniciación',
    'Aprende los fundamentos básicos del pádel',
    'https://example.com/clase-padel.jpg',
    (SELECT id FROM usuarios WHERE slug = 'carlos-martinez'),
    (SELECT id FROM pistas WHERE slug = 'pista-padel-1'),
    TIMESTAMP '2026-01-28 17:00:00',
    TIMESTAMP '2026-01-28 18:30:00',
    90,
    8,
    0.00,
    'principiante',
    'Pádel',
    'programada',
    true,
    NOW(),
    NOW()
UNION ALL
SELECT 
    gen_random_uuid(),
    'tenis-avanzado-miercoles-29-enero',
    'Tenis Avanzado',
    'Perfecciona tu técnica de saque y volea',
    'https://example.com/clase-tenis.jpg',
    (SELECT id FROM usuarios WHERE slug = 'ana-garcia'),
    (SELECT id FROM pistas WHERE slug = 'pista-tenis-1'),
    TIMESTAMP '2026-01-29 19:00:00',
    TIMESTAMP '2026-01-29 20:30:00',
    90,
    6,
    0.00,
    'avanzado',
    'Tenis',
    'programada',
    true,
    NOW(),
    NOW()
UNION ALL
SELECT 
    gen_random_uuid(),
    'futbol-sala-jueves-30-enero',
    'Fútbol Sala Recreativo',
    'Partido amistoso de fútbol sala',
    'https://example.com/clase-futsal.jpg',
    (SELECT id FROM usuarios WHERE slug = 'javier-ruiz'),
    (SELECT id FROM pistas WHERE slug = 'pista-futbol-sala'),
    TIMESTAMP '2026-01-30 20:00:00',
    TIMESTAMP '2026-01-30 21:30:00',
    90,
    14,
    0.00,
    'principiante',
    'Fútbol Sala',
    'programada',
    true,
    NOW(),
    NOW()
UNION ALL
SELECT 
    gen_random_uuid(),
    'yoga-vinyasa-viernes-31-enero',
    'Yoga Vinyasa Flow',
    'Secuencias dinámicas de yoga con sincronización respiratoria',
    'https://example.com/clase-vinyasa.jpg',
    (SELECT id FROM usuarios WHERE slug = 'luis-fernandez'),
    (SELECT id FROM pistas WHERE slug = 'sala-yoga'),
    TIMESTAMP '2026-01-31 11:00:00',
    TIMESTAMP '2026-01-31 12:00:00',
    60,
    12,
    0.00,
    'intermedio',
    'Yoga',
    'programada',
    true,
    NOW(),
    NOW()
UNION ALL
SELECT 
    gen_random_uuid(),
    'padel-competicion-sabado-01-febrero',
    'Pádel Competición',
    'Entrenamiento enfocado a torneos y partidas competitivas',
    'https://example.com/clase-padel-comp.jpg',
    (SELECT id FROM usuarios WHERE slug = 'carlos-martinez'),
    (SELECT id FROM pistas WHERE slug = 'pista-padel-2'),
    TIMESTAMP '2026-02-01 10:00:00',
    TIMESTAMP '2026-02-01 12:00:00',
    120,
    8,
    0.00,
    'avanzado',
    'Pádel',
    'programada',
    true,
    NOW(),
    NOW()
UNION ALL
SELECT 
    gen_random_uuid(),
    'spinning-recuperacion-sabado-01-febrero',
    'Spinning Recuperación',
    'Clase de spinning suave ideal para recuperación activa',
    'https://example.com/clase-spinning-suave.jpg',
    (SELECT id FROM usuarios WHERE slug = 'marta-lopez'),
    (SELECT id FROM pistas WHERE slug = 'sala-spinning'),
    TIMESTAMP '2026-02-01 12:00:00',
    TIMESTAMP '2026-02-01 13:00:00',
    60,
    18,
    0.00,
    'principiante',
    'Spinning',
    'programada',
    true,
    NOW(),
    NOW()
UNION ALL
SELECT 
    gen_random_uuid(),
    'tenis-dobles-domingo-02-febrero',
    'Tenis Dobles',
    'Práctica de tenis en modalidad de dobles',
    'https://example.com/clase-tenis-dobles.jpg',
    (SELECT id FROM usuarios WHERE slug = 'ana-garcia'),
    (SELECT id FROM pistas WHERE slug = 'pista-tenis-2'),
    TIMESTAMP '2026-02-02 11:00:00',
    TIMESTAMP '2026-02-02 12:30:00',
    90,
    8,
    0.00,
    'intermedio',
    'Tenis',
    'programada',
    true,
    NOW(),
    NOW()
UNION ALL
SELECT 
    gen_random_uuid(),
    'yoga-relajacion-domingo-02-febrero',
    'Yoga Relajación',
    'Clase de yoga restaurativo y técnicas de relajación profunda',
    'https://example.com/clase-yoga-relax.jpg',
    (SELECT id FROM usuarios WHERE slug = 'luis-fernandez'),
    (SELECT id FROM pistas WHERE slug = 'sala-yoga'),
    TIMESTAMP '2026-02-02 18:00:00',
    TIMESTAMP '2026-02-02 19:00:00',
    60,
    15,
    0.00,
    'principiante',
    'Yoga',
    'programada',
    true,
    NOW(),
    NOW();

-- ============================================
-- RESERVAS (12 reservas individuales)
-- ============================================
INSERT INTO reservas (uid, slug, pista_id, usuario_id, club_id, fecha_hora_inicio, fecha_hora_fin, precio, metodo_pago, status, is_active, notas, tipo_reserva, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    'reserva-maria-padel-27-ene',
    (SELECT id FROM pistas WHERE slug = 'pista-padel-1'),
    (SELECT id FROM usuarios WHERE slug = 'maria-sanchez'),
    NULL::BIGINT,
    TIMESTAMP '2026-01-27 09:00:00',
    TIMESTAMP '2026-01-27 10:00:00',
    25.00,
    'efectivo',
    'confirmada',
    true,
    'Partido amistoso',
    'individual',
    NOW(),
    NOW()
UNION ALL
SELECT 
    gen_random_uuid(),
    'reserva-pedro-tenis-27-ene',
    (SELECT id FROM pistas WHERE slug = 'pista-tenis-1'),
    (SELECT id FROM usuarios WHERE slug = 'pedro-gomez'),
NULL::BIGINT,
TIMESTAMP '2026-01-27 16:00:00',
    TIMESTAMP '2026-01-27 17:00:00',
    30.00,
    'tarjeta',
    'confirmada',
    true,
    'Entrenamiento personal',
    'individual',
    NOW(),
    NOW()
UNION ALL
SELECT 
    gen_random_uuid(),
    'reserva-david-futsal-28-ene',
    (SELECT id FROM pistas WHERE slug = 'pista-futbol-sala'),
    (SELECT id FROM usuarios WHERE slug = 'david-rodriguez'),
NULL::BIGINT,
TIMESTAMP '2026-01-28 19:00:00',
    TIMESTAMP '2026-01-28 20:00:00',
    50.00,
    'transferencia',
    'confirmada',
    true,
    'Partido con amigos',
    'individual',
    NOW(),
    NOW()
UNION ALL
SELECT 
    gen_random_uuid(),
    'reserva-sofia-padel-29-ene',
    (SELECT id FROM pistas WHERE slug = 'pista-padel-2'),
    (SELECT id FROM usuarios WHERE slug = 'sofia-hernandez'),
NULL::BIGINT,
TIMESTAMP '2026-01-29 18:00:00',
    TIMESTAMP '2026-01-29 19:30:00',
    37.50,
    'tarjeta',
    'confirmada',
    true,
    'Clase particular',
    'individual',
    NOW(),
    NOW()
UNION ALL
SELECT 
    gen_random_uuid(),
    'reserva-miguel-tenis-30-ene',
    (SELECT id FROM pistas WHERE slug = 'pista-tenis-2'),
    (SELECT id FROM usuarios WHERE slug = 'miguel-diaz'),
NULL::BIGINT,
TIMESTAMP '2026-01-30 10:00:00',
    TIMESTAMP '2026-01-30 11:00:00',
    28.00,
    'efectivo',
    'confirmada',
    true,
    NULL,
    'individual',
    NOW(),
    NOW()
UNION ALL
SELECT 
    gen_random_uuid(),
    'reserva-carmen-basket-31-ene',
    (SELECT id FROM pistas WHERE slug = 'pista-baloncesto'),
    (SELECT id FROM usuarios WHERE slug = 'carmen-moreno'),
NULL::BIGINT,
TIMESTAMP '2026-01-31 17:00:00',
    TIMESTAMP '2026-01-31 18:00:00',
    45.00,
    'tarjeta',
    'confirmada',
    true,
    'Entrenamiento de equipo',
    'individual',
    NOW(),
    NOW()
UNION ALL
SELECT 
    gen_random_uuid(),
    'reserva-alberto-club-padel-01-feb',
    (SELECT id FROM pistas WHERE slug = 'pista-padel-1'),
    (SELECT id FROM usuarios WHERE slug = 'alberto-jimenez'),
    (SELECT id FROM clubs WHERE slug = 'club-padel-avanzado'),
    TIMESTAMP '2026-02-01 08:00:00',
    TIMESTAMP '2026-02-01 09:30:00',
    37.50,
    'transferencia',
    'confirmada',
    true,
    'Entrenamiento club',
    'club',
    NOW(),
    NOW()
UNION ALL
SELECT 
    gen_random_uuid(),
    'reserva-elena-spinning-01-feb',
    (SELECT id FROM pistas WHERE slug = 'sala-spinning'),
    (SELECT id FROM usuarios WHERE slug = 'elena-navarro'),
NULL::BIGINT,
TIMESTAMP '2026-02-01 19:00:00',
    TIMESTAMP '2026-02-01 20:00:00',
    15.00,
    'efectivo',
    'confirmada',
    true,
    'Sesión individual',
    'individual',
    NOW(),
    NOW()
UNION ALL
SELECT 
    gen_random_uuid(),
    'reserva-raul-tenis-02-feb',
    (SELECT id FROM pistas WHERE slug = 'pista-tenis-1'),
    (SELECT id FROM usuarios WHERE slug = 'raul-torres'),
    NULL::BIGINT,
    TIMESTAMP '2026-02-02 10:00:00',
    TIMESTAMP '2026-02-02 11:30:00',
    45.00,
    'tarjeta',
    'pendiente',
    true,
    'Reserva pendiente de confirmar pago',
    'individual',
    NOW(),
    NOW()
UNION ALL
SELECT 
    gen_random_uuid(),
    'reserva-cristina-padel-02-feb',
    (SELECT id FROM pistas WHERE slug = 'pista-padel-2'),
    (SELECT id FROM usuarios WHERE slug = 'cristina-vega'),
NULL::BIGINT,
TIMESTAMP '2026-02-02 16:00:00',
    TIMESTAMP '2026-02-02 17:00:00',
    25.00,
    'tarjeta',
    'confirmada',
    true,
    NULL,
    'individual',
    NOW(),
    NOW()
UNION ALL
SELECT 
    gen_random_uuid(),
    'reserva-pablo-yoga-cancelada-03-feb',
    (SELECT id FROM pistas WHERE slug = 'sala-yoga'),
    (SELECT id FROM usuarios WHERE slug = 'pablo-castro'),
NULL::BIGINT,
TIMESTAMP '2026-02-03 09:00:00',
    TIMESTAMP '2026-02-03 10:00:00',
    12.00,
    'efectivo',
    'cancelada',
    false,
    'Cancelada por el usuario',
    'individual',
    NOW(),
    NOW()
UNION ALL
SELECT 
    gen_random_uuid(),
    'reserva-sergio-futsal-03-feb',
    (SELECT id FROM pistas WHERE slug = 'pista-futbol-sala'),
    (SELECT id FROM usuarios WHERE slug = 'sergio-ortiz'),
NULL::BIGINT,
TIMESTAMP '2026-02-03 21:00:00',
    TIMESTAMP '2026-02-03 22:00:00',
    50.00,
    'transferencia',
    'confirmada',
    true,
    'Partido de empresa',
    'individual',
    NOW(),
    NOW();

-- ============================================
-- PAGOS (generar pagos para reservas confirmadas)
-- ============================================
INSERT INTO pagos (uid, usuario_id, reserva_id, clase_inscripcion_id, club_suscripcion_id, amount, currency, provider, provider_payment_id, status, is_active, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    r.usuario_id,
    r.id,
    NULL,
    NULL,
    r.precio,
    'EUR',
    CASE 
        WHEN r.metodo_pago = 'tarjeta' THEN 'stripe'
        WHEN r.metodo_pago = 'transferencia' THEN 'transferencia'
        ELSE 'efectivo'
    END,
    CASE 
        WHEN r.metodo_pago = 'tarjeta' THEN 'pi_' || substring(gen_random_uuid()::text, 1, 24)
        WHEN r.metodo_pago = 'transferencia' THEN 'tr_' || substring(gen_random_uuid()::text, 1, 24)
        ELSE NULL
    END,
    CASE 
        WHEN r.status = 'confirmada' THEN 'completado'
        WHEN r.status = 'pendiente' THEN 'pendiente'
        ELSE 'fallido'
    END,
    r.is_active,
    r.created_at,
    r.updated_at
FROM reservas r
WHERE r.status IN ('confirmada', 'pendiente');

-- Log de finalización
SELECT 'Initial data inserted successfully!' AS message;
SELECT 
    (SELECT COUNT(*) FROM usuarios) AS total_usuarios,
    (SELECT COUNT(*) FROM pistas) AS total_pistas,
    (SELECT COUNT(*) FROM clubs) AS total_clubs,
    (SELECT COUNT(*) FROM clases_publicas) AS total_clases,
    (SELECT COUNT(*) FROM reservas) AS total_reservas,
    (SELECT COUNT(*) FROM pagos) AS total_pagos;

