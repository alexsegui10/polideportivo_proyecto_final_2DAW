import { api } from '../api';
import { Club } from '../../types';

/**
 * Obtener todos los clubs
 */
export const getClubs = async (): Promise<Club[]> => {
  const response = await api.get('/api/clubs');
  return response.data;
};

/**
 * Obtener club por slug
 */
export const getClubBySlug = async (slug: string): Promise<Club> => {
  const response = await api.get(`/api/clubs/${slug}`);
  return response.data;
};
