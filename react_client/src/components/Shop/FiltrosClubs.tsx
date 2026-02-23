import { Box, TextField, Button, Slider, Typography, Select, MenuItem, FormControl } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface FiltrosClubsProps {
  qInput: string;
  setQInput: (value: string) => void;
  deporte: string;
  setDeporte: (value: string) => void;
  nivel: string;
  setNivel: (value: string) => void;
  precioMax: string;
  setPrecioMax: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
  limit: number;
  setLimit: (value: number) => void;
  clearFilters: () => void;
}

const deportes = ['padel', 'tenis', 'futbol sala', 'baloncesto', 'yoga', 'natacion', 'ciclismo'];
const niveles = ['principiante', 'intermedio', 'avanzado'];

const inputSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: 'rgba(17, 23, 34, 0.6)',
    fontSize: '0.875rem',
    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
    '&.Mui-focused fieldset': { borderColor: '#2563eb', borderWidth: 1 },
  },
  '& .MuiInputBase-input': { color: 'white' },
  '& .MuiInputBase-input::placeholder': { color: 'rgba(255, 255, 255, 0.5)', opacity: 1 },
};

const selectSx = {
  bgcolor: 'rgba(17, 23, 34, 0.6)',
  fontSize: '0.875rem',
  color: 'white',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2563eb', borderWidth: 1 },
  '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.5)' },
};

const labelSx = {
  fontSize: '0.75rem',
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  mb: 1.5,
  color: 'rgba(255, 255, 255, 0.9)',
};

export const FiltrosClubs = ({
  qInput, setQInput,
  deporte, setDeporte,
  nivel, setNivel,
  precioMax, setPrecioMax,
  sort, setSort,
  limit, setLimit,
  clearFilters,
}: FiltrosClubsProps) => {
  const precioSliderValue = precioMax ? Number(precioMax) : 300;

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.125rem', color: 'white' }}>
          Filtros de búsqueda
        </Typography>
        <Button onClick={clearFilters} sx={{
          color: '#2563eb', fontSize: '0.875rem', fontWeight: 600,
          textTransform: 'none', minWidth: 'auto', p: 0,
          '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
        }}>
          Limpiar
        </Button>
      </Box>

      {/* Buscador */}
      <Box sx={{ mb: 3 }}>
        <TextField fullWidth placeholder="Buscar club..." value={qInput}
          onChange={e => setQInput(e.target.value)} variant="outlined" size="small"
          InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)', fontSize: 20 }} /> }}
          sx={inputSx}
        />
      </Box>

      {/* Deporte */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={labelSx}>Deporte</Typography>
        <FormControl fullWidth size="small">
          <Select value={deporte} onChange={e => setDeporte(e.target.value)} displayEmpty sx={selectSx}>
            <MenuItem value=""><em style={{ color: 'rgba(255,255,255,0.5)', fontStyle: 'normal' }}>Todos los deportes</em></MenuItem>
            {deportes.map(d => (
              <MenuItem key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Nivel */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={labelSx}>Nivel</Typography>
        <FormControl fullWidth size="small">
          <Select value={nivel} onChange={e => setNivel(e.target.value)} displayEmpty sx={selectSx}>
            <MenuItem value=""><em style={{ color: 'rgba(255,255,255,0.5)', fontStyle: 'normal' }}>Todos los niveles</em></MenuItem>
            {niveles.map(n => (
              <MenuItem key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Precio mensual máximo */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={labelSx}>
          Precio mensual máx. <Typography component="span" sx={{ fontSize: '0.75rem', fontWeight: 400, textTransform: 'capitalize', color: 'rgba(255,255,255,0.5)' }}>(€/mes)</Typography>
        </Typography>
        <Box sx={{ px: 1, pt: 2 }}>
          <Slider value={precioSliderValue}
            onChange={(_, v) => setPrecioMax(String(v))}
            min={10} max={300} step={10}
            sx={{
              color: '#2563eb', height: 4,
              '& .MuiSlider-thumb': { width: 16, height: 16, bgcolor: 'rgba(26, 34, 50, 0.8)', border: '2px solid #2563eb', '&:hover, &.Mui-focusVisible': { boxShadow: '0 0 0 8px rgba(37, 99, 235, 0.16)' } },
              '& .MuiSlider-track': { bgcolor: '#2563eb', border: 'none' },
              '& .MuiSlider-rail': { bgcolor: 'rgba(36, 48, 71, 0.8)' },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>€{precioSliderValue}</Typography>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>€300+</Typography>
          </Box>
        </Box>
      </Box>

      {/* Ordenar */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={labelSx}>Ordenar por</Typography>
        <FormControl fullWidth size="small">
          <Select value={sort} onChange={e => setSort(e.target.value)} sx={selectSx}>
            <MenuItem value="default">Por defecto</MenuItem>
            <MenuItem value="precio_asc">Precio: menor a mayor</MenuItem>
            <MenuItem value="precio_desc">Precio: mayor a menor</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Resultados por página */}
      <Box>
        <Typography sx={labelSx}>Resultados por página</Typography>
        <FormControl fullWidth size="small">
          <Select value={limit} onChange={e => setLimit(Number(e.target.value))} sx={selectSx}>
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
