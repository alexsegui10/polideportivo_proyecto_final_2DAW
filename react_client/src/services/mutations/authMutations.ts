/**
 * Mutations de autenticación (escritura)
 */

import { apiSpring, authChannel } from '../apiSpring';
import { JwtService } from '../JwtService';

export interface RegisterRequest {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  telefono?: string;
  dni?: string;
  fechaNacimiento?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  usuario: {
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
  };
}

/** Registrar nuevo usuario */
export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await apiSpring.post<AuthResponse>('/auth/register', data, {
    headers: { 'X-Device-Id': JwtService.getDeviceId() },
  });

  if (response.data.accessToken) {
    JwtService.saveToken(response.data.accessToken);
  }
  return response.data;
};

/** Login de usuario */
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await apiSpring.post<AuthResponse>('/auth/login', data, {
    headers: { 'X-Device-Id': JwtService.getDeviceId() },
  });

  if (response.data.accessToken) {
    JwtService.saveToken(response.data.accessToken);
  }
  return response.data;
};

/**
 * Logout: llama al backend para invalidar la sesión en DB y borrar la cookie HttpOnly.
 * Después avisa a otras pestañas con BroadcastChannel.
 */
export const logout = async (): Promise<void> => {
  try {
    await apiSpring.post('/auth/logout');
  } catch {
    // Si el access token ya expiró el backend igual borrará la cookie por la cookie sola
  } finally {
    JwtService.destroyToken();
    authChannel.postMessage({ type: 'LOGOUT' });
  }
};
