import { useContext } from 'react';
import { ClaseInscripcionContext } from '../../context/ClaseInscripcionContext';

export const useClaseInscripcionMutations = () => {
  const context = useContext(ClaseInscripcionContext);
  if (!context) {
    throw new Error('useClaseInscripcionMutations debe usarse dentro de ClaseInscripcionProvider');
  }
  return context;
};
