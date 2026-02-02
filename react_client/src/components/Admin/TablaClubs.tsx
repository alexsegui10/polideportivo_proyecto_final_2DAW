import { useState } from 'react';
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
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { Club, ClubCreateRequest, ClubUpdateRequest, Usuario } from '../../types';
import { useUsuarios } from '../../hooks';
import { FormField, FormSelect, UserSelector } from '../Shared';
import { DEPORTES } from '../../constants/deportes';

interface TablaClubsProps {
  clubs: Club[];
  onCreate: (club: ClubCreateRequest) => Promise<Club>;
  onUpdate: (slug: string, club: ClubUpdateRequest) => Promise<Club>;
  onDelete: (slug: string) => Promise<void>;
}

export const TablaClubs = ({ clubs, onCreate, onUpdate, onDelete }: TablaClubsProps) => {
  const { usuarios } = useUsuarios();
  const entrenadores = usuarios.filter((u: Usuario) => u.role === 'entrenador');

  const [modalAbierto, setModalAbierto] = useState(false);
  const [clubEditando, setClubEditando] = useState<Club | null>(null);
  const [selectorEntrenadorAbierto, setSelectorEntrenadorAbierto] = useState(false);

  const [formData, setFormData] = useState<ClubCreateRequest>({
    nombre: '',
    descripcion: '',
    deporte: '',
    imagen: '',
    entrenadorId: 0,
    maxMiembros: 20,
    nivel: 'principiante',
    precioMensual: 0,
    status: 'activo',
    isActive: true
  });

  const handleAbrirModal = (club?: Club) => {
    if (club) {
      setClubEditando(club);
      setFormData({
        nombre: club.nombre,
        descripcion: club.descripcion || '',
        deporte: club.deporte,
        imagen: club.imagen || '',
        entrenadorId: club.entrenadorId,
        maxMiembros: club.maxMiembros,
        nivel: club.nivel,
        precioMensual: club.precioMensual,
        status: club.status,
        isActive: club.isActive
      });
    } else {
      setClubEditando(null);
      setFormData({
        nombre: '',
        descripcion: '',
        deporte: '',
        imagen: '',
        entrenadorId: 0,
        maxMiembros: 20,
        nivel: 'principiante',
        precioMensual: 0,
        status: 'activo',
        isActive: true
      });
    }
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setClubEditando(null);
  };

  const handleGuardar = async () => {
    if (!formData.nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }
    if (!formData.deporte.trim()) {
      alert('El deporte es obligatorio');
      return;
    }
    if (formData.entrenadorId <= 0) {
      alert('Debes seleccionar un entrenador');
      return;
    }
    if (formData.precioMensual < 0) {
      alert('El precio debe ser mayor o igual a 0');
      return;
    }

    try {
      if (clubEditando) {
        const updateData: ClubUpdateRequest = { ...formData };
        await onUpdate(clubEditando.slug, updateData);
      } else {
        await onCreate(formData);
      }
      handleCerrarModal();
    } catch (error) {
      console.error('Error al guardar club:', error);
      alert('Error al guardar club');
    }
  };

  const handleEliminar = async (slug: string) => {
    if (window.confirm('¿Estás seguro de eliminar este club?')) {
      try {
        await onDelete(slug);
      } catch (error) {
        console.error('Error al eliminar club:', error);
        alert('Error al eliminar club');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activo': return 'success';
      case 'inactivo': return 'warning';
      case 'eliminado': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      {/* Acciones */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="contained" onClick={() => handleAbrirModal()}>
          Nuevo Club
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Deporte</TableCell>
              <TableCell>Nivel</TableCell>
              <TableCell>Entrenador ID</TableCell>
              <TableCell>Max Miembros</TableCell>
              <TableCell>Precio/mes</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clubs.map((club) => (
              <TableRow key={club.id}>
                <TableCell>{club.nombre}</TableCell>
                <TableCell>{club.deporte}</TableCell>
                <TableCell>
                  <Chip label={club.nivel} size="small" variant="outlined" />
                </TableCell>
                <TableCell>{club.entrenadorId}</TableCell>
                <TableCell>{club.maxMiembros}</TableCell>
                <TableCell>{club.precioMensual.toFixed(2)} €</TableCell>
                <TableCell>
                  <Chip label={club.status} color={getStatusColor(club.status)} size="small" />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleAbrirModal(club)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleEliminar(club.slug)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal */}
      <Dialog open={modalAbierto} onClose={handleCerrarModal} maxWidth="sm" fullWidth>
        <DialogTitle>{clubEditando ? 'Editar Club' : 'Nuevo Club'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormField
              label="Nombre"
              value={formData.nombre}
              onChange={(value) => setFormData({ ...formData, nombre: value })}
              required
            />
            <FormField
              label="Descripción"
              value={formData.descripcion || ''}
              onChange={(value) => setFormData({ ...formData, descripcion: value })}
              multiline
              rows={3}
            />
            <FormSelect
              label="Deporte"
              value={formData.deporte}
              onChange={(value) => setFormData({ ...formData, deporte: value })}
              options={DEPORTES}
              required
            />
            <FormField
              label="Imagen URL"
              value={formData.imagen || ''}
              onChange={(value) => setFormData({ ...formData, imagen: value })}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            <Box>
              <Button 
                variant="outlined" 
                onClick={() => setSelectorEntrenadorAbierto(true)}
                fullWidth
                sx={{ mb: 1 }}
              >
                Seleccionar Entrenador
              </Button>
              {formData.entrenadorId && (
                <Typography variant="body2" color="text.secondary">
                  Entrenador: {entrenadores.find(e => e.id === formData.entrenadorId)?.nombre || 'No encontrado'}
                </Typography>
              )}
            </Box>
            <FormField
              label="Max Miembros"
              type="number"
              value={(formData.maxMiembros || 0).toString()}
              onChange={(value) => setFormData({ ...formData, maxMiembros: parseInt(value) || 0 })}
            />
            <FormSelect
              label="Nivel"
              value={formData.nivel || ''}
              onChange={(value) => setFormData({ ...formData, nivel: value })}
              options={[
                { value: 'principiante', label: 'Principiante' },
                { value: 'intermedio', label: 'Intermedio' },
                { value: 'avanzado', label: 'Avanzado' }
              ]}
            />
            <FormField
              label="Precio Mensual (€)"
              type="number"
              value={formData.precioMensual.toString()}
              onChange={(value) => setFormData({ ...formData, precioMensual: parseFloat(value) || 0 })}
              required
            />
            <FormSelect
              label="Status"
              value={formData.status || ''}
              onChange={(value) => setFormData({ ...formData, status: value })}
              options={[
                { value: 'activo', label: 'Activo' },
                { value: 'inactivo', label: 'Inactivo' }
              ]}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCerrarModal}>Cancelar</Button>
          <Button onClick={handleGuardar} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>

      <UserSelector
        open={selectorEntrenadorAbierto}
        onClose={() => setSelectorEntrenadorAbierto(false)}
        onSelectUser={(user) => {
          setFormData({ ...formData, entrenadorId: user.id });
          setSelectorEntrenadorAbierto(false);
        }}
        usuarios={usuarios}
        roleFilter="entrenador"
        title="Seleccionar Entrenador"
      />
    </Box>
  );
};
