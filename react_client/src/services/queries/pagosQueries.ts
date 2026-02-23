import { apiSpring as api } from '../apiSpring';
import { Pago } from '../../types';

/**
 * Obtener todos los pagos (solo admin)
 */
export const getPagos = async (): Promise<Pago[]> => {
  const response = await api.get('/pagos');
  return response.data;
};

/**
 * Obtener pago por ID (solo admin)
 */
export const getPagoById = async (id: number): Promise<Pago> => {
  const response = await api.get(`/pagos/${id}`);
  return response.data;
};

/**
 * Obtener MIS pagos (usuario autenticado)
 * Usa el usuario del token JWT automáticamente - NO requiere ID
 */
export const getMisPagos = async (): Promise<Pago[]> => {
  const response = await api.get('/pagos/mis-pagos');
  return response.data;
};

/**
 * Obtener pagos por usuario (solo admin)
 * @deprecated Usar getMisPagos() para usuario autenticado
 */
export const getPagosByUsuarioId = async (usuarioId: number): Promise<Pago[]> => {
  const response = await api.get(`/pagos/usuario/${usuarioId}`);
  return response.data;
};
