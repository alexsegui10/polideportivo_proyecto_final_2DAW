import { apiSpring as api } from '../apiSpring';
import { Usuario, UsuarioCreateRequest, UsuarioUpdateRequest } from '../../types';

/**
 * Crear nuevo usuario
 */
export const createUsuario = async (usuario: UsuarioCreateRequest): Promise<Usuario> => {
  const response = await api.post('/usuarios', usuario);
  return response.data;
};

/**
 * Actualizar usuario existente
 */
export const updateUsuario = async (slug: string, usuario: UsuarioUpdateRequest): Promise<Usuario> => {
  const response = await api.put(`/usuarios/${slug}`, usuario);
  return response.data;
};

/**
 * Eliminar usuario (soft delete via PATCH)
 */
export const deleteUsuario = async (slug: string): Promise<void> => {
  await api.patch(`/usuarios/${slug}/soft-delete`);
};
