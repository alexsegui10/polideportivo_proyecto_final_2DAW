TRUNCATE TABLE pagos, clase_inscripciones, clase_waitlist, reservas, clases_publicas, club_suscripciones, clubs, pistas, usuarios RESTART IDENTITY CASCADE;

-- Usuarios (5 entrenadores + 5 clientes)
INSERT INTO usuarios (uid, slug, nombre, email, password_hash, role, is_active, created_at, updated_at) VALUES
(gen_random_uuid(), 'carlos-martinez', 'Carlos Martínez', 'carlos@emotivapoli.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'entrenador', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'laura-garcia', 'Laura García', 'laura@emotivapoli.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'entrenador', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'miguel-rodriguez', 'Miguel Rodríguez', 'miguel@emotivapoli.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'entrenador', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'ana-lopez', 'Ana López', 'ana@emotivapoli.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'entrenador', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'javier-sanchez', 'Javier Sánchez', 'javier@emotivapoli.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'entrenador', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'maria-fernandez', 'María Fernández', 'maria@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'cliente', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'pedro-gomez', 'Pedro Gómez', 'pedro@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'cliente', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'sofia-ruiz', 'Sofía Ruiz', 'sofia@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'cliente', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'david-moreno', 'David Moreno', 'david@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'cliente', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'lucia-jimenez', 'Lucía Jiménez', 'lucia@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'cliente', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Pistas (6 pistas)
INSERT INTO pistas (slug, nombre, tipo, precio_hora, is_active) VALUES
('padel-1', 'Pádel 1', 'Pádel', 25.00, true),
('tenis-1', 'Tenis 1', 'Tenis', 30.00, true),
('futsal-1', 'Fútbol Sala 1', 'Fútbol Sala', 50.00, true),
('basket-1', 'Baloncesto 1', 'Baloncesto', 45.00, true),
('spinning-1', 'Spinning 1', 'Spinning', 15.00, true),
('yoga-1', 'Yoga 1', 'Yoga', 12.00, true);

-- Clubs (3 clubs)
INSERT INTO clubs (uid, slug, nombre, deporte, precio_mensual, max_miembros, entrenador_id, is_active, created_at, updated_at) VALUES
(gen_random_uuid(), 'club-padel', 'Club Pádel', 'Pádel', 45.00, 30, (SELECT id FROM usuarios WHERE slug = 'carlos-martinez'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'club-tenis', 'Club Tenis', 'Tenis', 60.00, 20, (SELECT id FROM usuarios WHERE slug = 'laura-garcia'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'club-futsal', 'Club Fútbol Sala', 'Fútbol Sala', 35.00, 40, (SELECT id FROM usuarios WHERE slug = 'miguel-rodriguez'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Clases (4 clases gratuitas)
INSERT INTO clases_publicas (uid, slug, nombre, entrenador_id, pista_id, fecha_hora_inicio, fecha_hora_fin, duracion_minutos, max_participantes, precio, nivel, deporte, is_active, created_at, updated_at) VALUES
(gen_random_uuid(), 'yoga-lunes', 'Yoga Lunes', (SELECT id FROM usuarios WHERE slug = 'ana-lopez'), (SELECT id FROM pistas WHERE slug = 'yoga-1'), '2026-01-27 10:00:00', '2026-01-27 11:00:00', 60, 12, 0.00, 'principiante', 'Yoga', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'spinning-martes', 'Spinning Martes', (SELECT id FROM usuarios WHERE slug = 'javier-sanchez'), (SELECT id FROM pistas WHERE slug = 'spinning-1'), '2026-01-28 19:00:00', '2026-01-28 20:00:00', 60, 18, 0.00, 'avanzado', 'Spinning', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'padel-jueves', 'Pádel Jueves', (SELECT id FROM usuarios WHERE slug = 'carlos-martinez'), (SELECT id FROM pistas WHERE slug = 'padel-1'), '2026-01-30 17:00:00', '2026-01-30 18:30:00', 90, 8, 0.00, 'intermedio', 'Pádel', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'tenis-viernes', 'Tenis Viernes', (SELECT id FROM usuarios WHERE slug = 'laura-garcia'), (SELECT id FROM pistas WHERE slug = 'tenis-1'), '2026-01-31 11:00:00', '2026-01-31 12:30:00', 90, 6, 0.00, 'principiante', 'Tenis', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Reservas (6 reservas)
INSERT INTO reservas (uid, slug, pista_id, usuario_id, club_id, fecha_hora_inicio, fecha_hora_fin, precio, metodo_pago, status, tipo_reserva, is_active, created_at, updated_at) VALUES
(gen_random_uuid(), 'res-1', (SELECT id FROM pistas WHERE slug = 'padel-1'), (SELECT id FROM usuarios WHERE slug = 'maria-fernandez'), NULL, '2026-01-27 09:00:00', '2026-01-27 10:30:00', 37.50, 'tarjeta', 'confirmada', 'individual', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'res-2', (SELECT id FROM pistas WHERE slug = 'tenis-1'), (SELECT id FROM usuarios WHERE slug = 'pedro-gomez'), NULL, '2026-01-27 12:00:00', '2026-01-27 13:00:00', 30.00, 'bizum', 'confirmada', 'individual', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'res-3', (SELECT id FROM pistas WHERE slug = 'futsal-1'), (SELECT id FROM usuarios WHERE slug = 'david-moreno'), (SELECT id FROM clubs WHERE slug = 'club-futsal'), '2026-01-28 20:00:00', '2026-01-28 21:30:00', 75.00, 'transferencia', 'confirmada', 'club', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'res-4', (SELECT id FROM pistas WHERE slug = 'spinning-1'), (SELECT id FROM usuarios WHERE slug = 'sofia-ruiz'), NULL, '2026-01-28 10:00:00', '2026-01-28 11:00:00', 15.00, 'tarjeta', 'pendiente', 'individual', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'res-5', (SELECT id FROM pistas WHERE slug = 'basket-1'), (SELECT id FROM usuarios WHERE slug = 'lucia-jimenez'), NULL, '2026-01-29 18:00:00', '2026-01-29 20:00:00', 90.00, 'efectivo', 'confirmada', 'individual', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'res-6', (SELECT id FROM pistas WHERE slug = 'tenis-1'), (SELECT id FROM usuarios WHERE slug = 'pedro-gomez'), (SELECT id FROM clubs WHERE slug = 'club-tenis'), '2026-01-25 16:00:00', '2026-01-25 17:30:00', 45.00, 'tarjeta', 'completada', 'club', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Pagos (solo de reservas completadas)
INSERT INTO pagos (uid, usuario_id, reserva_id, amount, provider, status, is_active, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    r.usuario_id,
    r.id,
    r.precio,
    CASE r.metodo_pago
        WHEN 'tarjeta' THEN 'stripe'
        WHEN 'transferencia' THEN 'transferencia'
        ELSE 'efectivo'
    END,
    'completado',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM reservas r
WHERE r.status = 'completada';
