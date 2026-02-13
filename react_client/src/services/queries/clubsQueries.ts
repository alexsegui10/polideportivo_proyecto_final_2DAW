import { api } from '../api';
import { apiSpring } from '../apiSpring';
import { Club, Stats } from '../../types';

/**
 * Obtener todos los clubs - Dashboard usa SpringBoot
 */
export const getClubs = async (): Promise<Club[]> => {
  const response = await apiSpring.get('/api/clubs');
  return response.data;
};

/**
 * Obtener club por slug - Dashboard usa SpringBoot
 */
export const getClubBySlub = async (slug: string): Promise<Club> => {
  const response = await apiSpring.get(`/api/clubs/${slug}`);
  return response.data;
};

/**
 * Obtener estadísticas de clubs (total) - Home usa FastAPI
 */
export const getClubsStats = async (): Promise<Stats> => {
  const response = await api.get<Stats>('/api/clubs/stats');
  return response.data;
};
