import { Grid, Card, CardContent, CardMedia, Typography, Box, Button, Chip, Select, MenuItem, FormControl } from '@mui/material';
import { Pista } from '../../types';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface ListaPistasProps {
  pistas: Pista[];
  totalElements: number;
  sort: string;
  setSort: (value: string) => void;
}

export const ListaPistas = ({ pistas, totalElements, sort, setSort }: ListaPistasProps) => {
  const getDeporteEmoji = (tipo: string) => {
    const map: Record<string, string> = {
      'padel': '🎾',
      'tenis': '🎾',
      'futbol': '⚽',
      'baloncesto': '🏀'
    };
    return map[tipo.toLowerCase()] || '🏟️';
  };

  if (pistas.length === 0) {
    return (
      <Box sx={{ 
        py: 16, 
        px: 4,
        textAlign: 'center',
        bgcolor: 'background.paper',
        borderRadius: 3
      }}>
        <Typography variant="h6" sx={{ fontSize: '1.25rem', fontWeight: 600, color: 'text.secondary', mb: 1 }}>
          No se encontraron pistas
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.disabled' }}>
          Intenta ajustar los filtros de búsqueda
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Header con resultados y sort */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" sx={{ fontSize: '1.875rem', fontWeight: 700, mb: 0.5, color: 'rgba(255, 255, 255, 0.95)' }}>
            Instalaciones Disponibles
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>
            Mostrando {totalElements} resultados
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.7)', display: { xs: 'none', sm: 'block' } }}>
            Ordenar por:
          </Typography>
          <FormControl size="small">
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              IconComponent={ArrowDropDownIcon}
              sx={{
                minWidth: 180,
                bgcolor: 'rgba(17, 23, 34, 0.6)',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.2)'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#2563eb',
                  borderWidth: 1
                },
                '& .MuiSvgIcon-root': {
                  color: 'rgba(255, 255, 255, 0.7)'
                }
              }}
            >
              <MenuItem value="default" sx={{ fontSize: '0.875rem' }}>Recomendado</MenuItem>
              <MenuItem value="precio_asc" sx={{ fontSize: '0.875rem' }}>Precio: Menor a Mayor</MenuItem>
              <MenuItem value="precio_desc" sx={{ fontSize: '0.875rem' }}>Precio: Mayor a Menor</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Grid de Cards */}
      <Grid container spacing={3}>
        {pistas.map((pista, idx) => {
          const randomRating = (4.2 + Math.random() * 0.8).toFixed(1);
          const randomReviews = Math.floor(30 + Math.random() * 200);
          
          return (
            <Grid item xs={12} sm={6} lg={4} key={pista.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  bgcolor: 'rgba(17, 23, 34, 0.6)',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.2)',
                    borderColor: 'rgba(37, 99, 235, 0.5)',
                    '& .card-image': {
                      transform: 'scale(1.05)',
                    }
                  }
                }}
              >
                {/* Imagen */}
                <Box sx={{ position: 'relative', height: 192, overflow: 'hidden' }}>
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)',
                      zIndex: 10
                    }} 
                  />
                  <CardMedia
                    component="img"
                    image={pista.imagen || `https://source.unsplash.com/random/600x400?${pista.tipo},sport,court`}
                    alt={pista.nombre}
                    className="card-image"
                    sx={{ 
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease-in-out',
                    }}
                  />
                  
                  {/* Badge superior derecho (disponibilidad simulada) */}
                  {idx % 3 === 0 && (
                    <Chip 
                      label="3 plazas"
                      size="small"
                      sx={{ 
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        zIndex: 20,
                        bgcolor: 'rgba(16, 185, 129, 0.9)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        backdropFilter: 'blur(8px)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    />
                  )}
                  
                  {/* Rating inferior izquierdo */}
                  <Box sx={{ 
                    position: 'absolute',
                    bottom: 12,
                    left: 12,
                    zIndex: 20,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    color: 'white'
                  }}>
                    <StarIcon sx={{ fontSize: 18, color: '#fbbf24' }} />
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 700 }}>
                      {randomRating}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#e5e7eb', ml: 0.5 }}>
                      ({randomReviews} reseñas)
                    </Typography>
                  </Box>
                </Box>
                
                {/* Contenido */}
                <CardContent sx={{ flex: 1, p: 2.5, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ mb: 1.5 }}>
                    <Typography variant="h6" sx={{ fontSize: '1.125rem', fontWeight: 700, mb: 0.5, lineHeight: 1.3, color: 'white' }}>
                      {pista.nombre}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'rgba(255, 255, 255, 0.6)' }}>
                      <LocationOnIcon sx={{ fontSize: 16 }} />
                      <Typography sx={{ fontSize: '0.875rem' }}>
                        Pista de {pista.tipo.charAt(0).toUpperCase() + pista.tipo.slice(1)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Tags */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    <Chip 
                      label={getDeporteEmoji(pista.tipo) + ' ' + pista.tipo.charAt(0).toUpperCase() + pista.tipo.slice(1)}
                      size="small"
                      sx={{ 
                        bgcolor: 'rgba(59, 130, 246, 0.2)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        height: 24
                      }}
                    />
                    <Chip 
                      label="Exterior"
                      size="small"
                      sx={{ 
                        bgcolor: 'rgba(59, 130, 246, 0.2)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        height: 24
                      }}
                    />
                  </Box>

                  {/* Footer */}
                  <Box sx={{ 
                    mt: 'auto',
                    pt: 2.5,
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <Box>
                      <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', mb: 0.25 }}>
                        Desde
                      </Typography>
                      <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>
                        €{pista.precioHora}
                        <Typography component="span" sx={{ fontSize: '0.875rem', fontWeight: 400, color: 'rgba(255, 255, 255, 0.6)' }}>
                          /h
                        </Typography>
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: '#2563eb',
                        color: 'white',
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        px: 2.5,
                        py: 1.25,
                        borderRadius: 2,
                        boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                        '&:hover': {
                          bgcolor: '#1d4ed8',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                        }
                      }}
                    >
                      Reservar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
