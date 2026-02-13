import { useContext } from 'react';
import { PistasContext } from '../../context/PistasContext';

export const usePistasShopQueries = () => {
  const context = useContext(PistasContext);
  
  if (!context) {
    throw new Error('usePistasShopQueries debe usarse dentro de PistasProvider');
  }

  return {
    searchPistas: context.searchPistas,
    error: context.error,
  };
};
