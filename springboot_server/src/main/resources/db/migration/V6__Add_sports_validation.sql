-- Migration: Add CHECK constraints for sports validation
-- Añade validación de deportes en pistas, clubs y clases

-- Añadir CHECK constraint para pistas.tipo
ALTER TABLE pistas 
ADD CONSTRAINT chk_pistas_tipo 
CHECK (tipo IN ('Pádel', 'Tenis', 'Fútbol Sala', 'Baloncesto', 'Spinning', 'Yoga'));

-- Añadir CHECK constraint para clubs.deporte
ALTER TABLE clubs 
ADD CONSTRAINT chk_clubs_deporte 
CHECK (deporte IN ('Pádel', 'Tenis', 'Fútbol Sala', 'Baloncesto', 'Spinning', 'Yoga'));

-- Añadir CHECK constraint para clases_publicas.deporte
ALTER TABLE clases_publicas 
ADD CONSTRAINT chk_clases_deporte 
CHECK (deporte IN ('Pádel', 'Tenis', 'Fútbol Sala', 'Baloncesto', 'Spinning', 'Yoga'));
