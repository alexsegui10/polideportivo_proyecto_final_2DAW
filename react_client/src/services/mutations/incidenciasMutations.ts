import { apiSpring as api } from '../apiSpring';
import { Incidencia, IncidenciaCreateRequest, IncidenciaEstadoUpdateRequest } from '../../types';

export const createIncidencia = async (payload: IncidenciaCreateRequest): Promise<Incidencia> => {
  const response = await api.post('/incidencias', payload);
  return response.data;
};

export const updateIncidenciaEstado = async (
  incidenciaId: number,
  payload: IncidenciaEstadoUpdateRequest
): Promise<Incidencia> => {
  const response = await api.patch(`/incidencias/${incidenciaId}/estado`, payload);
  return response.data;
};
