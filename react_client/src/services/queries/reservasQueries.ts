import { apiSpring as api } from '../apiSpring';
import { Reserva, ReservaWithPago } from '../../types';

/**
 * Obtener todas las reservas
 */
export const getReservas = async (): Promise<Reserva[]> => {
  const response = await api.get('/api/reservas');
  return response.data;
};

/**
 * Obtener reserva por slug (incluye info de pago)
 */
export const getReservaBySlug = async (slug: string): Promise<ReservaWithPago> => {
  const response = await api.get(`/api/reservas/${slug}`);
  return response.data;
};
