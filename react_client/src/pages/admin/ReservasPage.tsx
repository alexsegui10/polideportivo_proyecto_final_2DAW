import { Box } from '@mui/material';
import { CalendarioGestion } from '../../components/Admin/CalendarioGestion';

/**
 * Page de Reservas - Gestión completa de reservas y clases
 */
export default function ReservasPage() {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <CalendarioGestion />
    </Box>
  );
}
