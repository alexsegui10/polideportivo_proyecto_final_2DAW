-- ============================================
-- MIGRACIÓN V5: Actualización Automática de Estados de Reservas
-- ============================================

-- Función para actualizar automáticamente los estados de las reservas
CREATE OR REPLACE FUNCTION actualizar_estados_reservas()
RETURNS TABLE(
    reservas_completadas INTEGER,
    reservas_canceladas INTEGER
) AS $$
DECLARE
    count_completadas INTEGER;
    count_canceladas INTEGER;
BEGIN
    -- 1. Marcar como COMPLETADAS las reservas confirmadas cuya fecha_hora_fin ya pasó
    UPDATE reservas
    SET 
        status = 'completada',
        updated_at = CURRENT_TIMESTAMP
    WHERE 
        status = 'confirmada'
        AND fecha_hora_fin < CURRENT_TIMESTAMP
        AND is_active = TRUE;
    
    GET DIAGNOSTICS count_completadas = ROW_COUNT;
    
    -- 2. Marcar como CANCELADAS las reservas pendientes cuya fecha_hora_inicio ya pasó
    UPDATE reservas
    SET 
        status = 'cancelada',
        updated_at = CURRENT_TIMESTAMP,
        notas = COALESCE(notas || ' | ', '') || 'Cancelada automáticamente por expiración'
    WHERE 
        status = 'pendiente'
        AND fecha_hora_inicio < CURRENT_TIMESTAMP
        AND is_active = TRUE;
    
    GET DIAGNOSTICS count_canceladas = ROW_COUNT;
    
    -- Retornar el conteo de registros actualizados
    RETURN QUERY SELECT count_completadas, count_canceladas;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION actualizar_estados_reservas() IS 'Actualiza automáticamente los estados de reservas: confirmada→completada (si terminó), pendiente→cancelada (si expiró)';

