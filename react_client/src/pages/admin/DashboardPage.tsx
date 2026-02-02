import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { Dashboard, People, EventNote, Groups, FitnessCenter, Payment } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

/**
 * Dashboard principal - Solo muestra resumen y accesos rápidos
 */
export default function DashboardPage() {
  const navigate = useNavigate();

  const modules = [
    { title: 'Pistas', icon: <Dashboard fontSize="large" />, path: '/dashboard/pistas', color: '#2985a3' },
    { title: 'Usuarios', icon: <People fontSize="large" />, path: '/dashboard/usuarios', color: '#4caf50' },
    { title: 'Reservas', icon: <EventNote fontSize="large" />, path: '/dashboard/reservas', color: '#ff9800' },
    { title: 'Clubs', icon: <Groups fontSize="large" />, path: '/dashboard/clubs', color: '#9c27b0' },
    { title: 'Clases', icon: <FitnessCenter fontSize="large" />, path: '/dashboard/clases', color: '#f44336' },
    { title: 'Pagos', icon: <Payment fontSize="large" />, path: '/dashboard/pagos', color: '#00bcd4' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Panel de Administración
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Selecciona un módulo para gestionar
      </Typography>

      <Grid container spacing={3}>
        {modules.map((module) => (
          <Grid item xs={12} sm={6} md={4} key={module.path}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => navigate(module.path)}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Box sx={{ color: module.color, mb: 2 }}>
                  {module.icon}
                </Box>
                <Typography variant="h6" fontWeight="bold">
                  {module.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
