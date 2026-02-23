import { apiSpring as api } from '../apiSpring';
import { Reserva, ReservaCreateRequest, ReservaUpdateRequest } from '../../types';

/**
 * Crear nueva reserva
 */
export const createReserva = async (reserva: ReservaCreateRequest): Promise<Reserva> => {
  const response = await api.post('/reservas', reserva);
  return response.data;
};

/**
 * Actualizar reserva existente
 */
export const updateReserva = async (slug: string, reserva: ReservaUpdateRequest): Promise<Reserva> => {
  const response = await api.put(`/reservas/${slug}`, reserva);
  return response.data;
};

/**
 * Eliminar reserva (soft delete via PATCH)
 */
export const deleteReserva = async (slug: string): Promise<void> => {
  await api.patch(`/reservas/${slug}/soft-delete`);
};
