import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import SportsIcon from '@mui/icons-material/Sports'

export const Header = () => {
  return (
    <AppBar position="sticky" elevation={2}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <SportsIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            EMOTIVA POLI
          </Typography>

          <SportsIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            EMOTIVA POLI
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              component={RouterLink}
              to="/"
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Inicio
            </Button>
            <Button
              component={RouterLink}
              to="/horarios"
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Horarios
            </Button>
            <Button
              component={RouterLink}
              to="/shop"
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Tienda
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Button color="inherit">Login</Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
