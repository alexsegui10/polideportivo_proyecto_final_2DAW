/**
 * ProfilePublico - Vista pública simplificada del perfil (para visitantes, no owner)
 * Muestra: avatar, nombre, rol, bio y especialidad. Sin formularios de edición.
 */

import { Box, Typography, Avatar, Chip } from '@mui/material'
import WorkIcon from '@mui/icons-material/Work'
import type { ProfileResponse } from '../../types'

interface ProfilePublicoProps {
  profile: ProfileResponse
}

export const ProfilePublico = ({ profile }: ProfilePublicoProps) => {
  const initials = `${profile.nombre[0]}${profile.apellidos[0]}`.toUpperCase()

  const roleLabel =
    profile.role === 'ADMIN'      ? 'Administrador' :
    profile.role === 'INSTRUCTOR' ? 'Instructor'     : 'Usuario'

  const isStaff = profile.role === 'ADMIN' || profile.role === 'INSTRUCTOR'

  return (
    <Box sx={{ maxWidth: 520, mx: 'auto', pt: 2 }}>
      <Box
        sx={{
          bgcolor: '#111722',
          borderRadius: 4,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        }}
      >
        {/* Banner */}
        <Box
          sx={{
            height: 120,
            background: 'linear-gradient(135deg, #067ff9 0%, #0558b8 50%, #111722 100%)',
          }}
        />

        {/* Cuerpo */}
        <Box sx={{ px: 4, pb: 4 }}>
          {/* Avatar centrado */}
          <Box sx={{ mt: -7, mb: 2.5, display: 'flex', justifyContent: 'center' }}>
            <Avatar
              sx={{
                width: 96, height: 96,
                bgcolor: '#067ff9',
                fontSize: '2.5rem', fontWeight: 700,
                border: '4px solid #111722',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              }}
            >
              {initials}
            </Avatar>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            {/* Nombre */}
            <Typography variant="h5" fontWeight={700} sx={{ color: 'white', mb: 1.5 }}>
              {profile.nombre} {profile.apellidos}
            </Typography>

            {/* Chips rol + miembro */}
            <Box
              sx={{
                display: 'flex', gap: 1.5, flexWrap: 'wrap',
                justifyContent: 'center', mb: 3,
              }}
            >
              <Chip
                label={roleLabel}
                size="small"
                sx={{
                  fontWeight: 600,
                  bgcolor: isStaff ? 'rgba(251,191,36,0.1)' : 'rgba(6,127,249,0.1)',
                  color: isStaff ? '#fbbf24' : '#067ff9',
                  border: 'none', height: 28,
                }}
              />
              <Chip
                label="Miembro desde 2024"
                size="small"
                sx={{ bgcolor: 'rgba(148,163,184,0.1)', color: '#94a3b8', border: 'none', height: 28 }}
              />
            </Box>

            {/* Bio */}
            {profile.bio && (
              <Typography
                variant="body2"
                sx={{ color: '#94a3b8', mb: 2.5, lineHeight: 1.7 }}
              >
                {profile.bio}
              </Typography>
            )}

            {/* Especialidad */}
            {profile.especialidad && (
              <Box
                sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 1,
                  bgcolor: 'rgba(6,127,249,0.06)',
                  border: '1px solid rgba(6,127,249,0.15)',
                  borderRadius: 2, px: 2, py: 0.75,
                }}
              >
                <WorkIcon sx={{ color: '#067ff9', fontSize: 16 }} />
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                  {profile.especialidad}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
