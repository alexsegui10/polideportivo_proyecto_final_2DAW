import { api } from '../api';
import { Pista, PistaRequest } from '../../types';

// POST - Crear nueva pista
export const createPista = async (pista: PistaRequest): Promise<Pista> => {
  const response = await api.post<Pista>('/api/pistas', pista);
  return response.data;
};

// PUT - Actualizar pista
export const updatePista = async (slug: string, pista: PistaRequest): Promise<Pista> => {
  const response = await api.put<Pista>(`/api/pistas/${slug}`, pista);
  return response.data;
};

// DELETE - Eliminar pista
export const deletePista = async (slug: string): Promise<void> => {
  await api.delete(`/api/pistas/${slug}`);
};
