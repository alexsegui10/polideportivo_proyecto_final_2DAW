/**
 * Hook para gestión de perfiles públicos
 * Los perfiles se acceden por slug, NO por ID
 */

import { useQuery } from '@tanstack/react-query';
import { getProfileBySlug } from '../../services/queries/profileQueries';

/**
 * Hook para obtener perfil público por slug
 */
export const useProfile = (slug: string) => {
  return useQuery({
    queryKey: ['profile', slug],
    queryFn: () => getProfileBySlug(slug),
    enabled: !!slug, // Solo ejecutar si hay slug
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
