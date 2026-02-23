/**
 * useAuth - Hook para acceso de lectura al contexto de autenticación
 * Patrón: Hook → Context → Services
 */

import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  
  return {
    user: context.user,
    token: context.token,
    isAuth: context.isAuth,
    isAdmin: context.isAdmin,
    isLoading: context.isLoading,
    reloadUser: context.reloadUser,
  };
};
