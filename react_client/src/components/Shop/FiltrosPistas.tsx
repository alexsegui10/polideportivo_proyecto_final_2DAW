import { Box, TextField, Button, Slider, Typography, Checkbox, FormControlLabel, Select, MenuItem, FormControl } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface FiltrosPistasProps {
  qInput: string;
  setQInput: (value: string) => void;
  tipo: string;
  setTipo: (value: string) => void;
  precioMax: string;
  setPrecioMax: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
  limit: number;
  setLimit: (value: number) => void;
  clearFilters: () => void;
}

export const FiltrosPistas = ({
  qInput,
  setQInput,
  tipo,
  setTipo,
  precioMax,
  setPrecioMax,
  limit,
  setLimit,
  clearFilters
}: FiltrosPistasProps) => {
  const precioSliderValue = precioMax ? Number(precioMax) : 100;

  const handlePrecioChange = (_: Event, newValue: number | number[]) => {
    setPrecioMax(String(newValue));
  };

  const deportes = ['padel', 'tenis', 'futbol sala', 'baloncesto', 'yoga'];

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.125rem', color: 'white' }}>
          Filtros de búsqueda
        </Typography>
        <Button 
          onClick={clearFilters}
          sx={{ 
            color: '#2563eb',
            fontSize: '0.875rem',
            fontWeight: 600,
            textTransform: 'none',
            minWidth: 'auto',
            p: 0,
            '&:hover': {
              bgcolor: 'transparent',
              textDecoration: 'underline'
            }
          }}
        >
          Limpiar
        </Button>
      </Box>

      {/* Buscador */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar pista..."
          value={qInput}
          onChange={e => setQInput(e.target.value)}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)', fontSize: 20 }} />
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'rgba(17, 23, 34, 0.6)',
              fontSize: '0.875rem',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.1)'
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#2563eb',
                borderWidth: 1
              }
            },
            '& .MuiInputBase-input': {
              color: 'white'
            },
            '& .MuiInputBase-input::placeholder': {
              color: 'rgba(255, 255, 255, 0.5)',
              opacity: 1
            }
          }}
        />
      </Box>

      {/* Precio */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 3, color: 'rgba(255, 255, 255, 0.9)' }}>
          Presupuesto <Typography component="span" sx={{ fontSize: '0.75rem', fontWeight: 400, textTransform: 'capitalize', color: 'rgba(255, 255, 255, 0.5)' }}>(por hora)</Typography>
        </Typography>
        <Box sx={{ px: 1, pt: 2 }}>
          <Slider
            value={precioSliderValue}
            onChange={handlePrecioChange}
            min={10}
            max={150}
            step={5}
            sx={{
              color: '#2563eb',
              height: 4,
              '& .MuiSlider-thumb': {
                width: 16,
                height: 16,
                bgcolor: 'rgba(26, 34, 50, 0.8)',
                border: '2px solid #2563eb',
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0 0 0 8px rgba(37, 99, 235, 0.16)',
                },
              },
              '& .MuiSlider-track': {
                bgcolor: '#2563eb',
                border: 'none',
              },
              '& .MuiSlider-rail': {
                bgcolor: 'rgba(36, 48, 71, 0.8)',
              },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.7)' }}>
              €{precioSliderValue}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.7)' }}>
              €150+
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Sport Type */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 2, color: 'rgba(255, 255, 255, 0.9)' }}>
          Tipo de Deporte
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {deportes.map(deporte => (
            <FormControlLabel
              key={deporte}
              control={
                <Checkbox
                  checked={tipo === deporte}
                  onChange={(e) => setTipo(e.target.checked ? deporte : '')}
                  sx={{
                    color: '#cbd5e1',
                    '&.Mui-checked': {
                      color: '#2563eb',
                    },
                    '& .MuiSvgIcon-root': {
                      fontSize: 20
                    }
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.85)' }}>
                  {deporte.charAt(0).toUpperCase() + deporte.slice(1)}
                </Typography>
              }
              sx={{
                m: 0,
                '&:hover': {
                  '& .MuiTypography-root': {
                    color: '#3b82f6'
                  }
                }
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Resultados por página */}
      <Box>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 2, color: 'rgba(255, 255, 255, 0.9)' }}>  
          Resultados por página
        </Typography>
        <FormControl fullWidth size="small">
          <Select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            sx={{
              bgcolor: 'rgba(17, 23, 34, 0.6)',
              fontSize: '0.875rem',
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.1)'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#2563eb',
                borderWidth: 1
              },
              '& .MuiSvgIcon-root': {
                color: 'rgba(255, 255, 255, 0.5)'
              }
            }}
          >
            <MenuItem value={6}>6 resultados</MenuItem>
            <MenuItem value={9}>9 resultados</MenuItem>
            <MenuItem value={12}>12 resultados</MenuItem>
            <MenuItem value={24}>24 resultados</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};
