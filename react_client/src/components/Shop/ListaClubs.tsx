import { Grid, Card, CardContent, CardMedia, Typography, Box, Button, Chip, Select, MenuItem, FormControl } from '@mui/material';
import { Club } from '../../types';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import GroupIcon from '@mui/icons-material/Group';

interface ListaClubsProps {
  clubs: Club[];
  totalElements: number;
  sort: string;
  setSort: (value: string) => void;
}

const nivelColor: Record<string, string> = {
  principiante: '#22c55e',
  intermedio: '#f59e0b',
  avanzado: '#ef4444',
};

const deporteEmoji: Record<string, string> = {
  padel: '🎾', tenis: '🎾', futbol: '⚽', 'futbol sala': '⚽',
  baloncesto: '🏀', yoga: '🧘', natacion: '🏊', ciclismo: '🚴',
};

export const ListaClubs = ({ clubs, totalElements, sort, setSort }: ListaClubsProps) => {
  if (clubs.length === 0) {
    return (
      <Box sx={{ py: 16, px: 4, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontSize: '1.25rem', fontWeight: 600, color: 'text.secondary', mb: 1 }}>
          No se encontraron clubs
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.disabled' }}>
          Intenta ajustar los filtros de búsqueda
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontSize: '1.875rem', fontWeight: 700, mb: 0.5, color: 'rgba(255, 255, 255, 0.95)' }}>
            Clubs Disponibles
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>
            Mostrando {totalElements} clubs
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.7)', display: { xs: 'none', sm: 'block' } }}>
            Ordenar por:
          </Typography>
          <FormControl size="small">
            <Select value={sort} onChange={e => setSort(e.target.value)} IconComponent={ArrowDropDownIcon}
              sx={{
                minWidth: 200,
                bgcolor: 'rgba(17, 23, 34, 0.6)',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2563eb', borderWidth: 1 },
                '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.5)' },
              }}
            >
              <MenuItem value="default">Por defecto</MenuItem>
              <MenuItem value="precio_asc">Precio: menor a mayor</MenuItem>
              <MenuItem value="precio_desc">Precio: mayor a menor</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Grid de tarjetas */}
      <Grid container spacing={3}>
        {clubs.map(club => (
          <Grid item key={club.id} xs={12} sm={6} lg={4}>
            <Card sx={{
              bgcolor: 'background.paper',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 3,
              overflow: 'hidden',
              transition: 'all 0.2s ease',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', borderColor: '#2563eb' },
            }}>
              {/* Imagen / Banner */}
              <Box sx={{ position: 'relative', height: 160, bgcolor: 'rgba(17, 23, 34, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {club.imagen ? (
                  <CardMedia component="img" image={club.imagen} alt={club.nombre} sx={{ height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Typography sx={{ fontSize: 56 }}>{deporteEmoji[club.deporte?.toLowerCase()] || '🏆'}</Typography>
                )}
                {/* Badge nivel */}
                <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                  <Chip label={club.nivel} size="small" sx={{
                    bgcolor: `${nivelColor[club.nivel?.toLowerCase()] || '#6b7280'}22`,
                    color: nivelColor[club.nivel?.toLowerCase()] || '#6b7280',
                    border: `1px solid ${nivelColor[club.nivel?.toLowerCase()] || '#6b7280'}44`,
                    fontWeight: 700, fontSize: '0.7rem', textTransform: 'capitalize',
                  }} />
                </Box>
              </Box>

              <CardContent sx={{ p: 3 }}>
                {/* Deporte */}
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#3b82f6', mb: 0.5 }}>
                  {club.deporte}
                </Typography>

                {/* Nombre */}
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', mb: 2, color: 'rgba(255,255,255,0.95)', lineHeight: 1.3 }}>
                  {club.nombre}
                </Typography>

                {/* Miembros máx */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <GroupIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }} />
                  <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                    Máx. {club.maxMiembros} miembros
                  </Typography>
                </Box>

                {/* Descripción breve */}
                {club.descripcion && (
                  <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', mb: 2, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {club.descripcion}
                  </Typography>
                )}

                {/* Footer precio + botón */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 2, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <Box>
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>
                      €{Number(club.precioMensual).toFixed(2)}
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>por mes</Typography>
                  </Box>
                  <Button size="small" variant="contained"
                    sx={{ bgcolor: '#2563eb', borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.8rem', px: 2, '&:hover': { bgcolor: '#1d4ed8' } }}>
                    Unirse
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};
