import { api } from '../api';
import { apiSpring } from '../apiSpring';
import { Club, ClubSearchParams, ClubSearchResponse, Stats } from '../../types';

/**
 * Obtener todos los clubs - Dashboard usa SpringBoot
 */
export const getClubs = async (): Promise<Club[]> => {
  const response = await apiSpring.get('/clubs');
  return response.data;
};

/**
 * Obtener club por slug - Dashboard usa SpringBoot
 */
export const getClubBySlub = async (slug: string): Promise<Club> => {
  const response = await apiSpring.get(`/clubs/${slug}`);
  return response.data;
};

/**
 * Buscar clubs con filtros y paginación - Shop usa SpringBoot
 */
export const searchClubs = async (params: ClubSearchParams): Promise<ClubSearchResponse> => {
  const queryParams = new URLSearchParams();
  if (params.q) queryParams.set('q', params.q);
  if (params.deporte) queryParams.set('deporte', params.deporte);
  if (params.nivel) queryParams.set('nivel', params.nivel);
  if (params.precioMax) queryParams.set('precioMax', String(params.precioMax));
  if (params.page) queryParams.set('page', String(params.page));
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.sort) queryParams.set('sort', params.sort);
  const response = await apiSpring.get<ClubSearchResponse>(`/clubs/search?${queryParams.toString()}`);
  return response.data;
};

/**
 * Obtener estadísticas de clubs (total) - Home usa FastAPI
 */
export const getClubsStats = async (): Promise<Stats> => {
  const response = await api.get<Stats>('/api/clubs/stats');
  return response.data;
};
