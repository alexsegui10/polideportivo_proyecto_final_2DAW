import { Box, CircularProgress, Alert } from '@mui/material';
import { useUsuarios } from '../../hooks/queries/useUsuarios';
import { TablaUsuarios } from '../../components/Admin/TablaUsuarios';

/**
 * Page de Usuarios - Solo queries y coordinación
 * Los componentes reciben datos y usan mutations
 */
export default function UsuariosPage() {
  const { usuarios, loading, error, createUsuario, updateUsuario, deleteUsuario } = useUsuarios();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error al cargar usuarios: {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <TablaUsuarios
        usuarios={usuarios}
        onCreate={createUsuario}
        onUpdate={updateUsuario}
        onDelete={deleteUsuario}
      />
    </Box>
  );
}
