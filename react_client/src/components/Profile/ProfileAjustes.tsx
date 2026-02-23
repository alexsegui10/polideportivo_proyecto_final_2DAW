/**
 * ProfileAjustes - Pestaña de ajustes del perfil (solo visible para el owner)
 */

import { Box, Typography, Switch, FormControlLabel, Button, Divider } from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SecurityIcon from '@mui/icons-material/Security'
import LanguageIcon from '@mui/icons-material/Language'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

const sectionSx = {
  bgcolor: '#111722',
  border: '1px solid rgba(255,255,255,0.05)',
  borderRadius: 3,
  p: 3,
  boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
} as const

const NOTIFICACIONES = [
  { label: 'Confirmación de reserva por email',    defaultChecked: true  },
  { label: 'Recordatorio 24h antes de la reserva', defaultChecked: true  },
  { label: 'Novedades y promociones',              defaultChecked: false },
]

export const ProfileAjustes = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

      {/* Notificaciones */}
      <Box sx={sectionSx}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <NotificationsIcon sx={{ color: '#067ff9', fontSize: 20 }} />
          <Typography variant="body1" fontWeight={700} sx={{ color: 'white' }}>
            Notificaciones
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {NOTIFICACIONES.map(({ label, defaultChecked }) => (
            <FormControlLabel
              key={label}
              control={
                <Switch
                  defaultChecked={defaultChecked}
                  size="small"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked':                 { color: '#067ff9' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#067ff9' },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                  {label}
                </Typography>
              }
              sx={{ mx: 0, py: 0.5 }}
            />
          ))}
        </Box>
      </Box>

      {/* Seguridad */}
      <Box sx={sectionSx}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <SecurityIcon sx={{ color: '#22c55e', fontSize: 20 }} />
          <Typography variant="body1" fontWeight={700} sx={{ color: 'white' }}>
            Seguridad
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2.5 }}>
          Mantén tu cuenta segura actualizando tu contraseña regularmente.
        </Typography>

        <Button
          variant="outlined"
          size="small"
          sx={{
            color: '#067ff9', borderColor: 'rgba(6,127,249,0.3)',
            textTransform: 'none', fontWeight: 600, fontSize: '0.875rem',
            '&:hover': { borderColor: '#067ff9', bgcolor: 'rgba(6,127,249,0.05)' },
          }}
        >
          Cambiar Contraseña
        </Button>
      </Box>

      {/* Idioma y región */}
      <Box sx={sectionSx}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <LanguageIcon sx={{ color: '#a855f7', fontSize: 20 }} />
          <Typography variant="body1" fontWeight={700} sx={{ color: 'white' }}>
            Idioma y Región
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ color: '#64748b' }}>
          Español (España) — UTC+1
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />

      {/* Zona de peligro */}
      <Box sx={{ ...sectionSx, border: '1px solid rgba(239,68,68,0.2)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <DeleteOutlineIcon sx={{ color: '#ef4444', fontSize: 20 }} />
          <Typography variant="body1" fontWeight={700} sx={{ color: '#ef4444' }}>
            Zona de Peligro
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ color: '#64748b', mb: 2.5 }}>
          Una vez eliminada tu cuenta, todos los datos serán borrados de forma permanente y no podrán recuperarse.
        </Typography>

        <Button
          variant="outlined"
          size="small"
          color="error"
          sx={{
            textTransform: 'none', fontWeight: 600, fontSize: '0.875rem',
            '&:hover': { bgcolor: 'rgba(239,68,68,0.05)' },
          }}
        >
          Eliminar Cuenta
        </Button>
      </Box>

    </Box>
  )
}
