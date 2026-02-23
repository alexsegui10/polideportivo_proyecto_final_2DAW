import { apiSpring as api } from '../apiSpring';
import { ClaseInscripcion, ClaseWaitlist } from '../../types';

export const getInscritosByClaseId = async (claseId: number): Promise<ClaseInscripcion[]> => {
  const response = await api.get<ClaseInscripcion[]>(`/clase-inscripciones/clase/${claseId}`);
  return response.data;
};

export const getClasesByUsuarioId = async (usuarioId: number): Promise<ClaseInscripcion[]> => {
  const response = await api.get<ClaseInscripcion[]>(`/clase-inscripciones/usuario/${usuarioId}`);
  return response.data;
};

export const getWaitlistByClaseId = async (claseId: number): Promise<ClaseWaitlist[]> => {
  const response = await api.get<ClaseWaitlist[]>(`/clase-waitlist/clase/${claseId}`);
  return response.data;
};
