/**
 * useAuthMutations - Hook para operaciones de escritura en autenticación
 * Patrón: Hook → Context → Services
 */

import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export const useAuthMutations = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuthMutations debe usarse dentro de AuthProvider');
  }
  
  return {
    login: context.login,
    register: context.register,
    logout: context.logout,
  };
};
