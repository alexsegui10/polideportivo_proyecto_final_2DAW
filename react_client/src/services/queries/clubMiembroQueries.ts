import { api } from '../api';
import { ClubMiembro, ClubSuscripcion } from '../../types';

export const getMiembrosByClubId = async (clubId: number): Promise<ClubMiembro[]> => {
  const response = await api.get<ClubMiembro[]>(`/api/club-miembros/club/${clubId}`);
  return response.data;
};

export const getSuscripcionesByClubId = async (clubId: number): Promise<ClubSuscripcion[]> => {
  const response = await api.get<ClubSuscripcion[]>(`/api/club-suscripciones/club/${clubId}`);
  return response.data;
};

export const getSuscripcionesByMiembroUid = async (miembroUid: string): Promise<ClubSuscripcion[]> => {
  const response = await api.get<ClubSuscripcion[]>(`/api/club-suscripciones/miembro/${miembroUid}`);
  return response.data;
};
