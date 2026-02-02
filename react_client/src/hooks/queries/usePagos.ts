import { useContext } from 'react';
import { PagosContext } from '../../context/PagosContext';

export const usePagos = () => {
  const context = useContext(PagosContext);
  if (!context) {
    throw new Error('usePagos debe usarse dentro de PagosProvider');
  }
  return context;
};
