import { apiSpring as api } from '../apiSpring';
import { Pista, PistaRequest } from '../../types';

// POST - Crear nueva pista
export const createPista = async (pista: PistaRequest): Promise<Pista> => {
  const response = await api.post<Pista>('/pistas', pista);
  return response.data;
};

// PUT - Actualizar pista
export const updatePista = async (slug: string, pista: PistaRequest): Promise<Pista> => {
  const response = await api.put<Pista>(`/pistas/${slug}`, pista);
  return response.data;
};

// DELETE - Eliminar pista
export const deletePista = async (slug: string): Promise<void> => {
  await api.delete(`/pistas/${slug}`);
};
