import { useState } from 'react';
import { Box, Typography, Grid, Paper, Chip, Avatar, IconButton } from '@mui/material';
import { DirectionsRun, SportsTennis, SelfImprovement, ArrowBack, ArrowForward, ArrowOutward } from '@mui/icons-material';
import { Club } from '../../types';
import { useNavigate } from 'react-router-dom';

interface ExclusiveClubsProps {
  clubs: Club[];
}

const getClubIcon = (deporte: string) => {
  const deporteLower = deporte.toLowerCase();
  if (deporteLower.includes('running') || deporteLower.includes('maratón') || deporteLower.includes('correr')) return DirectionsRun;
  if (deporteLower.includes('tenis') || deporteLower.includes('pádel')) return SportsTennis;
  if (deporteLower.includes('yoga') || deporteLower.includes('zen')) return SelfImprovement;
  return DirectionsRun;
};

const getClubColor = (deporte: string) => {
  const deporteLower = deporte.toLowerCase();
  if (deporteLower.includes('running')) return { bg: 'rgba(59, 130, 246, 0.3)', border: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6' };
  if (deporteLower.includes('tenis')) return { bg: 'rgba(251, 146, 60, 0.3)', border: 'rgba(251, 146, 60, 0.2)', text: '#fb923c' };
  if (deporteLower.includes('yoga')) return { bg: 'rgba(168, 85, 247, 0.3)', border: 'rgba(168, 85, 247, 0.2)', text: '#a855f7' };
  return { bg: 'rgba(59, 130, 246, 0.3)', border: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6' };
};

export const ExclusiveClubs = ({ clubs }: ExclusiveClubsProps) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(clubs.length / itemsPerPage);

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentClubs = clubs.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  return (
    <Box sx={{ py: 10, maxWidth: 1280, mx: 'auto', px: { xs: 2, md: 5 } }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 6
      }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 'bold',
            color: 'white',
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          Clubs Exclusivos
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={handlePrev}
            disabled={clubs.length <= itemsPerPage}
            sx={{
              width: 40,
              height: 40,
              bgcolor: '#1a2232',
              border: '1px solid #243047',
              color: 'white',
              '&:hover': {
                bgcolor: '#144bb8',
                borderColor: '#144bb8'
              },
              '&:disabled': {
                opacity: 0.3
              }
            }}
          >
            <ArrowBack />
          </IconButton>
          <IconButton
            onClick={handleNext}
            disabled={clubs.length <= itemsPerPage}
            sx={{
              width: 40,
              height: 40,
              bgcolor: '#1a2232',
              border: '1px solid #243047',
              color: 'white',
              '&:hover': {
                bgcolor: '#144bb8',
                borderColor: '#144bb8'
              },
              '&:disabled': {
                opacity: 0.3
              }
            }}
          >
            <ArrowForward />
          </IconButton>
        </Box>
        <Box
          onClick={() => navigate('/clubs')}
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 0.5,
            color: '#144bb8',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.875rem',
            '&:hover': { color: 'white' }
          }}
        >
          Ver Todos
          <ArrowForward sx={{ fontSize: 18 }} />
        </Box>
      </Box>
      </Box>

      {/* Clubs Carousel Grid */}
      <Grid container spacing={3}>
        {currentClubs.map((club) => {
          const Icon = getClubIcon(club.deporte);
          const colors = getClubColor(club.deporte);
          const numMiembros = (club as any).numMiembros || club.maxMiembros || 0;
          
          return (
            <Grid item xs={12} md={4} key={club.id}>
              <Paper
                onClick={() => navigate(`/clubs?deporte=${encodeURIComponent(club.deporte)}`)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  p: 3,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #1a2232 0%, #0f131a 100%)',
                  border: '1px solid #243047',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'rgba(20, 75, 184, 0.4)',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 40px rgba(20, 75, 184, 0.1)'
                  }
                }}
              >
                {/* Header Row */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: colors.bg,
                      border: `1px solid ${colors.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: colors.text
                    }}
                  >
                    <Icon />
                  </Box>
                  <Chip
                    label={club.status === 'activo' ? 'Abierto' : 'Selecto'}
                    size="small"
                    sx={{
                      bgcolor: club.status === 'activo' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(20, 75, 184, 0.2)',
                      color: club.status === 'activo' ? '#22c55e' : '#144bb8',
                      border: club.status === 'activo' ? '1px solid rgba(34, 197, 94, 0.5)' : '1px solid rgba(20, 75, 184, 0.3)',
                      fontWeight: 'bold',
                      fontSize: '0.7rem'
                    }}
                  />
                </Box>

                {/* Content */}
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'white',
                      fontWeight: 'bold',
                      mb: 1,
                      fontSize: '1.25rem'
                    }}
                  >
                    {club.nombre}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#93a5c8',
                      fontSize: '0.875rem',
                      lineHeight: 1.5,
                      minHeight: 40
                    }}
                  >
                    {club.descripcion || `Únete a una comunidad de ${club.deporte}. Entrenamientos grupales y coaching.`}
                  </Typography>
                </Box>

                {/* Footer */}
                <Box 
                  sx={{ 
                    pt: 2,
                    mt: 'auto',
                    borderTop: '1px solid #243047',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  {/* Avatares */}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', mr: 1 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          border: '2px solid #1a2232',
                          bgcolor: '#144bb8',
                          fontSize: '0.75rem'
                        }}
                      >
                        A
                      </Avatar>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          border: '2px solid #1a2232',
                          bgcolor: '#8b5cf6',
                          fontSize: '0.75rem',
                          ml: -1
                        }}
                      >
                        B
                      </Avatar>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          border: '2px solid #1a2232',
                          bgcolor: '#ec4899',
                          fontSize: '0.75rem',
                          ml: -1
                        }}
                      >
                        C
                      </Avatar>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          border: '2px solid #1a2232',
                          bgcolor: '#243047',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem',
                          color: 'white',
                          fontWeight: 500,
                          ml: -1
                        }}
                      >
                        +{numMiembros}
                      </Box>
                    </Box>
                  </Box>

                  {/* Link */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      transition: 'color 0.3s',
                      '&:hover': { color: '#144bb8' }
                    }}
                  >
                    {club.status === 'activo' ? 'Unirse al Club' : 'Solicitar'}
                    <ArrowOutward sx={{ fontSize: 14 }} />
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
