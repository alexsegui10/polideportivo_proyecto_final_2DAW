/**
 * AuthGuard - Protege rutas que requieren autenticación
 * Basado en el patrón de Scoonti con React Router v6
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { Box, CircularProgress } from '@mui/material';

/**
 * AuthGuard - Solo usuarios autenticados pueden acceder
 * Si no está autenticado, redirige a /login
 */
export const AuthGuard = () => {
  const { isAuth, isLoading } = useAuth();

  // Mientras carga, mostrar spinner
  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Si está autenticado, renderizar las rutas hijas con <Outlet />
  // Si NO está autenticado, redirigir al login
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};
