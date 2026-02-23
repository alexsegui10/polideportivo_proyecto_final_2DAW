/**
 * Queries de autenticación (lectura)
 * Separado de mutations siguiendo arquitectura del proyecto
 */

import { apiSpring } from '../apiSpring';

export interface UsuarioResponse {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  slug: string;
  telefono?: string;
  dni?: string;
  fechaNacimiento?: string;
  avatar?: string;
  role: string;
  status: string;
  isActive: boolean;
  especialidad?: string;
  certificaciones?: string[];
  bio?: string;
  direccion?: string;
  ciudad?: string;
  codigoPostal?: string;
  fechaCreacion: string;
  ultimaActualizacion: string;
}

/**
 * Obtener usuario autenticado actual
 * Requiere token JWT en header (gestionado por interceptor)
 */
export const getCurrentUser = async (): Promise<UsuarioResponse> => {
  const response = await apiSpring.get<UsuarioResponse>('/usuario');
  return response.data;
};
