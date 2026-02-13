import { Box, Container, Typography, Link, Grid, ThemeProvider, createTheme } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'
import InstagramIcon from '@mui/icons-material/Instagram'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#144bb8' },
    background: { default: '#0a0e1a', paper: '#111722' },
  },
});

export const Footer = () => {
  return (
    <ThemeProvider theme={darkTheme}>
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Emotiva Poli
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tu centro deportivo de confianza. Ofrecemos las mejores instalaciones
              para tu práctica deportiva.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Enlaces
            </Typography>
            <Link component={RouterLink} to="/" color="text.secondary" display="block">
              Inicio
            </Link>
            <Link component={RouterLink} to="/horarios" color="text.secondary" display="block">
              Horarios
            </Link>
            <Link component={RouterLink} to="/shop" color="text.secondary" display="block">
              Tienda
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Síguenos
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link href="#" color="text.secondary">
                <FacebookIcon />
              </Link>
              <Link href="#" color="text.secondary">
                <TwitterIcon />
              </Link>
              <Link href="#" color="text.secondary">
                <InstagramIcon />
              </Link>
            </Box>
          </Grid>
        </Grid>
        <Box mt={3}>
          <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            Emotiva Poli {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Box>
      </Container>
    </Box>
    </ThemeProvider>
  )
}
