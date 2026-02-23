/**
 * ProfileNavSidebar - Sidebar de navegación del perfil (solo para el owner)
 * Secciones: Mi Perfil / Mis Reservas / Ajustes
 */

import { Box, Typography, Avatar, Divider, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import EventNoteIcon from '@mui/icons-material/EventNote'
import SettingsIcon from '@mui/icons-material/Settings'

export type ProfileTab = 'perfil' | 'reservas' | 'ajustes'

interface ProfileNavSidebarProps {
  activeTab: ProfileTab
  onTabChange: (tab: ProfileTab) => void
  profile: {
    nombre: string
    apellidos: string
    role: string
  }
}

const NAV_ITEMS: { tab: ProfileTab; label: string; icon: typeof PersonIcon }[] = [
  { tab: 'perfil',   label: 'Mi Perfil',    icon: PersonIcon },
  { tab: 'reservas', label: 'Mis Reservas', icon: EventNoteIcon },
  { tab: 'ajustes',  label: 'Ajustes',      icon: SettingsIcon },
]

export const ProfileNavSidebar = ({ activeTab, onTabChange, profile }: ProfileNavSidebarProps) => {
  const initials = `${profile.nombre[0]}${profile.apellidos[0]}`.toUpperCase()

  const roleLabel =
    profile.role === 'ADMIN'      ? 'Administrador' :
    profile.role === 'INSTRUCTOR' ? 'Instructor'     : 'Usuario'

  return (
    <Box
      sx={{
        bgcolor: '#111722',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        position: { lg: 'sticky' },
        top: { lg: 88 },
      }}
    >
      {/* Mini-header con avatar */}
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #067ff9 0%, #0558b8 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Avatar
          sx={{
            width: 64, height: 64,
            bgcolor: 'rgba(255,255,255,0.2)',
            fontSize: '1.5rem', fontWeight: 700,
            border: '3px solid rgba(255,255,255,0.3)',
          }}
        >
          {initials}
        </Avatar>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1" fontWeight={700} sx={{ color: 'white' }}>
            {profile.nombre} {profile.apellidos}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            {roleLabel}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />

      {/* Ítems de navegación */}
      <List sx={{ p: 1.5 }}>
        {NAV_ITEMS.map(({ tab, label, icon: Icon }) => {
          const isActive = activeTab === tab
          return (
            <ListItemButton
              key={tab}
              onClick={() => onTabChange(tab)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                px: 2, py: 1.5,
                bgcolor: isActive ? 'rgba(6,127,249,0.12)' : 'transparent',
                '&:hover': {
                  bgcolor: isActive ? 'rgba(6,127,249,0.18)' : 'rgba(255,255,255,0.04)',
                },
                transition: 'background-color 0.15s ease',
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Icon
                  sx={{
                    fontSize: 20,
                    color: isActive ? '#067ff9' : '#64748b',
                    transition: 'color 0.15s ease',
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'white' : '#94a3b8',
                }}
              />
              {isActive && (
                <Box
                  sx={{
                    width: 4, height: 20, borderRadius: 2,
                    bgcolor: '#067ff9', ml: 1,
                  }}
                />
              )}
            </ListItemButton>
          )
        })}
      </List>
    </Box>
  )
}
