import { api } from '../api';
import { apiSpring } from '../apiSpring';
import { ClasePublica, ClaseSearchParams, ClaseSearchResponse, Stats } from '../../types';

/**
 * Obtener todas las clases - Dashboard usa SpringBoot
 */
export const getClases = async (): Promise<ClasePublica[]> => {
  const response = await apiSpring.get('/clases');
  return response.data;
};

/**
 * Obtener clase por slug - Dashboard usa SpringBoot
 */
export const getClaseBySlug = async (slug: string): Promise<ClasePublica> => {
  const response = await apiSpring.get(`/clases/${slug}`);
  return response.data;
};

/**
 * Buscar clases con filtros y paginación - Shop usa SpringBoot
 */
export const searchClases = async (params: ClaseSearchParams): Promise<ClaseSearchResponse> => {
  const queryParams = new URLSearchParams();
  if (params.q) queryParams.set('q', params.q);
  if (params.deporte) queryParams.set('deporte', params.deporte);
  if (params.nivel) queryParams.set('nivel', params.nivel);
  if (params.precioMax) queryParams.set('precioMax', String(params.precioMax));
  if (params.page) queryParams.set('page', String(params.page));
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.sort) queryParams.set('sort', params.sort);
  const response = await apiSpring.get<ClaseSearchResponse>(`/clases/search?${queryParams.toString()}`);
  return response.data;
};

/**
 * Obtener estadísticas de clases (total entrenadores) - Home usa FastAPI
 */
export const getClasesStats = async (): Promise<Stats> => {
  const response = await api.get<Stats>('/api/clases/stats');
  return response.data;
};

/**
 * Obtener clases por fecha (hoy o mañana) - Home usa FastAPI
 */
export const getClasesPorFecha = async (fecha: 'hoy' | 'mañana'): Promise<ClasePublica[]> => {
  const response = await api.get<ClasePublica[]>(`/api/clases?fecha=${fecha}`);
  return response.data;
};
