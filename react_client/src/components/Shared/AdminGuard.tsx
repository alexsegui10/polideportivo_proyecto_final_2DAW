/**
 * AdminGuard - Protege rutas que requieren rol de administrador
 * Basado en el patrón de Scoonti con React Router v6
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { Box, CircularProgress } from '@mui/material';

/**
 * AdminGuard - Solo usuarios con rol 'admin' pueden acceder
 * Si no es admin, redirige a /home
 */
export const AdminGuard = () => {
  const { isAuth, isAdmin, isLoading } = useAuth();

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

  // Si NO está autenticado, redirigir al login
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado pero NO es admin, redirigir al home
  // Si ES admin, renderizar las rutas hijas con <Outlet />
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};
