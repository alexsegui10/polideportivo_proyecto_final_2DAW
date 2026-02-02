import { api } from '../api';
import { Pista } from '../../types';

export const getPistas = async (): Promise<Pista[]> => {
  const response = await api.get<Pista[]>('/api/pistas');
  return response.data;
};

export const getPistaBySlug = async (slug: string): Promise<Pista> => {
  const response = await api.get<Pista>(`/api/pistas/${slug}`);
  return response.data;
};