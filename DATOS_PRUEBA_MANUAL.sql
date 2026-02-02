-- ============================================
-- DATOS DE PRUEBA PARA EMOTIVA POLIDEPORTIVO
-- ============================================
-- Ejecutar manualmente en pgAdmin
-- Contraseña de todos los usuarios: "password123"

-- ============================================
-- 1. USUARIOS (5 entrenadores + 10 clientes)
-- ============================================
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
(gen_random_uuid(), 'raul-torres', 'Raúl Torres', 'raul.torres@example.com', '678901235', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhbm', 'cliente', 'activo', true, NOW(), NOW());

-- ============================================
-- 2. PISTAS (6 pistas)
-- ============================================
INSERT INTO pistas (slug, nombre, tipo, precio_hora, status, descripcion, imagen, is_active) VALUES
('pista-padel-1', 'Pista Pádel 1', 'Pádel', 25.00, 'disponible', 'Pista de pádel profesional', 'https://example.com/padel1.jpg', true),
('pista-tenis-1', 'Pista Tenis 1', 'Tenis', 30.00, 'disponible', 'Pista de tenis tierra batida', 'https://example.com/tenis1.jpg', true),
('pista-futbol-sala', 'Pista Fútbol Sala', 'Fútbol Sala', 50.00, 'disponible', 'Pista de fútbol sala parquet', 'https://example.com/futsal.jpg', true),
('pista-baloncesto', 'Pista Baloncesto', 'Baloncesto', 45.00, 'disponible', 'Cancha de baloncesto', 'https://example.com/basket.jpg', true),
('sala-spinning', 'Sala Spinning', 'Spinning', 15.00, 'disponible', 'Sala de spinning con 20 bicicletas', 'https://example.com/spinning.jpg', true),
('sala-yoga', 'Sala Yoga', 'Yoga', 12.00, 'disponible', 'Sala de yoga y meditación', 'https://example.com/yoga.jpg', true);

-- ============================================
-- 3. CLUBS (3 clubs)
-- ============================================
INSERT INTO clubs (uid, slug, nombre, descripcion, deporte, imagen, entrenador_id, max_miembros, nivel, precio_mensual, status, is_active, created_at, updated_at) VALUES
(gen_random_uuid(), 'club-padel-avanzado', 'Club Pádel Avanzado', 'Club para jugadores experimentados', 'Pádel', 'https://example.com/club-padel.jpg', (SELECT id FROM usuarios WHERE slug = 'carlos-martinez'), 20, 'avanzado', 45.00, 'activo', true, NOW(), NOW()),
(gen_random_uuid(), 'club-tenis-iniciacion', 'Club Tenis Iniciación', 'Aprende tenis desde cero', 'Tenis', 'https://example.com/club-tenis.jpg', (SELECT id FROM usuarios WHERE slug = 'ana-garcia'), 15, 'principiante', 40.00, 'activo', true, NOW(), NOW()),
(gen_random_uuid(), 'club-spinning', 'Club Spinning Intensivo', 'Spinning de alta intensidad', 'Spinning', 'https://example.com/club-spinning.jpg', (SELECT id FROM usuarios WHERE slug = 'marta-lopez'), 25, 'intermedio', 35.00, 'activo', true, NOW(), NOW());

-- ============================================
-- 4. CLASES PÚBLICAS (6 clases GRATIS)
-- ============================================
INSERT INTO clases_publicas (uid, slug, nombre, descripcion, imagen, entrenador_id, pista_id, fecha_hora_inicio, fecha_hora_fin, duracion_minutos, max_participantes, precio, nivel, deporte, status, is_active, created_at, updated_at) VALUES
(gen_random_uuid(), 'yoga-principiantes-lun', 'Yoga Principiantes', 'Clase de yoga suave', 'https://example.com/yoga.jpg', (SELECT id FROM usuarios WHERE slug = 'luis-fernandez'), (SELECT id FROM pistas WHERE slug = 'sala-yoga'), '2026-01-27 10:00:00', '2026-01-27 11:00:00', 60, 15, 0.00, 'principiante', 'Yoga', 'programada', true, NOW(), NOW()),
(gen_random_uuid(), 'spinning-intenso-lun', 'Spinning Intenso', 'Alta intensidad', 'https://example.com/spinning.jpg', (SELECT id FROM usuarios WHERE slug = 'marta-lopez'), (SELECT id FROM pistas WHERE slug = 'sala-spinning'), '2026-01-27 18:00:00', '2026-01-27 19:00:00', 60, 20, 0.00, 'intermedio', 'Spinning', 'programada', true, NOW(), NOW()),
(gen_random_uuid(), 'padel-iniciacion-mar', 'Pádel Iniciación', 'Fundamentos de pádel', 'https://example.com/padel.jpg', (SELECT id FROM usuarios WHERE slug = 'carlos-martinez'), (SELECT id FROM pistas WHERE slug = 'pista-padel-1'), '2026-01-28 17:00:00', '2026-01-28 18:30:00', 90, 8, 0.00, 'principiante', 'Pádel', 'programada', true, NOW(), NOW()),
(gen_random_uuid(), 'tenis-avanzado-mie', 'Tenis Avanzado', 'Técnica avanzada', 'https://example.com/tenis.jpg', (SELECT id FROM usuarios WHERE slug = 'ana-garcia'), (SELECT id FROM pistas WHERE slug = 'pista-tenis-1'), '2026-01-29 19:00:00', '2026-01-29 20:30:00', 90, 6, 0.00, 'avanzado', 'Tenis', 'programada', true, NOW(), NOW()),
(gen_random_uuid(), 'futsal-recreativo-jue', 'Fútbol Sala Recreativo', 'Partido amistoso', 'https://example.com/futsal.jpg', (SELECT id FROM usuarios WHERE slug = 'javier-ruiz'), (SELECT id FROM pistas WHERE slug = 'pista-futbol-sala'), '2026-01-30 20:00:00', '2026-01-30 21:30:00', 90, 14, 0.00, 'principiante', 'Fútbol Sala', 'programada', true, NOW(), NOW()),
(gen_random_uuid(), 'yoga-vinyasa-vie', 'Yoga Vinyasa Flow', 'Secuencias dinámicas', 'https://example.com/vinyasa.jpg', (SELECT id FROM usuarios WHERE slug = 'luis-fernandez'), (SELECT id FROM pistas WHERE slug = 'sala-yoga'), '2026-01-31 11:00:00', '2026-01-31 12:00:00', 60, 12, 0.00, 'intermedio', 'Yoga', 'programada', true, NOW(), NOW());

-- ============================================
-- 5. RESERVAS (8 reservas)
-- ============================================
INSERT INTO reservas (uid, slug, pista_id, usuario_id, club_id, fecha_hora_inicio, fecha_hora_fin, precio, metodo_pago, status, is_active, notas, tipo_reserva, created_at, updated_at) VALUES
-- Reservas individuales
(gen_random_uuid(), 'reserva-maria-padel-27ene', (SELECT id FROM pistas WHERE slug = 'pista-padel-1'), (SELECT id FROM usuarios WHERE slug = 'maria-sanchez'), NULL, '2026-01-27 09:00:00', '2026-01-27 10:00:00', 25.00, 'efectivo', 'confirmada', true, 'Partido amistoso', 'individual', NOW(), NOW()),
(gen_random_uuid(), 'reserva-pedro-tenis-27ene', (SELECT id FROM pistas WHERE slug = 'pista-tenis-1'), (SELECT id FROM usuarios WHERE slug = 'pedro-gomez'), NULL, '2026-01-27 16:00:00', '2026-01-27 17:00:00', 30.00, 'tarjeta', 'confirmada', true, 'Entrenamiento', 'individual', NOW(), NOW()),
(gen_random_uuid(), 'reserva-david-futsal-28ene', (SELECT id FROM pistas WHERE slug = 'pista-futbol-sala'), (SELECT id FROM usuarios WHERE slug = 'david-rodriguez'), NULL, '2026-01-28 19:00:00', '2026-01-28 20:00:00', 50.00, 'transferencia', 'confirmada', true, 'Partido con amigos', 'individual', NOW(), NOW()),
(gen_random_uuid(), 'reserva-sofia-spinning-29ene', (SELECT id FROM pistas WHERE slug = 'sala-spinning'), (SELECT id FROM usuarios WHERE slug = 'sofia-hernandez'), NULL, '2026-01-29 18:00:00', '2026-01-29 19:00:00', 15.00, 'tarjeta', 'confirmada', true, NULL, 'individual', NOW(), NOW()),
(gen_random_uuid(), 'reserva-miguel-basket-30ene', (SELECT id FROM pistas WHERE slug = 'pista-baloncesto'), (SELECT id FROM usuarios WHERE slug = 'miguel-diaz'), NULL, '2026-01-30 10:00:00', '2026-01-30 11:00:00', 45.00, 'efectivo', 'confirmada', true, 'Entrenamiento equipo', 'individual', NOW(), NOW()),
-- Reserva de club
(gen_random_uuid(), 'reserva-alberto-club-01feb', (SELECT id FROM pistas WHERE slug = 'pista-padel-1'), (SELECT id FROM usuarios WHERE slug = 'alberto-jimenez'), (SELECT id FROM clubs WHERE slug = 'club-padel-avanzado'), '2026-02-01 08:00:00', '2026-02-01 09:30:00', 37.50, 'transferencia', 'confirmada', true, 'Entrenamiento club', 'club', NOW(), NOW()),
-- Reserva pendiente
(gen_random_uuid(), 'reserva-raul-tenis-02feb', (SELECT id FROM pistas WHERE slug = 'pista-tenis-1'), (SELECT id FROM usuarios WHERE slug = 'raul-torres'), NULL, '2026-02-02 10:00:00', '2026-02-02 11:30:00', 30.00, 'tarjeta', 'pendiente', true, 'Pendiente de pago', 'individual', NOW(), NOW()),
-- Reserva cancelada
(gen_random_uuid(), 'reserva-laura-yoga-03feb', (SELECT id FROM pistas WHERE slug = 'sala-yoga'), (SELECT id FROM usuarios WHERE slug = 'laura-martin'), NULL, '2026-02-03 09:00:00', '2026-02-03 10:00:00', 12.00, 'efectivo', 'cancelada', false, 'Cancelada por usuario', 'individual', NOW(), NOW());

-- ============================================
-- 6. PAGOS (generar para reservas confirmadas)
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

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================
SELECT 
    'DATOS INSERTADOS CORRECTAMENTE' AS mensaje,
    (SELECT COUNT(*) FROM usuarios) AS total_usuarios,
    (SELECT COUNT(*) FROM pistas) AS total_pistas,
    (SELECT COUNT(*) FROM clubs) AS total_clubs,
    (SELECT COUNT(*) FROM clases_publicas) AS total_clases,
    (SELECT COUNT(*) FROM reservas) AS total_reservas,
    (SELECT COUNT(*) FROM pagos) AS total_pagos;
