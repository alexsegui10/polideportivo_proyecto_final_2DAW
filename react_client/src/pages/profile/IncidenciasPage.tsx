import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { Incidencia, IncidenciaCreateRequest } from '../../types';
import { createIncidencia } from '../../services/mutations/incidenciasMutations';
import { getMisIncidencias } from '../../services/queries/incidenciasQueries';

const tipoOptions: NonNullable<IncidenciaCreateRequest['tipo']>[] = ['general', 'reserva', 'pista', 'pago', 'web'];
const prioridadOptions: NonNullable<IncidenciaCreateRequest['prioridad']>[] = ['baja', 'media', 'alta'];

export default function IncidenciasPage() {
  const navigate = useNavigate();
  const { isAuth, isLoading } = useAuth();

  const [items, setItems] = useState<Incidencia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState<IncidenciaCreateRequest>({
    titulo: '',
    descripcion: '',
    tipo: 'general',
    prioridad: 'media',
    pagina: window.location.pathname,
  });

  const fetchMine = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMisIncidencias();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar tus incidencias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuth) {
      navigate('/login');
      return;
    }
    if (isAuth) {
      fetchMine();
    }
  }, [isAuth, isLoading]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSuccess(null);
    setError(null);

    try {
      const created = await createIncidencia(form);
      setItems((prev) => [created, ...prev]);
      setForm({
        titulo: '',
        descripcion: '',
        tipo: 'general',
        prioridad: 'media',
        pagina: window.location.pathname,
      });
      setSuccess('Incidencia enviada correctamente');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la incidencia');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Incidencias
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Reporta errores o problemas y revisa su estado.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Nueva incidencia</Typography>
        <Box component="form" onSubmit={onSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Titulo"
              value={form.titulo}
              onChange={(e) => setForm((prev) => ({ ...prev, titulo: e.target.value }))}
              required
              inputProps={{ maxLength: 120 }}
            />
            <TextField
              label="Descripcion"
              value={form.descripcion}
              onChange={(e) => setForm((prev) => ({ ...prev, descripcion: e.target.value }))}
              required
              multiline
              minRows={4}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                select
                label="Tipo"
                value={form.tipo}
                onChange={(e) => setForm((prev) => ({ ...prev, tipo: e.target.value as NonNullable<IncidenciaCreateRequest['tipo']> }))}
                sx={{ minWidth: 180 }}
              >
                {tipoOptions.map((tipo) => (
                  <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Prioridad"
                value={form.prioridad}
                onChange={(e) => setForm((prev) => ({ ...prev, prioridad: e.target.value as NonNullable<IncidenciaCreateRequest['prioridad']> }))}
                sx={{ minWidth: 180 }}
              >
                {prioridadOptions.map((prioridad) => (
                  <MenuItem key={prioridad} value={prioridad}>{prioridad}</MenuItem>
                ))}
              </TextField>
            </Stack>
            <Box>
              <Button type="submit" variant="contained">Enviar incidencia</Button>
            </Box>
          </Stack>
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Mis incidencias</Typography>
        {loading ? (
          <Typography>Cargando incidencias...</Typography>
        ) : items.length === 0 ? (
          <Typography color="text.secondary">Aun no has creado incidencias.</Typography>
        ) : (
          <Stack spacing={2}>
            {items.map((item) => (
              <Paper key={item.id} variant="outlined" sx={{ p: 2 }}>
                <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
                  <Chip size="small" label={item.estado} color={item.estado === 'resuelta' ? 'success' : 'default'} />
                  <Chip size="small" label={item.tipo} variant="outlined" />
                  <Chip size="small" label={item.prioridad} variant="outlined" />
                </Stack>
                <Typography variant="subtitle1" fontWeight={700}>{item.titulo}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>{item.descripcion}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {new Date(item.createdAt).toLocaleString('es-ES')}
                </Typography>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>
    </Container>
  );
}
