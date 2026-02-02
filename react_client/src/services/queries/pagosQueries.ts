import { api } from '../api';
import { Pago } from '../../types';

/**
 * Obtener todos los pagos
 */
export const getPagos = async (): Promise<Pago[]> => {
  const response = await api.get('/api/pagos');
  return response.data;
};

/**
 * Obtener pago por ID
 */
export const getPagoById = async (id: number): Promise<Pago> => {
  const response = await api.get(`/api/pagos/${id}`);
  return response.data;
};

/**
 * Obtener pagos por usuario
 */
export const getPagosByUsuarioId = async (usuarioId: number): Promise<Pago[]> => {
  const response = await api.get(`/api/pagos/usuario/${usuarioId}`);
  return response.data;
};
