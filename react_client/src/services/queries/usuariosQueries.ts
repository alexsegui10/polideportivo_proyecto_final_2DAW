import { api } from '../api';
import { Usuario } from '../../types';

/**
 * Obtener todos los usuarios
 */
export const getUsuarios = async (): Promise<Usuario[]> => {
  const response = await api.get('/api/usuarios');
  return response.data;
};

/**
 * Obtener usuario por slug
 */
export const getUsuarioBySlug = async (slug: string): Promise<Usuario> => {
  const response = await api.get(`/api/usuarios/${slug}`);
  return response.data;
};

/**
 * Obtener usuarios por role
 */
export const getUsuariosByRole = async (role: string): Promise<Usuario[]> => {
  const response = await api.get(`/api/usuarios/role/${role}`);
  return response.data;
};
