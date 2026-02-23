import { apiSpring as api } from '../apiSpring';
import { Club, ClubCreateRequest, ClubUpdateRequest } from '../../types';

/**
 * Crear nuevo club
 */
export const createClub = async (club: ClubCreateRequest): Promise<Club> => {
  const response = await api.post('/clubs', club);
  return response.data;
};

/**
 * Actualizar club existente
 */
export const updateClub = async (slug: string, club: ClubUpdateRequest): Promise<Club> => {
  const response = await api.put(`/clubs/${slug}`, club);
  return response.data;
};

/**
 * Eliminar club (soft delete via PATCH)
 */
export const deleteClub = async (slug: string): Promise<void> => {
  await api.patch(`/clubs/${slug}/soft-delete`);
};
