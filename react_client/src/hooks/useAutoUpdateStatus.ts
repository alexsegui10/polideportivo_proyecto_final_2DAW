import { useEffect } from 'react';
import { apiSpring as api } from '../services/apiSpring';

/**
 * Hook para actualizar automáticamente los estados de clases y reservas
 * basándose en fecha/hora actual.
 * 
 * Llama a las funciones SQL que actualizan:
 * - pendiente/confirmado -> en_curso (si ya empezó)
 * - en_curso -> completado (si ya terminó)
 */
export const useAutoUpdateStatus = () => {
  useEffect(() => {
    const actualizarEstados = async () => {
      try {
        // Llamar a las funciones SQL que actualizan estados
        await api.post('/api/utils/actualizar-estados');
      } catch (error) {
        console.error('Error al actualizar estados automáticamente:', error);
      }
    };

    // Actualizar al montar el componente
    actualizarEstados();

    // Actualizar cada 5 minutos
    const interval = setInterval(actualizarEstados, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
};
