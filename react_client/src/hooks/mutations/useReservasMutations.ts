import { useContext } from 'react';
import { ReservasContext } from '../../context/ReservasContext';

export const useReservasMutations = () => {
  const context = useContext(ReservasContext);
  if (!context) {
    throw new Error('useReservasMutations debe usarse dentro de ReservasProvider');
  }
  
  return {
    createReserva: context.createReserva,
    updateReserva: context.updateReserva,
    deleteReserva: context.deleteReserva
  };
};
