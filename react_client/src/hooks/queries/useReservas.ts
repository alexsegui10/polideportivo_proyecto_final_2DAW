import { useContext } from 'react';
import { ReservasContext } from '../../context/ReservasContext';

export const useReservas = () => {
  const context = useContext(ReservasContext);
  if (!context) {
    throw new Error('useReservas debe usarse dentro de ReservasProvider');
  }
  
  return {
    reservas: context.reservas,
    loading: context.loading,
    error: context.error,
    refetch: context.refetch
  };
};
