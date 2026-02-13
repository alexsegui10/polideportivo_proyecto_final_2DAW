import { apiSpring as api } from '../apiSpring';
import { ClaseInscripcion, ClaseWaitlist } from '../../types';

export interface InscripcionCreateRequest {
  claseId: number;
  usuarioId: number;
  precioPagado?: number;
  metodoPago?: string;
}

export interface WaitlistCreateRequest {
  claseId: number;
  usuarioId: number;
}

export const inscribirUsuario = async (data: InscripcionCreateRequest): Promise<ClaseInscripcion> => {
  const response = await api.post<ClaseInscripcion>('/api/clase-inscripciones', data);
  return response.data;
};

export const cancelarInscripcion = async (uid: string, cancelReason?: string): Promise<void> => {
  const params = cancelReason ? { cancelReason } : {};
  await api.patch(`/api/clase-inscripciones/${uid}/cancelar`, null, { params });
};

export const eliminarInscripcion = async (uid: string): Promise<void> => {
  await api.delete(`/api/clase-inscripciones/${uid}`);
};

export const marcarAsistencia = async (uid: string, asistio: boolean): Promise<void> => {
  await api.patch(`/api/clase-inscripciones/${uid}/asistencia`, null, {
    params: { asistio }
  });
};

export const agregarAWaitlist = async (data: WaitlistCreateRequest): Promise<ClaseWaitlist> => {
  const response = await api.post<ClaseWaitlist>('/api/clase-waitlist', data);
  return response.data;
};

export const quitarDeWaitlist = async (uid: string): Promise<void> => {
  await api.delete(`/api/clase-waitlist/${uid}`);
};
