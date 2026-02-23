import { api } from '../api';
import { apiSpring } from '../apiSpring';
import { Pista, PistaSearchParams, PistaSearchResponse, Stats } from '../../types';

// Dashboard: usa SpringBoot
export const getPistas = async (): Promise<Pista[]> => {
  const response = await apiSpring.get<Pista[]>('/pistas');
  return response.data;
};

export const getPistaBySlug = async (slug: string): Promise<Pista> => {
  const response = await apiSpring.get<Pista>(`/pistas/${slug}`);
  return response.data;
};

export const searchPistas = async (params: PistaSearchParams): Promise<PistaSearchResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params.q) queryParams.set('q', params.q);
  if (params.tipo) queryParams.set('tipo', params.tipo);
  if (params.precioMax) queryParams.set('precioMax', String(params.precioMax));
  if (params.page) queryParams.set('page', String(params.page));
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.sort) queryParams.set('sort', params.sort);

  // Shop usa SpringBoot
  const response = await apiSpring.get<PistaSearchResponse>(`/pistas/search?${queryParams.toString()}`);
  return response.data;
};

export const getPistasStats = async (): Promise<Stats> => {
  // Home usa FastAPI
  const response = await api.get<Stats>('/api/pistas/stats');
  return response.data;
};

export const getPistasDestacadas = async (limit: number = 6): Promise<Pista[]> => {
  // Home usa FastAPI
  const response = await api.get<Pista[]>(`/api/pistas/destacadas?limit=${limit}`);
  return response.data;
};
