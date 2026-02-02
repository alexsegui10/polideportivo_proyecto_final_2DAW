import { useContext } from 'react';
import { ClasesContext } from '../../context/ClasesContext';

export const useClasesMutations = () => {
  const context = useContext(ClasesContext);
  if (!context) {
    throw new Error('useClasesMutations debe usarse dentro de ClasesProvider');
  }
  
  return {
    createClase: context.createClase,
    updateClase: context.updateClase,
    deleteClase: context.deleteClase
  };
};
