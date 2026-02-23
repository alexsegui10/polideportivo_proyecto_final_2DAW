import { Box, Typography, Avatar, Chip, Button, TextField, InputAdornment } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import BadgeIcon from '@mui/icons-material/Badge'
import WorkIcon from '@mui/icons-material/Work'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import CameraAltIcon from '@mui/icons-material/CameraAlt'

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: '#0f1720',
    color: 'white',
    '& fieldset': { borderColor: '#1e293b' },
    '&:hover fieldset': { borderColor: '#334155' },
    '&.Mui-focused fieldset': { borderColor: '#067ff9' },
    '&.Mui-disabled': { bgcolor: '#0a0f1a', '& fieldset': { borderColor: '#1e293b' } }
  },
  '& input': { fontSize: '0.875rem' }
}

interface ProfileHeaderProps {
  profile: {
    nombre: string
    apellidos: string
    slug: string
    role: string
    especialidad?: string
  }
  isOwner: boolean
}

export const ProfileHeader = ({ profile, isOwner }: ProfileHeaderProps) => {
  const initials = `${profile.nombre[0]}${profile.apellidos[0]}`.toUpperCase()

  return (
    <Box sx={{
      bgcolor: '#111722',
      borderRadius: 4,
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.05)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.4)'
    }}>
      {/* Banner */}
      <Box sx={{
        height: 128,
        background: 'linear-gradient(135deg, #067ff9 0%, #0558b8 50%, #111722 100%)'
      }} />

      {/* Avatar & Info */}
      <Box sx={{ px: 4, pb: 4 }}>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 3,
          alignItems: { xs: 'center', sm: 'flex-end' },
          position: 'relative',
          mt: -8
        }}>
          {/* Avatar */}
          <Box sx={{ position: 'relative' }}>
            <Avatar sx={{
              width: 128, height: 128,
              bgcolor: '#067ff9',
              fontSize: '3rem', fontWeight: 700,
              border: '4px solid #111722',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
            }}>
              {initials}
            </Avatar>
            {isOwner && (
              <Box sx={{
                position: 'absolute', inset: 0,
                bgcolor: 'rgba(0,0,0,0.5)', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: 0, transition: 'opacity 0.2s', cursor: 'pointer',
                '&:hover': { opacity: 1 }
              }}>
                <CameraAltIcon sx={{ color: 'white', fontSize: 28 }} />
              </Box>
            )}
          </Box>

          {/* Name & Badges */}
          <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' }, pb: { sm: 2 } }}>
            <Typography variant="h5" fontWeight={700} sx={{ color: 'white', mb: 1.5 }}>
              {profile.nombre} {profile.apellidos}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
              <Chip
                label={profile.role === 'ADMIN' ? 'Administrador' : profile.role === 'INSTRUCTOR' ? 'Instructor' : 'Usuario'}
                size="small"
                icon={<span style={{ fontSize: '14px', marginLeft: '8px' }}>●</span>}
                sx={{
                  fontWeight: 600,
                  bgcolor: profile.role === 'ADMIN' || profile.role === 'INSTRUCTOR'
                    ? 'rgba(251,191,36,0.1)' : 'rgba(6,127,249,0.1)',
                  color: profile.role === 'ADMIN' || profile.role === 'INSTRUCTOR'
                    ? '#fbbf24' : '#067ff9',
                  border: 'none', px: 1.5, height: 28,
                  '& .MuiChip-icon': { color: 'currentColor', marginLeft: 0 }
                }}
              />
              <Chip
                label="Miembro desde 2024" size="small"
                sx={{ bgcolor: 'rgba(148,163,184,0.1)', color: '#94a3b8', border: 'none', height: 28 }}
              />
            </Box>
          </Box>

          {isOwner && (
            <Button sx={{
              color: '#067ff9', textTransform: 'none', fontWeight: 600,
              fontSize: '0.875rem', mb: { sm: 2 },
              '&:hover': { bgcolor: 'rgba(6,127,249,0.05)' }
            }}>
              Editar Foto
            </Button>
          )}
        </Box>

        {/* Form Fields */}
        <Box sx={{ mt: 6, display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2,1fr)' }, gap: 3 }}>
          <Box>
            <Typography variant="body2" fontWeight={500} sx={{ color: '#94a3b8', mb: 1 }}>Nombre Completo</Typography>
            <TextField fullWidth defaultValue={profile.nombre} disabled={!isOwner}
              InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: '#475569', fontSize: 20 }} /></InputAdornment> }}
              sx={fieldSx}
            />
          </Box>

          <Box>
            <Typography variant="body2" fontWeight={500} sx={{ color: '#94a3b8', mb: 1 }}>Apellidos</Typography>
            <TextField fullWidth defaultValue={profile.apellidos} disabled={!isOwner}
              InputProps={{ startAdornment: <InputAdornment position="start"><BadgeIcon sx={{ color: '#475569', fontSize: 20 }} /></InputAdornment> }}
              sx={fieldSx}
            />
          </Box>

          <Box>
            <Typography variant="body2" fontWeight={500} sx={{ color: '#94a3b8', mb: 1 }}>Email</Typography>
            <TextField fullWidth defaultValue="usuario@example.com" disabled={!isOwner} type="email"
              InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: '#475569', fontSize: 20 }} /></InputAdornment> }}
              sx={fieldSx}
            />
          </Box>

          <Box>
            <Typography variant="body2" fontWeight={500} sx={{ color: '#94a3b8', mb: 1 }}>Teléfono</Typography>
            <TextField fullWidth defaultValue="+34 600 000 000" disabled={!isOwner}
              InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: '#475569', fontSize: 20 }} /></InputAdornment> }}
              sx={fieldSx}
            />
          </Box>

          {profile.especialidad && (
            <Box sx={{ gridColumn: { xs: '1', md: 'span 2' } }}>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#94a3b8', mb: 1 }}>Especialidad</Typography>
              <TextField fullWidth defaultValue={profile.especialidad} disabled={!isOwner}
                InputProps={{ startAdornment: <InputAdornment position="start"><WorkIcon sx={{ color: '#475569', fontSize: 20 }} /></InputAdornment> }}
                sx={fieldSx}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}
