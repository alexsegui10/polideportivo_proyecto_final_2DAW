import { Box, Typography, type SvgIconProps } from '@mui/material'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import BoltIcon from '@mui/icons-material/Bolt'
import StarsIcon from '@mui/icons-material/Stars'
import type { ElementType } from 'react'

type IconComponent = ElementType<SvgIconProps>

interface StatCardProps {
  icon: IconComponent
  iconColor: string
  bgColor: string
  label: string
  value: string
}

const StatCard = ({ icon: Icon, iconColor, bgColor, label, value }: StatCardProps) => (
  <Box sx={{
    bgcolor: '#111722',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: 3,
    p: 3
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{
        width: 40, height: 40, borderRadius: 2,
        bgcolor: bgColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Icon sx={{ color: iconColor, fontSize: 20 }} />
      </Box>
      <Box>
        <Typography variant="caption" sx={{ color: '#94a3b8' }}>{label}</Typography>
        <Typography variant="h6" fontWeight={700} sx={{ color: 'white' }}>{value}</Typography>
      </Box>
    </Box>
  </Box>
)

export const ProfileStats = () => (
  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 3 }}>
    <StatCard icon={FitnessCenterIcon} iconColor="#067ff9" bgColor="rgba(6,127,249,0.1)" label="Reservas" value="24" />
    <StatCard icon={BoltIcon} iconColor="#22c55e" bgColor="rgba(34,197,94,0.1)" label="Racha" value="7 días" />
    <StatCard icon={StarsIcon} iconColor="#a855f7" bgColor="rgba(168,85,247,0.1)" label="Puntos" value="1,240" />
  </Box>
)
