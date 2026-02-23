/**
 * ProfileInfo - Contenido de la pestaña "Mi Perfil" (solo para el owner)
 * Muestra: datos personales editables + estadísticas + actividad reciente
 */

import { Box } from '@mui/material'
import { ProfileHeader } from './ProfileHeader'
import { ProfileStats } from './ProfileStats'
import { ProfileSidebar } from './ProfileSidebar'
import type { ProfileResponse } from '../../types'

interface ProfileInfoProps {
  profile: ProfileResponse
  isOwner: boolean
}

export const ProfileInfo = ({ profile, isOwner }: ProfileInfoProps) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', xl: '1fr 360px' },
        gap: 4,
      }}
    >
      {/* Columna principal: campos editables + estadísticas */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <ProfileHeader profile={profile} isOwner={isOwner} />
        <ProfileStats />
      </Box>

      {/* Columna lateral: actividad reciente + próxima reserva */}
      <ProfileSidebar />
    </Box>
  )
}