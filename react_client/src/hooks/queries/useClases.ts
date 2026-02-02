import { useContext } from 'react';
import { ClasesContext } from '../../context/ClasesContext';

export const useClases = () => {
  const context = useContext(ClasesContext);
  if (!context) {
    throw new Error('useClases debe usarse dentro de ClasesProvider');
  }
  
  return {
    clases: context.clases,
    loading: context.loading,
    error: context.error,
    refetch: context.refetch
  };
};
