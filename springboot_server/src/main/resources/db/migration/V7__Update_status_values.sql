-- Actualizar estados de clases_publicas
-- De: 'disponible', 'completa', 'cancelada', 'en_proceso'
-- A: 'pendiente', 'confirmado', 'en_curso', 'completado', 'cancelado'

-- Primero eliminar el constraint actual
ALTER TABLE clases_publicas DROP CONSTRAINT IF EXISTS clases_publicas_status_check;

-- IMPORTANTE: Migrar datos ANTES de agregar el nuevo constraint
UPDATE clases_publicas 
SET status = CASE 
  WHEN status = 'disponible' THEN 'pendiente'
  WHEN status = 'en_proceso' THEN 'en_curso'
  WHEN status = 'completa' THEN 'completado'
  WHEN status = 'cancelada' THEN 'cancelado'
  ELSE 'pendiente'
END
WHERE status NOT IN ('pendiente', 'confirmado', 'en_curso', 'completado', 'cancelado');

-- Ahora sí agregar el nuevo constraint con los datos ya migrados
ALTER TABLE clases_publicas 
ADD CONSTRAINT clases_publicas_status_check 
CHECK (status IN ('pendiente', 'confirmado', 'en_curso', 'completado', 'cancelado'));

-- Actualizar estados de reservas para incluir 'en_curso'
-- De: 'pendiente', 'confirmada', 'completada', 'cancelada', 'eliminado'
-- A: 'pendiente', 'confirmada', 'en_curso', 'completada', 'cancelada', 'no_show'

ALTER TABLE reservas DROP CONSTRAINT IF EXISTS reservas_status_check;

-- IMPORTANTE: Migrar datos ANTES de agregar el nuevo constraint
-- Migrar 'eliminado' a 'cancelada' (unificar estados)
UPDATE reservas
SET status = 'cancelada'
WHERE status = 'eliminado';

-- Ahora sí agregar el nuevo constraint con los datos ya migrados
ALTER TABLE reservas 
ADD CONSTRAINT reservas_status_check 
CHECK (status IN ('pendiente', 'confirmada', 'en_curso', 'completada', 'cancelada', 'no_show'));

-- Crear índices para mejorar rendimiento en consultas por status
CREATE INDEX IF NOT EXISTS idx_clases_status ON clases_publicas(status) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_reservas_status ON reservas(status) WHERE is_active = true;

-- Comentarios explicativos
COMMENT ON CONSTRAINT clases_publicas_status_check ON clases_publicas IS 
'Estados: pendiente (creada), confirmado (con inscritos), en_curso (empezó), completado (terminó), cancelado';

COMMENT ON CONSTRAINT reservas_status_check ON reservas IS 
'Estados: pendiente (creada), confirmada (pagada), en_curso (empezó), completada (terminó), cancelada, no_show (no apareció)';
