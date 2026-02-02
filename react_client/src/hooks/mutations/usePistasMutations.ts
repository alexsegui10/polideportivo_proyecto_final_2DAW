import { useContext } from 'react';
import { PistasContext } from '../../context/PistasContext';

export const usePistasMutations = () => {
  const context = useContext(PistasContext);
  
  if (!context) {
    throw new Error('usePistasMutations debe usarse dentro de PistasProvider');
  }

  return {
    createPista: context.createPista,
    updatePista: context.updatePista,
    deletePista: context.deletePista,
    loading: context.loading,
    error: context.error,
  };
};
