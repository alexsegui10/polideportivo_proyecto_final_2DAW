import { Box, Typography } from '@mui/material';
import { CalendarioGestion } from '../../components/Admin/CalendarioGestion';

/**
 * Page de Reservas - Gestión completa de reservas y clases
 */
export default function ReservasPage() {
  return (
    <Box p={3}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Gestión de Reservas y Clases
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gestiona las reservas y clases del polideportivo desde el calendario
        </Typography>
      </Box>

      <CalendarioGestion />
    </Box>
  );
}
