import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip, 
  Box,
  Typography
} from '@mui/material';
import { Pago } from '../../types';

interface TablaPagosProps {
  pagos: Pago[];
}

export const TablaPagos = ({ pagos }: TablaPagosProps) => {

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completado':
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'fallido':
        return 'error';
      case 'reembolsado':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      {/* Tabla */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>UID</TableCell>
              <TableCell>Usuario ID</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>Provider</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Provider Payment ID</TableCell>
              <TableCell>Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagos.map((pago) => (
              <TableRow key={pago.id}>
                <TableCell>
                  <Typography variant="caption" color="text.secondary">
                    {pago.uid}
                  </Typography>
                </TableCell>
                <TableCell>{pago.usuarioId}</TableCell>
                <TableCell>
                  <Chip 
                    label={
                      pago.reservaId ? 'Reserva' :
                      pago.claseInscripcionId ? 'Clase' :
                      pago.clubSuscripcionId ? 'Club' : 'N/A'
                    }
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <strong>{pago.amount.toFixed(2)} {pago.currency}</strong>
                </TableCell>
                <TableCell>{pago.provider}</TableCell>
                <TableCell>
                  <Chip 
                    label={pago.status} 
                    color={getStatusColor(pago.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                    {pago.providerPaymentId || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  {new Date(pago.createdAt).toLocaleDateString('es-ES')}
                </TableCell>
              </TableRow>
            ))}
            {pagos.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No hay pagos para mostrar
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
