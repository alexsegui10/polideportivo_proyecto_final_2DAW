import { useContext } from 'react';
import { ClasesContext } from '../../context/ClasesContext';

export const useClasesShopQueries = () => {
  const context = useContext(ClasesContext);

  if (!context) {
    throw new Error('useClasesShopQueries debe usarse dentro de ClasesProvider');
  }

  return {
    searchClases: context.searchClases,
    error: context.error,
  };
};
