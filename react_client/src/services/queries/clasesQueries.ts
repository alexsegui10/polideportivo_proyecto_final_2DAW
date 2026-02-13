import { api } from '../api';
import { apiSpring } from '../apiSpring';
import { ClasePublica, Stats } from '../../types';

/**
 * Obtener todas las clases - Dashboard usa SpringBoot
 */
export const getClases = async (): Promise<ClasePublica[]> => {
  const response = await apiSpring.get('/api/clases');
  return response.data;
};

/**
 * Obtener clase por slug - Dashboard usa SpringBoot
 */
export const getClaseBySlug = async (slug: string): Promise<ClasePublica> => {
  const response = await apiSpring.get(`/api/clases/${slug}`);
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
