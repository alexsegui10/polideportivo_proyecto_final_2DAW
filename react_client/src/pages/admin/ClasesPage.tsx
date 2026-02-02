import { Box, Typography, Paper } from '@mui/material';

/**
 * Page de Clases Públicas - Gestión completa de clases
 */
export default function ClasesPage() {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Gestión de Clases Públicas
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        Administra las clases públicas con horarios y aforo
      </Typography>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Las clases se gestionan desde el <strong>Calendario de Reservas</strong>.
        </Typography>
      </Paper>
    </Box>
  );
}
