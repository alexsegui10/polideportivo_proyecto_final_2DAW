/**
 * Queries de perfil (lectura pública)
 * Los perfiles son públicos y se acceden por slug
 */

import { apiSpring } from '../apiSpring';
import { ProfileResponse } from '../../types';

/**
 * Obtener perfil público por slug
 * NO requiere autenticación - endpoint público
 */
export const getProfileBySlug = async (slug: string): Promise<ProfileResponse> => {
  const response = await apiSpring.get<ProfileResponse>(`/profile/${slug}`);
  return response.data;
};
