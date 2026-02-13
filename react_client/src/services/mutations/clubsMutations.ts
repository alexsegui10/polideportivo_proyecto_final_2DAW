import { apiSpring as api } from '../apiSpring';
import { Club, ClubCreateRequest, ClubUpdateRequest } from '../../types';

/**
 * Crear nuevo club
 */
export const createClub = async (club: ClubCreateRequest): Promise<Club> => {
  const response = await api.post('/api/clubs', club);
  return response.data;
};

/**
 * Actualizar club existente
 */
export const updateClub = async (slug: string, club: ClubUpdateRequest): Promise<Club> => {
  const response = await api.put(`/api/clubs/${slug}`, club);
  return response.data;
};

/**
 * Eliminar club (soft delete via PATCH)
 */
export const deleteClub = async (slug: string): Promise<void> => {
  await api.patch(`/api/clubs/${slug}/soft-delete`);
};
