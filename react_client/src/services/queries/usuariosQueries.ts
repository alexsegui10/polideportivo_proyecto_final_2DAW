import { apiSpring as api } from '../apiSpring';
import { Usuario } from '../../types';

/**
 * Obtener todos los usuarios
 */
export const getUsuarios = async (): Promise<Usuario[]> => {
  const response = await api.get('/usuarios');
  return response.data;
};

/**
 * Obtener usuario por slug
 */
export const getUsuarioBySlug = async (slug: string): Promise<Usuario> => {
  const response = await api.get(`/usuarios/${slug}`);
  return response.data;
};

/**
 * Obtener usuarios por role
 */
export const getUsuariosByRole = async (role: string): Promise<Usuario[]> => {
  const response = await api.get(`/usuarios/role/${role}`);
  return response.data;
};
