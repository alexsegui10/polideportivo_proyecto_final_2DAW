import { api } from '../api';
import { ClasePublica } from '../../types';

/**
 * Obtener todas las clases
 */
export const getClases = async (): Promise<ClasePublica[]> => {
  const response = await api.get('/api/clases');
  return response.data;
};

/**
 * Obtener clase por slug
 */
export const getClaseBySlug = async (slug: string): Promise<ClasePublica> => {
  const response = await api.get(`/api/clases/${slug}`);
  return response.data;
};
