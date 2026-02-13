import { apiSpring as api } from '../apiSpring';
import { ClasePublica, ClaseCreateRequest, ClaseUpdateRequest } from '../../types';

/**
 * Crear nueva clase
 */
export const createClase = async (clase: ClaseCreateRequest): Promise<ClasePublica> => {
  const response = await api.post('/api/clases', clase);
  return response.data;
};

/**
 * Actualizar clase existente
 */
export const updateClase = async (slug: string, clase: ClaseUpdateRequest): Promise<ClasePublica> => {
  const response = await api.put(`/api/clases/${slug}`, clase);
  return response.data;
};

/**
 * Eliminar clase (soft delete via PATCH)
 */
export const deleteClase = async (slug: string): Promise<void> => {
  await api.patch(`/api/clases/${slug}/soft-delete`);
};
