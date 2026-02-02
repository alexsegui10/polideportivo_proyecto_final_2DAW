import { useContext } from 'react';
import { PistasContext } from '../../context/PistasContext';

export const usePistas = () => {
  const context = useContext(PistasContext);
  
  if (!context) {
    throw new Error('usePistas debe usarse dentro de PistasProvider');
  }
  
  return context;
};
