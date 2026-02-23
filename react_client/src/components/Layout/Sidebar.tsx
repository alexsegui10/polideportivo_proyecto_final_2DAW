import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Typography } from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Stadium as StadiumIcon,
  CalendarToday as CalendarIcon,
  Group as GroupIcon,
  Groups as ClubsIcon,
  Payment as PagosIcon,
  Settings as SettingsIcon 
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Pistas', icon: <StadiumIcon />, path: '/dashboard/pistas' },
    { text: 'Usuarios', icon: <GroupIcon />, path: '/dashboard/usuarios' },
    { text: 'Reservas', icon: <CalendarIcon />, path: '/dashboard/reservas' },
    { text: 'Clubs', icon: <ClubsIcon />, path: '/dashboard/clubs' },
    { text: 'Pagos', icon: <PagosIcon />, path: '/dashboard/pagos' },
    { text: 'Ajustes', icon: <SettingsIcon />, path: '/ajustes' },
  ];

  return (
    <Box
      sx={{
        width: 256,
        height: '100vh',
        borderRight: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        overflowY: 'auto',
      }}
    >
      {/* Brand */}
      <Box sx={{ p: 2, display: 'flex', gap: 1.5, alignItems: 'center', px: 3 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1.5,
            background: 'linear-gradient(135deg, #2985a3 0%, #1a5f75 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(41, 133, 163, 0.3)',
          }}
        >
          <StadiumIcon sx={{ color: 'white', fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2 }}>
            Emotiva Poli
          </Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            Admin Console
          </Typography>
        </Box>
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1, px: 2, py: 3 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 1.5,
                  py: 1.25,
                  px: 1.5,
                  bgcolor: isActive ? 'rgba(41, 133, 163, 0.1)' : 'transparent',
                  color: isActive ? '#2985a3' : 'text.secondary',
                  '&:hover': {
                    bgcolor: isActive ? 'rgba(41, 133, 163, 0.15)' : 'action.hover',
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    minWidth: 40,
                    color: isActive ? '#2985a3' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.875rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* User Profile */}
      <Box
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
          p: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1,
            borderRadius: 1.5,
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: '#2985a3',
            }}
          >
            A
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.2 }}>
              Admin User
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Ver Perfil
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
