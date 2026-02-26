import { useState, useCallback } from 'react'
import {
  Box, Typography, Avatar, Chip, Button, TextField,
  InputAdornment, CircularProgress
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import BadgeIcon from '@mui/icons-material/Badge'
import WorkIcon from '@mui/icons-material/Work'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import SaveIcon from '@mui/icons-material/Save'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useAuth } from '../../hooks'
import { updateUsuario } from '../../services/mutations/usuariosMutations'
import type { ProfileResponse } from '../../types'

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
  profile: ProfileResponse
  isOwner: boolean
}

export const ProfileHeader = ({ profile, isOwner }: ProfileHeaderProps) => {
  const { user, reloadUser } = useAuth()

  const [nombre, setNombre]     = useState(profile.nombre)
  const [apellidos, setApellidos] = useState(profile.apellidos)
  const [telefono, setTelefono] = useState(isOwner ? (user?.telefono ?? '') : '')
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const initials = `${profile.nombre[0]}${profile.apellidos[0]}`.toUpperCase()

  const handleSave = useCallback(async () => {
    if (!isOwner) return
    setSaving(true)
    setSaveError(null)
    try {
      await updateUsuario(profile.slug, { nombre, apellidos, telefono })
      await reloadUser()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setSaveError(msg ?? 'Error al guardar los cambios')
    } finally {
      setSaving(false)
    }
  }, [isOwner, profile.slug, nombre, apellidos, telefono, reloadUser])

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
            <Avatar
              src={isOwner ? (user?.avatar ?? undefined) : (profile.avatar ?? undefined)}
              sx={{
                width: 128, height: 128,
                bgcolor: '#067ff9',
                fontSize: '3rem', fontWeight: 700,
                border: '4px solid #111722',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
              }}
            >
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
              {isOwner ? nombre : profile.nombre} {isOwner ? apellidos : profile.apellidos}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
              <Chip
                label={
                  profile.role === 'ADMIN' ? 'Administrador'
                  : profile.role === 'INSTRUCTOR' ? 'Instructor'
                  : 'Usuario'
                }
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
                label={`Miembro desde ${new Date(profile.fechaCreacion).getFullYear()}`}
                size="small"
                sx={{ bgcolor: 'rgba(148,163,184,0.1)', color: '#94a3b8', border: 'none', height: 28 }}
              />
            </Box>
          </Box>
        </Box>

        {/* Form Fields */}
        <Box sx={{ mt: 6, display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2,1fr)' }, gap: 3 }}>
          <Box>
            <Typography variant="body2" fontWeight={500} sx={{ color: '#94a3b8', mb: 1 }}>Nombre</Typography>
            <TextField
              fullWidth
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              disabled={!isOwner || saving}
              InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: '#475569', fontSize: 20 }} /></InputAdornment> }}
              sx={fieldSx}
            />
          </Box>

          <Box>
            <Typography variant="body2" fontWeight={500} sx={{ color: '#94a3b8', mb: 1 }}>Apellidos</Typography>
            <TextField
              fullWidth
              value={apellidos}
              onChange={e => setApellidos(e.target.value)}
              disabled={!isOwner || saving}
              InputProps={{ startAdornment: <InputAdornment position="start"><BadgeIcon sx={{ color: '#475569', fontSize: 20 }} /></InputAdornment> }}
              sx={fieldSx}
            />
          </Box>

          {isOwner && (
            <>
              <Box>
                <Typography variant="body2" fontWeight={500} sx={{ color: '#94a3b8', mb: 1 }}>
                  Email <Typography component="span" variant="caption" sx={{ color: '#475569' }}>(no editable)</Typography>
                </Typography>
                <TextField
                  fullWidth
                  value={user?.email ?? ''}
                  disabled
                  type="email"
                  InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: '#475569', fontSize: 20 }} /></InputAdornment> }}
                  sx={fieldSx}
                />
              </Box>

              <Box>
                <Typography variant="body2" fontWeight={500} sx={{ color: '#94a3b8', mb: 1 }}>Teléfono</Typography>
                <TextField
                  fullWidth
                  value={telefono}
                  onChange={e => setTelefono(e.target.value)}
                  disabled={saving}
                  InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: '#475569', fontSize: 20 }} /></InputAdornment> }}
                  sx={fieldSx}
                />
              </Box>
            </>
          )}

          {profile.especialidad && (
            <Box sx={{ gridColumn: { xs: '1', md: 'span 2' } }}>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#94a3b8', mb: 1 }}>Especialidad</Typography>
              <TextField
                fullWidth
                value={profile.especialidad}
                disabled
                InputProps={{ startAdornment: <InputAdornment position="start"><WorkIcon sx={{ color: '#475569', fontSize: 20 }} /></InputAdornment> }}
                sx={fieldSx}
              />
            </Box>
          )}
        </Box>

        {/* Save Button — solo owner */}
        {isOwner && (
          <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="contained"
              disabled={saving}
              onClick={handleSave}
              startIcon={
                saving ? <CircularProgress size={16} color="inherit" />
                : saved  ? <CheckCircleIcon />
                : <SaveIcon />
              }
              sx={{
                bgcolor: saved ? '#22c55e' : '#067ff9',
                '&:hover': { bgcolor: saved ? '#16a34a' : '#0558b8' },
                textTransform: 'none', fontWeight: 600
              }}
            >
              {saving ? 'Guardando…' : saved ? '¡Guardado!' : 'Guardar cambios'}
            </Button>
            {saveError && (
              <Typography variant="body2" sx={{ color: '#ef4444' }}>
                {saveError}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}
