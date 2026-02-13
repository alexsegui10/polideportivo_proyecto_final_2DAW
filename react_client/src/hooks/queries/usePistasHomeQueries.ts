import { useContext } from 'react';
import { PistasContext } from '../../context/PistasContext';

export const usePistasHomeQueries = () => {
  const context = useContext(PistasContext);
  
  if (!context) {
    throw new Error('usePistasHomeQueries debe usarse dentro de PistasProvider');
  }

  return {
    getStats: context.getStats,
    getDestacadas: context.getDestacadas,
    loading: context.loading,
    error: context.error,
  };
};
