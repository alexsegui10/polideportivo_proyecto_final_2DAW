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
import { Usuario, UsuarioCreateRequest, UsuarioUpdateRequest } from '../../types';
import { FormField, FormSelect } from '../Shared';
import Swal from 'sweetalert2';

interface TablaUsuariosProps {
  usuarios: Usuario[];
  onCreate: (usuario: UsuarioCreateRequest) => Promise<Usuario>;
  onUpdate: (slug: string, usuario: UsuarioUpdateRequest) => Promise<Usuario>;
  onDelete: (slug: string) => Promise<void>;
}

export const TablaUsuarios = ({ usuarios, onCreate, onUpdate, onDelete }: TablaUsuariosProps) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);

  // Formulario
  const [formData, setFormData] = useState<UsuarioCreateRequest>({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    dni: '',
    passwordHash: '',
    role: 'cliente',
    status: 'activo',
    isActive: true
  });

  const handleAbrirModal = (usuario?: any) => {
    if (usuario) {
      setUsuarioEditando(usuario.slug);
      setFormData({
        nombre: usuario.nombre,
        apellidos: usuario.apellidos || '',
        email: usuario.email,
        telefono: usuario.telefono || '',
        dni: usuario.dni || '',
        passwordHash: '', // No se muestra por seguridad
        role: usuario.role,
        status: usuario.status,
        isActive: usuario.isActive
      });
    } else {
      setUsuarioEditando(null);
      setFormData({
        nombre: '',
        apellidos: '',
        email: '',
        telefono: '',
        dni: '',
        passwordHash: '',
        role: 'cliente',
        status: 'activo',
        isActive: true
      });
    }
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setUsuarioEditando(null);
  };

  const handleGuardar = async () => {
    // Validaciones
    if (!formData.nombre.trim()) {
      Swal.fire('Error', 'El nombre es obligatorio', 'error');
      return;
    }
    if (!formData.email.trim()) {
      Swal.fire('Error', 'El email es obligatorio', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      Swal.fire('Error', 'El email no es válido', 'error');
      return;
    }
    if (!usuarioEditando && !formData.passwordHash.trim()) {
      Swal.fire('Error', 'La contraseña es obligatoria', 'error');
      return;
    }
    if (!formData.role) {
      Swal.fire('Error', 'El rol es obligatorio', 'error');
      return;
    }

    try {
      if (usuarioEditando) {
        const updateData: UsuarioUpdateRequest = {
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          email: formData.email,
          telefono: formData.telefono,
          dni: formData.dni,
          role: formData.role,
          status: formData.status,
          isActive: formData.isActive
        };
        await onUpdate(usuarioEditando.slug, updateData);
      } else {
        await onCreate(formData);
      }
      handleCerrarModal();
      await Swal.fire('¡Guardado!', 'Usuario guardado correctamente', 'success');
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      Swal.fire('Error', 'Error al guardar usuario. Revisa que todos los campos estén correctos.', 'error');
    }
  };

  const handleEliminar = async (slug: string) => {
    const result = await Swal.fire({
      title: '¿Eliminar usuario?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d32f2f'
    });
    if (result.isConfirmed) {
      try {
        await onDelete(slug);
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'error';
      case 'entrenador': return 'warning';
      case 'cliente': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activo': return 'success';
      case 'inactivo': return 'default';
      case 'suspendido': return 'warning';
      case 'eliminado': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      {/* Acciones */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 3 }}>
        <Button variant="contained" onClick={() => handleAbrirModal()}>
          Nuevo Usuario
        </Button>
      </Box>

      {/* Tabla */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Slug</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>DNI</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Activo</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell>
                  <Typography variant="caption" color="text.secondary">
                    {usuario.slug}
                  </Typography>
                </TableCell>
                <TableCell>{usuario.nombre} {usuario.apellidos}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>{usuario.dni || '-'}</TableCell>
                <TableCell>{usuario.telefono || '-'}</TableCell>
                <TableCell>
                  <Chip label={usuario.role} color={getRoleColor(usuario.role)} size="small" />
                </TableCell>
                <TableCell>
                  <Chip label={usuario.status} color={getStatusColor(usuario.status)} size="small" />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={usuario.isActive ? 'Sí' : 'No'} 
                    color={usuario.isActive ? 'success' : 'default'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleAbrirModal(usuario)}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleEliminar(usuario.slug)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal Crear/Editar */}
      <Dialog open={modalAbierto} onClose={handleCerrarModal} maxWidth="sm" fullWidth>
        <DialogTitle>{usuarioEditando ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <FormField
              label="Nombre"
              value={formData.nombre}
              onChange={(value) => setFormData({ ...formData, nombre: value })}
              required
            />
            <FormField
              label="Apellidos"
              value={formData.apellidos || ''}
              onChange={(value) => setFormData({ ...formData, apellidos: value })}
            />
            <FormField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
              required
            />
            <FormField
              label="DNI"
              value={formData.dni || ''}
              onChange={(value) => setFormData({ ...formData, dni: value })}
            />
            <FormField
              label="Teléfono"
              value={formData.telefono || ''}
              onChange={(value) => setFormData({ ...formData, telefono: value })}
            />
            {!usuarioEditando && (
              <FormField
                label="Contraseña"
                type="password"
                value={formData.passwordHash}
                onChange={(value) => setFormData({ ...formData, passwordHash: value })}
                required
              />
            )}
            <FormSelect
              label="Role"
              value={formData.role || ''}
              onChange={(value) => setFormData({ ...formData, role: value })}
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'cliente', label: 'Cliente' },
                { value: 'entrenador', label: 'Entrenador' }
              ]}
              required
            />
            <FormSelect
              label="Status"
              value={formData.status || ''}
              onChange={(value) => setFormData({ ...formData, status: value })}
              options={[
                { value: 'activo', label: 'Activo' },
                { value: 'inactivo', label: 'Inactivo' },
                { value: 'suspendido', label: 'Suspendido' }
              ]}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCerrarModal}>Cancelar</Button>
          <Button onClick={handleGuardar} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
