import { Box, CircularProgress, Alert } from '@mui/material';
import { TablaPistas } from '../../components/Admin/TablaPistas';
import { PistaRequest } from '../../types';
import { usePistas } from '../../hooks/queries/usePistas';

/**
 * Page de Pistas - Queries y coordinación con funciones reales de CRUD
 */
export default function PistasPage() {
  const { loading, error, createPista, updatePista, deletePista, refetch } = usePistas();

  const handleCreate = async (pista: PistaRequest) => {
    try {
      await createPista(pista);
      await refetch();
    } catch (err) {
      console.error('Error al crear pista:', err);
      alert('Error al crear la pista');
    }
  };

  const handleEdit = async (slug: string, pistaData: PistaRequest) => {
    try {
      await updatePista(slug, pistaData);
      await refetch();
    } catch (err) {
      console.error('Error al editar pista:', err);
      alert('Error al editar la pista');
    }
  };

  const handleDelete = async (slug: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta pista?')) {
      try {
        await deletePista(slug);
        await refetch();
      } catch (err) {
        console.error('Error al eliminar pista:', err);
        alert('Error al eliminar la pista');
      }
    }
  };

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
        Error al cargar pistas: {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <TablaPistas onCreate={handleCreate} onEdit={handleEdit} onDelete={handleDelete} />
    </Box>
  );
}
