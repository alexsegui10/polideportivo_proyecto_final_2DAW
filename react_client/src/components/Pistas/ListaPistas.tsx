import { Grid, Card, CardMedia, CardContent, Typography, Chip, Box, CircularProgress } from '@mui/material';
import { usePistas } from '../../hooks/queries/usePistas';

export const ListaPistas = () => {
  const { pistas, loading, error } = usePistas();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {pistas.map((pista) => (
        <Grid item xs={12} sm={6} md={4} key={pista.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              component="img"
              height="200"
              image={pista.imagen || 'https://via.placeholder.com/400x200?text=Sin+Imagen'}
              alt={pista.nombre}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h2">
                {pista.nombre}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {pista.descripcion || 'Sin descripción'}
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                <Chip label={pista.tipo} size="small" color="primary" />
                <Chip 
                  label={pista.status} 
                  size="small" 
                  color={pista.status === 'disponible' ? 'success' : 'warning'} 
                />
                <Chip 
                  label={pista.isActive ? 'Activa' : 'Inactiva'} 
                  size="small" 
                  color={pista.isActive ? 'success' : 'error'} 
                />
              </Box>
              <Typography variant="h6" color="primary">
                €{pista.precioHora}/hora
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
