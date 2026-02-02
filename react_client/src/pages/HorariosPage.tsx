/* import { Container, Typography, Box, Paper } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

const HorariosPage = () => {
  return (
    <Container maxWidth="lg">
      <Box py={6}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
          <AccessTimeIcon sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h3" component="h1">
            Horarios
          </Typography>
        </Box>
        
        <Typography variant="h6" color="text.secondary" paragraph align="center" mb={6}>
          Consulta nuestros horarios de apertura y disponibilidad
        </Typography>

        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Horario de Atención
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Typography variant="body1" paragraph>
              <strong>Lunes a Viernes:</strong> 7:00 - 23:00
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Sábados:</strong> 8:00 - 22:00
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Domingos y Festivos:</strong> 9:00 - 21:00
            </Typography>
          </Box>
          
          <Box sx={{ mt: 4, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              * Los horarios pueden variar según la temporada. Consulta disponibilidad en tiempo real.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default HorariosPage
 */