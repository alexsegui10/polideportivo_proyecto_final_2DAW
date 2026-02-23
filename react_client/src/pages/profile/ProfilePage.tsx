import { useState } from 'react'
import { Container, Box, CircularProgress, Alert, Typography, ThemeProvider, createTheme } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../hooks'
import { useProfile } from '../../hooks/queries/useProfile'
import { ProfileInfo } from '../../components/Profile/ProfileInfo'
import { ProfileNavSidebar, type ProfileTab } from '../../components/Profile/ProfileNavSidebar'
import { ProfileReservas } from '../../components/Profile/ProfileReservas'
import { ProfileAjustes } from '../../components/Profile/ProfileAjustes'
import { ProfilePublico } from '../../components/Profile/ProfilePublico'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#144bb8' },
    background: { default: '#0a0e1a', paper: '#111722' },
  },
});

export default function ProfilePage() {
  const { slug } = useParams<{ slug: string }>()
  const { user } = useAuth()
  const { data: profile, isLoading, error } = useProfile(slug || '')

  // Estado de la pestaña activa (solo relevante para el owner)
  const [activeTab, setActiveTab] = useState<ProfileTab>('perfil')

  // Determinar si el usuario actual es el dueño del perfil
  const isOwner = user?.slug === slug

  // Loading state
  if (isLoading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Box sx={{ bgcolor: '#0a0e1a', minHeight: '100vh' }}>
          <Container maxWidth="lg" sx={{ py: 8 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
              <CircularProgress size={60} />
            </Box>
          </Container>
        </Box>
      </ThemeProvider>
    )
  }

  // Error state
  if (error) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Box sx={{ bgcolor: '#0a0e1a', minHeight: '100vh' }}>
          <Container maxWidth="lg" sx={{ py: 8 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Perfil no encontrado
              </Typography>
              <Typography variant="body2">
                El perfil con slug "{slug}" no existe o ha sido eliminado.
              </Typography>
            </Alert>
          </Container>
        </Box>
      </ThemeProvider>
    )
  }

  // No data state
  if (!profile) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Box sx={{ bgcolor: '#0a0e1a', minHeight: '100vh' }}>
          <Container maxWidth="lg" sx={{ py: 8 }}>
            <Alert severity="warning">
              No se pudo cargar la información del perfil.
            </Alert>
          </Container>
        </Box>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ bgcolor: '#0a0e1a', minHeight: '100vh' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>

          {isOwner ? (
            /* ── Vista OWNER: sidebar nav + contenido por pestaña ── */
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '240px 1fr' },
                gap: 4,
                alignItems: 'start',
              }}
            >
              <ProfileNavSidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                profile={profile}
              />

              <Box>
                {activeTab === 'perfil'   && <ProfileInfo profile={profile} isOwner />}
                {activeTab === 'reservas' && <ProfileReservas />}
                {activeTab === 'ajustes'  && <ProfileAjustes />}
              </Box>
            </Box>
          ) : (
            /* ── Vista PÚBLICA: info simplificada, sin acciones ── */
            <ProfilePublico profile={profile} />
          )}

        </Container>
      </Box>
    </ThemeProvider>
  )
}

