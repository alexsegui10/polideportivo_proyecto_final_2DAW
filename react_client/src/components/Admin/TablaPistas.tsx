import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  CircularProgress,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useState } from 'react';
import { usePistas } from '../../hooks/queries/usePistas';
import { Pista, PistaRequest } from '../../types';
import { FormField, FormSelect } from '../Shared';
import { DEPORTES } from '../../constants/deportes';

interface TablaPistasProps {
  onEdit: (slug: string, pista: PistaRequest) => void;
  onDelete: (slug: string) => void;
  onCreate: (pista: PistaRequest) => void;
}

export const TablaPistas = ({ onEdit, onDelete, onCreate }: TablaPistasProps) => {
  const { pistas, loading, error } = usePistas();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pistaEditando, setPistaEditando] = useState<Pista | null>(null);

  const [formData, setFormData] = useState<PistaRequest>({
    nombre: '',
    tipo: '',
    descripcion: '',
    precioHora: 0,
    imagen: '',
    status: 'disponible',
    isActive: true,
  });

  const handleAbrirModal = (pista?: Pista) => {
    if (pista) {
      setPistaEditando(pista);
      setFormData({
        nombre: pista.nombre,
        tipo: pista.tipo,
        descripcion: pista.descripcion || '',
        precioHora: pista.precioHora,
        imagen: pista.imagen || '',
        status: pista.status,
        isActive: pista.isActive,
      });
    } else {
      setPistaEditando(null);
      setFormData({
        nombre: '',
        tipo: 'padel',
        descripcion: '',
        precioHora: 0,
        imagen: '',
        status: 'disponible',
        isActive: true,
      });
    }
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setPistaEditando(null);
  };

  const handleGuardar = () => {
    // Validaciones
    if (!formData.nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }
    if (!formData.tipo) {
      alert('El tipo es obligatorio');
      return;
    }
    if (formData.precioHora <= 0) {
      alert('El precio por hora debe ser mayor a 0');
      return;
    }

    if (pistaEditando) {
      onEdit(pistaEditando.slug, formData);
    } else {
      onCreate(formData);
    }
    handleCerrarModal();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Gestión de Pistas</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleAbrirModal()}
        >
          Nueva Pista
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Tipo</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
              <TableCell><strong>Activa</strong></TableCell>
              <TableCell><strong>Precio/Hora</strong></TableCell>
              <TableCell align="right"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pistas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No hay pistas registradas
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              pistas.map((pista) => (
                <TableRow key={pista.slug} hover>
                  <TableCell>
                    <Typography fontWeight="medium">{pista.nombre}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {pista.slug}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={pista.tipo}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={pista.status}
                      size="small"
                      color={pista.status === 'disponible' ? 'success' : 'warning'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={pista.isActive ? 'Sí' : 'No'}
                      size="small"
                      color={pista.isActive ? 'success' : 'error'}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="medium">
                      {pista.precioHora.toFixed(2)}€
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleAbrirModal(pista)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => onDelete(pista.slug)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Creación/Edición */}
      <Dialog open={modalAbierto} onClose={handleCerrarModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          {pistaEditando ? 'Editar Pista' : 'Nueva Pista'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <FormField
              label="Nombre"
              value={formData.nombre}
              onChange={(value) => setFormData({ ...formData, nombre: value })}
              required
              placeholder="Ej: Pista Central"
            />

            <FormSelect
              label="Tipo"
              value={formData.tipo}
              onChange={(value) => setFormData({ ...formData, tipo: value })}
              options={DEPORTES}
              required
            />

            <FormField
              label="Descripción"
              value={formData.descripcion || ''}
              onChange={(value) => setFormData({ ...formData, descripcion: value })}
              multiline
              rows={3}
            />

            <FormField
              label="Precio por Hora (€)"
              type="number"
              value={formData.precioHora.toString()}
              onChange={(value) => setFormData({ ...formData, precioHora: parseFloat(value) || 0 })}
              required
            />

            <FormField
              label="Imagen (URL)"
              value={formData.imagen || ''}
              onChange={(value) => setFormData({ ...formData, imagen: value })}
              placeholder="https://..."
            />

            <FormSelect
              label="Estado"
              value={formData.status || ''}
              onChange={(value) => setFormData({ ...formData, status: value })}
              options={[
                { value: 'disponible', label: 'Disponible' },
                { value: 'mantenimiento', label: 'Mantenimiento' },
                { value: 'reservada', label: 'Reservada' }
              ]}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCerrarModal}>Cancelar</Button>
          <Button onClick={handleGuardar} variant="contained" color="primary">
            {pistaEditando ? 'Guardar Cambios' : 'Crear Pista'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
