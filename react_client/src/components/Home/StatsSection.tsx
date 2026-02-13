import { Box, Grid, Paper, Typography } from '@mui/material';
import { Pool, SportsKabaddi, Groups, SquareFoot } from '@mui/icons-material';

interface StatsSectionProps {
  stats: {
    pistas: number;
    entrenadores: number;
    clubs: number;
  };
}

export const StatsSection = ({ stats }: StatsSectionProps) => {
  const statsData = [
    { label: 'Pistas Deportivas', value: stats.pistas, icon: Pool },
    { label: 'Entrenadores Expertos', value: `${stats.entrenadores}+`, icon: SportsKabaddi },
    { label: 'Atletas de Élite', value: `${stats.clubs}+`, icon: Groups },
    { label: 'M² de Complejo', value: '10k', icon: SquareFoot }
  ];

  return (
    <Box sx={{ 
      position: 'relative', 
      zIndex: 20, 
      mt: -5,
      mb: 8,
      px: { xs: 2, md: 5 }
    }}>
      <Paper
        elevation={24}
        sx={{
          borderRadius: 4,
          bgcolor: '#0f131a',
          border: '1px solid rgba(36, 48, 71, 1)',
          overflow: 'hidden'
        }}
      >
        <Grid container sx={{ display: 'flex' }}>
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Grid 
                item 
                xs={6} 
                md={3} 
                key={index}
                sx={{
                  borderRight: index < 3 ? '1px solid rgba(36, 48, 71, 0.5)' : 'none',
                  borderBottom: { xs: index < 2 ? '1px solid rgba(36, 48, 71, 0.5)' : 'none', md: 'none' },
                  '&:hover': {
                    bgcolor: '#1a2232',
                    transition: 'all 0.3s'
                  }
                }}
              >
                <Box sx={{ 
                  p: { xs: 3, md: 4 },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: 1
                }}>
                  <Icon 
                    sx={{ 
                      fontSize: { xs: 32, md: 40 },
                      color: '#144bb8',
                      mb: 1,
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'scale(1.1)'
                      }
                    }} 
                  />
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 900,
                      color: 'white',
                      fontSize: { xs: '1.75rem', md: '2rem' }
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#93a5c8',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontSize: { xs: '0.7rem', md: '0.75rem' }
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    </Box>
  );
};
