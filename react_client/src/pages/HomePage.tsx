import { Container, Typography, Box } from '@mui/material'
import { ListaPistas } from '../components/Pistas/ListaPistas'

const HomePage = () => {
  return (
    <Container maxWidth="lg">
      <Box py={6}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Bienvenido a Emotiva Poli
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph align="center" mb={6}>
          Reserva tu pista deportiva favorita
        </Typography>
        <ListaPistas />
      </Box>
    </Container>
  )
}

export default HomePage