import { api } from '../api';
import { ClubMiembro, ClubSuscripcion } from '../../types';

export interface MiembroCreateRequest {
  clubId: number;
  usuarioId: number;
}

export interface SuscripcionCreateRequest {
  miembroUid: string;
  precioMensual?: number;
}

export const inscribirMiembro = async (data: MiembroCreateRequest): Promise<ClubMiembro> => {
  const response = await api.post<ClubMiembro>('/api/club-miembros', data);
  return response.data;
};

export const darDeBajaMiembro = async (uid: string): Promise<void> => {
  await api.patch(`/api/club-miembros/${uid}/baja`);
};

export const expulsarMiembro = async (uid: string): Promise<void> => {
  await api.patch(`/api/club-miembros/${uid}/expulsar`);
};

export const reactivarMiembro = async (uid: string): Promise<ClubMiembro> => {
  const response = await api.patch<ClubMiembro>(`/api/club-miembros/${uid}/reactivar`);
  return response.data;
};

export const crearSuscripcion = async (data: SuscripcionCreateRequest): Promise<ClubSuscripcion> => {
  const response = await api.post<ClubSuscripcion>('/api/club-suscripciones', data);
  return response.data;
};

export const cancelarSuscripcion = async (uid: string): Promise<void> => {
  await api.patch(`/api/club-suscripciones/${uid}/cancelar`);
};

export const pausarSuscripcion = async (uid: string): Promise<void> => {
  await api.patch(`/api/club-suscripciones/${uid}/pausar`);
};

export const reanudarSuscripcion = async (uid: string): Promise<void> => {
  await api.patch(`/api/club-suscripciones/${uid}/reanudar`);
};
