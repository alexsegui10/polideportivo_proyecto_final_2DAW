import { Box, Typography, Paper, Alert } from '@mui/material';
import { TablaPagos } from '../../components/Admin/TablaPagos';
import { usePagos } from '../../hooks';

/**
 * Page de Pagos - Visualización de historial de pagos
 */
export default function PagosPage() {
  const { pagos, loading, error } = usePagos();

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Gestión de Pagos
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        Historial de transacciones (solo lectura)
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3 }}>
        {loading ? (
          <Typography>Cargando pagos...</Typography>
        ) : (
          <TablaPagos pagos={pagos} />
        )}
      </Paper>
    </Box>
  );
}
