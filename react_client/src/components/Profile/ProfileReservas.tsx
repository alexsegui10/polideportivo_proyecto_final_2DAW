import { Box, Typography } from '@mui/material'
import EventIcon from '@mui/icons-material/Event'

export const ProfileReservas = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '400px',
      color: '#94a3b8'
    }}>
      <EventIcon sx={{ fontSize: 64, mb: 2, color: '#475569' }} />
      <Typography variant="h6" fontWeight={600} sx={{ color: 'white', mb: 1 }}>
        Próximamente
      </Typography>
      <Typography variant="body2">
        Aquí podrás ver todas tus reservas
      </Typography>
    </Box>
  )
}
