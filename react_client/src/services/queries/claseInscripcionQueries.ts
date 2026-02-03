import { api } from '../api';
import { ClaseInscripcion, ClaseWaitlist } from '../../types';

export const getInscritosByClaseId = async (claseId: number): Promise<ClaseInscripcion[]> => {
  const response = await api.get<ClaseInscripcion[]>(`/api/clase-inscripciones/clase/${claseId}`);
  return response.data;
};

export const getClasesByUsuarioId = async (usuarioId: number): Promise<ClaseInscripcion[]> => {
  const response = await api.get<ClaseInscripcion[]>(`/api/clase-inscripciones/usuario/${usuarioId}`);
  return response.data;
};

export const getWaitlistByClaseId = async (claseId: number): Promise<ClaseWaitlist[]> => {
  const response = await api.get<ClaseWaitlist[]>(`/api/clase-waitlist/clase/${claseId}`);
  return response.data;
};
