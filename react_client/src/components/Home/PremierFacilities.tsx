import { useState } from 'react';
import { Box, Typography, Grid, Paper, Chip, IconButton } from '@mui/material';
import { Pista } from '../../types';
import { useNavigate } from 'react-router-dom';
import { ArrowForward, ArrowOutward, WaterDrop, SportsBasketball, FitnessCenter, ArrowBack } from '@mui/icons-material';

interface PremierFacilitiesProps {
  pistas: Pista[];
}

const getTipoIcon = (tipo: string) => {
  const tipoLower = tipo.toLowerCase();
  if (tipoLower.includes('piscina') || tipoLower.includes('natación')) return WaterDrop;
  if (tipoLower.includes('basket') || tipoLower.includes('fútbol')) return SportsBasketball;
  return FitnessCenter;
};

const getTipoImage = (tipo: string) => {
  const tipoLower = tipo.toLowerCase();
  if (tipoLower.includes('piscina')) return 'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=800&h=600&fit=crop';
  if (tipoLower.includes('basket')) return 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=600&fit=crop';
  if (tipoLower.includes('tenis') || tipoLower.includes('pádel')) return 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=600&fit=crop';
  if (tipoLower.includes('fútbol')) return 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&h=600&fit=crop';
  return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop';
};

export const PremierFacilities = ({ pistas }: PremierFacilitiesProps) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(pistas.length / itemsPerPage);

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentPistas = pistas.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <Box sx={{ py: 10, maxWidth: 1280, mx: 'auto', px: { xs: 2, md: 5 } }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end',
        mb: 6,
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2
      }}>
        <Box>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 'bold',
              color: 'white',
              fontSize: { xs: '2rem', md: '2.5rem' },
              mb: 1
            }}
          >
            Instalaciones Premier
          </Typography>
          <Typography variant="body1" color="#93a5c8">
            Entornos de vanguardia diseñados para el máximo rendimiento.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={handlePrev}
              disabled={pistas.length <= itemsPerPage}
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
              disabled={pistas.length <= itemsPerPage}
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
            onClick={() => navigate('/shop')}
            sx={{ 
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 0.5,
              color: '#144bb8',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.875rem',
              '&:hover': {
                color: 'white',
                '& .arrow': {
                  transform: 'translateX(4px)'
                }
              }
            }}
          >
            Ver Todas
            <ArrowForward className="arrow" sx={{ fontSize: 18, transition: 'transform 0.3s' }} />
          </Box>
        </Box>
      </Box>

      {/* Carousel Grid */}
      <Grid container spacing={3}>
        {currentPistas.map((pista) => {
          const Icon = getTipoIcon(pista.tipo);
          return (
            <Grid item xs={12} sm={6} lg={4} key={pista.id}>
              <Paper
                onClick={() => navigate(`/shop?tipo=${pista.tipo}`)}
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 4,
                  bgcolor: '#1a2232',
                  border: '1px solid #243047',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: 'rgba(20, 75, 184, 0.5)',
                    boxShadow: '0 10px 40px rgba(20, 75, 184, 0.1)',
                    '& .pista-image': {
                      transform: 'scale(1.1)'
                    }
                  }
                }}
              >
                {/* Image */}
                <Box sx={{ 
                  aspectRatio: '4/3',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <Box
                    className="pista-image"
                    sx={{
                      width: '100%',
                      height: '100%',
                      backgroundImage: `url(${pista.imagen || getTipoImage(pista.tipo)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      transition: 'transform 0.5s'
                    }}
                  />
                  {/* Gradient Overlay */}
                  <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    p: 3
                  }}>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 0.5 }}>
                      {pista.nombre}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#d1d5db', fontSize: '0.85rem', mb: 2, lineHeight: 1.4 }}>
                      {pista.descripcion || `Pista profesional de ${pista.tipo} con control de temperatura.`}
                    </Typography>
                    
                    {/* Bottom Row */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        icon={<Icon sx={{ color: '#144bb8 !important' }} />}
                        label={pista.tipo}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(20, 75, 184, 0.1)',
                          color: '#144bb8',
                          border: '1px solid rgba(20, 75, 184, 0.2)',
                          fontWeight: 500,
                          fontSize: '0.7rem'
                        }}
                      />
                      <IconButton
                        sx={{
                          bgcolor: 'white',
                          color: 'black',
                          width: 32,
                          height: 32,
                          '&:hover': {
                            bgcolor: '#144bb8',
                            color: 'white'
                          }
                        }}
                      >
                        <ArrowOutward sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
