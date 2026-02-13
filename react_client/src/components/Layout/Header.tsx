import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, Avatar, Menu, MenuItem, Tooltip, ThemeProvider, createTheme } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import SportsIcon from '@mui/icons-material/Sports'
import { useState } from 'react'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#144bb8' },
    background: { default: '#0a0e1a', paper: '#111722' },
  },
});

export const Header = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <ThemeProvider theme={darkTheme}>
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

          {/* Espaciador para empujar botones a la derecha */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Botones de navegación a la derecha */}
          <Box sx={{ display: 'flex', gap: 0.5, mr: 2 }}>
            <Button
              component={RouterLink}
              to="/"
              sx={{ color: 'text.primary', textTransform: 'none', fontSize: '0.95rem', fontWeight: 600 }}
            >
              Inicio
            </Button>
            <Button
              component={RouterLink}
              to="/shop"
              sx={{ color: 'text.primary', textTransform: 'none', fontSize: '0.95rem', fontWeight: 600 }}
            >
              Reservar Pista
            </Button>
            <Button
              component={RouterLink}
              to="/clubs"
              sx={{ color: 'text.primary', textTransform: 'none', fontSize: '0.95rem', fontWeight: 600 }}
            >
              Clubs
            </Button>
            <Button
              component={RouterLink}
              to="/clases"
              sx={{ color: 'text.primary', textTransform: 'none', fontSize: '0.95rem', fontWeight: 600 }}
            >
              Clases
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Abrir ajustes">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Usuario" sx={{ bgcolor: 'secondary.main' }}>U</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleCloseUserMenu} component={RouterLink} to="/reservas">
                <Typography textAlign="center">Mis Reservas</Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu} component={RouterLink} to="/cuenta">
                <Typography textAlign="center">Mi Cuenta</Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu} component={RouterLink} to="/mis-clases">
                <Typography textAlign="center">Mis Clases</Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu} component={RouterLink} to="/mis-clubs">
                <Typography textAlign="center">Mis Clubs</Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>
                <Typography textAlign="center">Cerrar Sesión</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
    </ThemeProvider>
  )
}
