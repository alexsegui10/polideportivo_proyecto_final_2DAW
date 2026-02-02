import { useContext } from 'react';
import { UsuariosContext } from '../../context/UsuariosContext';

export const useUsuariosMutations = () => {
  const context = useContext(UsuariosContext);
  
  if (!context) {
    throw new Error('useUsuariosMutations debe usarse dentro de UsuariosProvider');
  }

  return {
    createUsuario: context.createUsuario,
    updateUsuario: context.updateUsuario,
    deleteUsuario: context.deleteUsuario,
    loading: context.loading,
    error: context.error,
  };
};
