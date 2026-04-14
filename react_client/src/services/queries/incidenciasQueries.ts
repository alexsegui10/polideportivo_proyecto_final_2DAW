import { apiSpring as api } from '../apiSpring';
import { Incidencia } from '../../types';

export const getMisIncidencias = async (): Promise<Incidencia[]> => {
  const response = await api.get('/incidencias/mine');
  return response.data;
};

export const getIncidenciasAdmin = async (estado?: string): Promise<Incidencia[]> => {
  const response = await api.get('/incidencias', {
    params: estado ? { estado } : undefined,
  });
  return response.data;
};
