import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, Avatar, Menu, MenuItem, Tooltip, ThemeProvider, createTheme } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import SportsIcon from '@mui/icons-material/Sports'
import { useState } from 'react'
import { useAuth, useAuthMutations } from '../../hooks'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#144bb8' },
    background: { default: '#0a0e1a', paper: '#111722' },
  },
});

export const Header = () => {
  const navigate = useNavigate();
  const { user, isAuth, isAdmin } = useAuth();
  const { logout } = useAuthMutations();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  // Iniciales del nombre para el avatar
  const getInitials = () => {
    if (!user) return 'U';
    return `${user.nombre[0]}${user.apellidos[0]}`.toUpperCase();
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
            
            {/* Botón Dashboard solo para admins */}
            {isAdmin && (
              <Button
                component={RouterLink}
                to="/dashboard"
                sx={{ 
                  color: '#067ff9', 
                  textTransform: 'none', 
                  fontSize: '0.95rem', 
                  fontWeight: 700,
                  border: '1px solid #067ff9',
                  '&:hover': {
                    backgroundColor: 'rgba(6, 127, 249, 0.1)',
                  }
                }}
              >
                Dashboard
              </Button>
            )}
          </Box>

          {/* Usuario autenticado o Login */}
          <Box sx={{ flexGrow: 0 }}>
            {isAuth ? (
              <>
                <Tooltip title={`${user?.nombre} ${user?.apellidos}`}>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user?.nombre} sx={{ bgcolor: '#067ff9', fontWeight: 600 }}>
                      {getInitials()}
                    </Avatar>
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
                  {/* Nombre del usuario */}
                  <MenuItem disabled>
                    <Box>
                      <Typography variant="body2" fontWeight={700}>
                        {user?.nombre} {user?.apellidos}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user?.email}
                      </Typography>
                    </Box>
                  </MenuItem>
                  
                  <MenuItem onClick={handleCloseUserMenu} component={RouterLink} to="/reservas">
                    <Typography textAlign="center">Mis Reservas</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseUserMenu} component={RouterLink} to={`/profile/${user?.slug}`}>
                    <Typography textAlign="center">Mi Perfil</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseUserMenu} component={RouterLink} to="/mis-clases">
                    <Typography textAlign="center">Mis Clases</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseUserMenu} component={RouterLink} to="/mis-clubs">
                    <Typography textAlign="center">Mis Clubs</Typography>
                  </MenuItem>
                  
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main', fontWeight: 600 }}>
                    <Typography textAlign="center">Cerrar Sesión</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                onClick={handleLogin}
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #067ff9 0%, #0558b8 100%)',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0558b8 0%, #044a9f 100%)',
                  }
                }}
              >
                Iniciar Sesión
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
    </ThemeProvider>
  )
}
