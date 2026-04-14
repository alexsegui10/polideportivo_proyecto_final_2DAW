import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Chip,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { Incidencia, IncidenciaEstadoUpdateRequest } from '../../types';
import { getIncidenciasAdmin } from '../../services/queries/incidenciasQueries';
import { updateIncidenciaEstado } from '../../services/mutations/incidenciasMutations';

const estados: IncidenciaEstadoUpdateRequest['estado'][] = ['abierta', 'en_proceso', 'resuelta', 'cerrada'];

export default function IncidenciasPage() {
  const [items, setItems] = useState<Incidencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState('');

  const fetchData = async (estado?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getIncidenciasAdmin(estado || undefined);
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar incidencias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEstadoChange = async (incidenciaId: number, estado: IncidenciaEstadoUpdateRequest['estado']) => {
    try {
      const updated = await updateIncidenciaEstado(incidenciaId, { estado });
      setItems((prev) => prev.map((i) => (i.id === incidenciaId ? updated : i)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar estado');
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Gestión de Incidencias
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Revisión y actualización de incidencias reportadas por usuarios.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2">Filtrar por estado:</Typography>
          <Select
            size="small"
            value={filtroEstado}
            onChange={(e) => {
              const value = e.target.value;
              setFiltroEstado(value);
              fetchData(value);
            }}
            displayEmpty
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="">Todos</MenuItem>
            {estados.map((estado) => (
              <MenuItem key={estado} value={estado}>{estado}</MenuItem>
            ))}
          </Select>
        </Stack>
      </Paper>

      <Paper elevation={2} sx={{ p: 3 }}>
        {loading ? (
          <Typography>Cargando incidencias...</Typography>
        ) : items.length === 0 ? (
          <Typography color="text.secondary">No hay incidencias para mostrar.</Typography>
        ) : (
          <Stack spacing={2}>
            {items.map((item) => (
              <Paper key={item.id} variant="outlined" sx={{ p: 2 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ md: 'center' }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>{item.titulo}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.usuarioNombre || 'Usuario'} · {item.tipo} · prioridad {item.prioridad}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>{item.descripcion}</Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Chip size="small" label={item.estado} color={item.estado === 'resuelta' ? 'success' : 'default'} />
                    </Stack>
                  </Box>

                  <Select
                    size="small"
                    value={item.estado}
                    onChange={(e) => handleEstadoChange(item.id, e.target.value as IncidenciaEstadoUpdateRequest['estado'])}
                    sx={{ minWidth: 180 }}
                  >
                    {estados.map((estado) => (
                      <MenuItem key={estado} value={estado}>{estado}</MenuItem>
                    ))}
                  </Select>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>
    </Box>
  );
}
