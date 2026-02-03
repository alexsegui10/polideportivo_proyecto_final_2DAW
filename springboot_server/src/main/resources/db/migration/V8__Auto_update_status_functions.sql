-- Función para actualizar estados automáticamente basándose en fecha/hora
-- Se ejecuta más eficientemente usando un índice parcial

-- Función para actualizar estados de clases
CREATE OR REPLACE FUNCTION actualizar_estado_clases()
RETURNS void AS $$
BEGIN
  -- Marcar como 'en_curso' SOLO las clases CONFIRMADAS que ya empezaron pero no terminaron
  -- Las clases en 'pendiente' NO pasan a 'en_curso'
  UPDATE clases_publicas
  SET status = 'en_curso', updated_at = CURRENT_TIMESTAMP
  WHERE is_active = true
    AND status = 'confirmado'
    AND fecha_hora_inicio <= CURRENT_TIMESTAMP
    AND fecha_hora_fin > CURRENT_TIMESTAMP;

  -- Marcar como 'completado' las clases que ya terminaron (solo si estaban confirmadas o en_curso)
  UPDATE clases_publicas
  SET status = 'completado', updated_at = CURRENT_TIMESTAMP
  WHERE is_active = true
    AND status IN ('confirmado', 'en_curso')
    AND fecha_hora_fin <= CURRENT_TIMESTAMP;
    
  -- Las clases en 'pendiente' que pasaron su fecha_hora_fin se marcan como 'cancelado'
  UPDATE clases_publicas
  SET status = 'cancelado', updated_at = CURRENT_TIMESTAMP
  WHERE is_active = true
    AND status = 'pendiente'
    AND fecha_hora_fin <= CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar estados de reservas
CREATE OR REPLACE FUNCTION actualizar_estado_reservas()
RETURNS void AS $$
BEGIN
  -- Marcar como 'en_curso' SOLO las reservas CONFIRMADAS que ya empezaron pero no terminaron
  -- Las reservas en 'pendiente' NO pasan a 'en_curso'
  UPDATE reservas
  SET status = 'en_curso', updated_at = CURRENT_TIMESTAMP
  WHERE is_active = true
    AND status = 'confirmada'
    AND fecha_hora_inicio <= CURRENT_TIMESTAMP
    AND fecha_hora_fin > CURRENT_TIMESTAMP;

  -- Marcar como 'completada' las reservas que ya terminaron (solo si estaban confirmadas o en_curso)
  UPDATE reservas
  SET status = 'completada', updated_at = CURRENT_TIMESTAMP
  WHERE is_active = true
    AND status IN ('confirmada', 'en_curso')
    AND fecha_hora_fin <= CURRENT_TIMESTAMP;
    
  -- Las reservas en 'pendiente' que pasaron su fecha_hora_fin se marcan como 'cancelada'
  UPDATE reservas
  SET status = 'cancelada', updated_at = CURRENT_TIMESTAMP
  WHERE is_active = true
    AND status = 'pendiente'
    AND fecha_hora_fin <= CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Trigger que se ejecuta cada 15 minutos (usando pg_cron si está disponible)
-- Si no tienes pg_cron, puedes llamar estas funciones desde tu aplicación

-- Comentario: Para mayor eficiencia, ejecuta estas funciones:
-- 1. Al cargar el calendario (una vez por sesión)
-- 2. Cuando se abre un detalle de clase/reserva
-- 3. Opcionalmente: cada 15 min con pg_cron o un scheduled task

COMMENT ON FUNCTION actualizar_estado_clases() IS 
'Actualiza estados de clases automáticamente:
- confirmado -> en_curso (cuando empieza)
- confirmado/en_curso -> completado (cuando termina)
- pendiente -> cancelado (si pasa la fecha sin confirmarse)';

COMMENT ON FUNCTION actualizar_estado_reservas() IS 
'Actualiza estados de reservas automáticamente:
- confirmada -> en_curso (cuando empieza)
- confirmada/en_curso -> completada (cuando termina)
- pendiente -> cancelada (si pasa la fecha sin confirmarse)';
