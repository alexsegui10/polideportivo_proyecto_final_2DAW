import { Box, Typography, Button, Chip } from '@mui/material'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import SportsIcon from '@mui/icons-material/Sports'

const ACTIVITIES = [
  { text: 'Check-in Gimnasio Principal', time: 'Hoy, 9:42 AM', color: '#067ff9' },
  { text: 'Reserva Pista de Tenis 3', time: 'Ayer, 4:00 PM', color: '#22c55e' },
  { text: 'Membresía Renovada', time: '24 Oct, 2023', color: '#a855f7' },
  { text: 'Foto de Perfil Actualizada', time: '15 Oct, 2023', color: '#64748b' },
]

export const ProfileSidebar = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    {/* Actividades Recientes */}
    <Box sx={{
      bgcolor: '#111722',
      border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: 3, p: 3,
      boxShadow: '0 4px 24px rgba(0,0,0,0.4)'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="body1" fontWeight={700} sx={{ color: 'white' }}>
          Actividades Recientes
        </Typography>
        <Button size="small" sx={{ color: '#067ff9', textTransform: 'none', fontSize: '0.75rem', fontWeight: 600 }}>
          Ver Todo
        </Button>
      </Box>

      <Box sx={{ position: 'relative' }}>
        <Box sx={{ position: 'absolute', left: 11, top: 0, bottom: 0, width: 2, bgcolor: '#1e293b' }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {ACTIVITIES.map((activity, index) => (
            <Box key={index} sx={{ position: 'relative', pl: 4 }}>
              <Box sx={{
                position: 'absolute', left: 8, top: 4,
                width: 10, height: 10, borderRadius: '50%', bgcolor: activity.color
              }} />
              <Typography variant="body2" fontWeight={500} sx={{ color: 'white', mb: 0.5 }}>
                {activity.text}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                {activity.time}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>

    {/* Próxima Reserva */}
    <Box sx={{
      bgcolor: '#111722',
      border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: 3, p: 3,
      boxShadow: '0 4px 24px rgba(0,0,0,0.4)'
    }}>
      <Typography variant="body1" fontWeight={700} sx={{ color: 'white', mb: 3 }}>
        Próxima Reserva
      </Typography>

      <Box sx={{ bgcolor: '#0f1720', borderRadius: 2, p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <SportsIcon sx={{ color: '#067ff9', fontSize: 20 }} />
            <Typography variant="body2" fontWeight={600} sx={{ color: 'white' }}>
              Pista de Tenis 1
            </Typography>
          </Box>
          <Chip
            label="CONFIRMADA" size="small"
            sx={{ bgcolor: 'rgba(6,127,249,0.1)', color: '#067ff9', fontSize: '0.625rem', fontWeight: 700, height: 22, letterSpacing: 0.5 }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CalendarTodayIcon sx={{ color: '#64748b', fontSize: 18 }} />
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>Mañana, 28 Oct</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AccessTimeIcon sx={{ color: '#64748b', fontSize: 18 }} />
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>10:00 AM - 11:00 AM</Typography>
          </Box>
        </Box>

        <Button fullWidth variant="outlined" sx={{
          color: '#94a3b8', borderColor: '#334155',
          textTransform: 'none', fontWeight: 600,
          '&:hover': { borderColor: '#475569', bgcolor: '#1e293b' }
        }}>
          Gestionar Reserva
        </Button>
      </Box>
    </Box>
  </Box>
)
