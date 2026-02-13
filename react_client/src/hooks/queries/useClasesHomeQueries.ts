import { useContext } from 'react';
import { ClasesContext } from '../../context/ClasesContext';

export const useClasesHomeQueries = () => {
  const context = useContext(ClasesContext);
  
  if (!context) {
    throw new Error('useClasesHomeQueries debe usarse dentro de ClasesProvider');
  }

  return {
    getStats: context.getStats,
    getClasesPorFecha: context.getClasesPorFecha,
    loading: context.loading,
    error: context.error,
  };
};
