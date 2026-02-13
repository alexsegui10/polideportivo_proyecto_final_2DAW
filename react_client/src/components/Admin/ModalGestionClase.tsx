import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { showAlert, successAlert, errorAlert } from '../../utils/sweetAlert';
import { ClaseInscripcion, ClaseWaitlist } from '../../types';
import { useClaseInscripcionMutations } from '../../hooks/mutations/useClaseInscripcionMutations';
import { MultiUserSelector } from '../Shared';
import { useUsuarios } from '../../hooks';
import { Usuario } from '../../types';

interface ModalGestionClaseProps {
  open: boolean;
  onClose: () => void;
  claseId: number;
  claseNombre: string;
  maxParticipantes: number;
}

export const ModalGestionClase = ({
  open,
  onClose,
  claseId,
  claseNombre,
  maxParticipantes
}: ModalGestionClaseProps) => {
  const [tabValue, setTabValue] = useState(0);
  const [inscritos, setInscritos] = useState<ClaseInscripcion[]>([]);
  const [waitlist, setWaitlist] = useState<ClaseWaitlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [userSelectorOpen, setUserSelectorOpen] = useState(false);
  const [userSelectorMode, setUserSelectorMode] = useState<'inscripcion' | 'waitlist'>('inscripcion');
  const { usuarios } = useUsuarios();
  const { 
    getInscritosByClaseId, 
    getWaitlistByClaseId, 
    inscribirUsuario, 
    agregarAWaitlist, 
    eliminarInscripcion, 
    quitarDeWaitlist, 
    marcarAsistencia 
  } = useClaseInscripcionMutations();

  const loadData = async () => {
    setLoading(true);
    try {
      const [inscritosData, waitlistData] = await Promise.all([
        getInscritosByClaseId(claseId),
        getWaitlistByClaseId(claseId)
      ]);
      setInscritos(inscritosData);
      setWaitlist(waitlistData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      await errorAlert('Error', 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open, claseId]);

  const handleAgregarInscrito = () => {
    setUserSelectorMode('inscripcion');
    setUserSelectorOpen(true);
  };

  const handleAgregarWaitlist = () => {
    setUserSelectorMode('waitlist');
    setUserSelectorOpen(true);
  };

  const handleUserSelect = async (usuarios: Usuario[]) => {
    setUserSelectorOpen(false);
    
    const errores: string[] = [];
    const exitosos: string[] = [];
    const yaRegistrados: string[] = [];

    for (const usuario of usuarios) {
      try {
        if (userSelectorMode === 'inscripcion') {
          await inscribirUsuario({
            claseId,
            usuarioId: usuario.id,
            metodoPago: 'gratuita'
          });
          exitosos.push(`${usuario.nombre} ${usuario.apellidos || ''}`);
        } else {
          await agregarAWaitlist({
            claseId,
            usuarioId: usuario.id
          });
          exitosos.push(`${usuario.nombre} ${usuario.apellidos || ''}`);
        }
      } catch (error: any) {
        const errorMsg = error.response?.data?.message || error.message || 'Error desconocido';
        const usuarioNombre = `${usuario.nombre} ${usuario.apellidos || ''}`;
        
        // Detectar tipos de error específicos
        if (errorMsg.toLowerCase().includes('llena') || errorMsg.toLowerCase().includes('capacidad')) {
          errores.push(`${usuarioNombre}: Clase llena (capacidad máxima alcanzada)`);
        } else if (errorMsg.toLowerCase().includes('ya inscrito') || errorMsg.toLowerCase().includes('ya existe') || errorMsg.toLowerCase().includes('duplicado')) {
          yaRegistrados.push(usuarioNombre);
        } else if (errorMsg.toLowerCase().includes('waitlist') && errorMsg.toLowerCase().includes('ya')) {
          yaRegistrados.push(`${usuarioNombre} (ya en waitlist)`);
        } else {
          errores.push(`${usuarioNombre}: ${errorMsg}`);
        }
      }
    }

    // Mostrar resultados con información detallada
    if (exitosos.length > 0 && errores.length === 0 && yaRegistrados.length === 0) {
      await successAlert('¡Completado!', `${exitosos.length} usuario(s) añadido(s) correctamente`);
    } else if (exitosos.length > 0 || yaRegistrados.length > 0 || errores.length > 0) {
      let htmlContent = '';
      
      if (exitosos.length > 0) {
        htmlContent += `<div style="text-align: left; margin-bottom: 15px;"><strong style="color: #4caf50;">✓ Exitosos (${exitosos.length}):</strong><br>${exitosos.map(n => `  • ${n}`).join('<br>')}</div>`;
      }
      
      if (yaRegistrados.length > 0) {
        htmlContent += `<div style="text-align: left; margin-bottom: 15px;"><strong style="color: #ff9800;">⚠ Ya registrados (${yaRegistrados.length}):</strong><br>${yaRegistrados.map(n => `  • ${n}`).join('<br>')}</div>`;
      }
      
      if (errores.length > 0) {
        htmlContent += `<div style="text-align: left;"><strong style="color: #f44336;">✗ Errores (${errores.length}):</strong><br>${errores.map(e => `  • ${e}`).join('<br>')}</div>`;
      }
      
      await showAlert({
        title: exitosos.length > 0 ? 'Completado parcialmente' : 'No se pudieron añadir usuarios',
        html: htmlContent,
        icon: exitosos.length > 0 ? 'warning' : 'error',
        width: '600px'
      });
    } else {
      await errorAlert('Error', 'No se pudo procesar ninguna inscripción');
    }

    loadData();
  };

  const handleEliminarInscrito = async (inscripcion: ClaseInscripcion) => {
    const result = await showAlert({
      title: '¿Eliminar inscrito?',
      text: `Se eliminará a ${inscripcion.usuarioNombre}. Si hay usuarios en waitlist, el primero será promovido automáticamente.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#757575',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await eliminarInscripcion(inscripcion.uid);
        await successAlert('¡Eliminado!', 'Inscripción eliminada correctamente');
        loadData();
      } catch (error) {
        await errorAlert('Error', 'No se pudo eliminar la inscripción');
      }
    }
  };

  const handleQuitarWaitlist = async (waitlistItem: ClaseWaitlist) => {
    const result = await showAlert({
      title: '¿Quitar de la lista?',
      text: `Se quitará a ${waitlistItem.usuarioNombre} de la lista de espera`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#757575',
      confirmButtonText: 'Sí, quitar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await quitarDeWaitlist(waitlistItem.uid);
        await successAlert('¡Quitado!', 'Usuario eliminado de la lista de espera');
        loadData();
      } catch (error) {
        await errorAlert('Error', 'No se pudo quitar de la lista');
      }
    }
  };

  const handleMarcarAsistencia = async (inscripcion: ClaseInscripcion, asistio: boolean) => {
    try {
      await marcarAsistencia(inscripcion.uid, asistio);
      await successAlert('¡Actualizado!', `Marcado como ${asistio ? 'asistió' : 'ausente'}`);
      loadData();
    } catch (error) {
      await errorAlert('Error', 'No se pudo actualizar la asistencia');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmada': return 'success';
      case 'asistio': return 'primary';
      case 'ausente': return 'warning';
      case 'cancelada': return 'error';
      default: return 'default';
    }
  };

  const espaciosDisponibles = maxParticipantes - inscritos.filter(i => i.status === 'confirmada').length;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6">{claseNombre}</Typography>
          <Box display="flex" gap={2} mt={1}>
            <Chip
              label={`${inscritos.filter(i => i.status === 'confirmada').length}/${maxParticipantes} inscritos`}
              color={espaciosDisponibles > 0 ? 'success' : 'error'}
              size="small"
            />
            <Chip
              label={`${waitlist.length} en espera`}
              color="warning"
              size="small"
            />
          </Box>
        </DialogTitle>

        <DialogContent>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 2 }}>
            <Tab label="Inscritos" />
            <Tab label="Lista de Espera" />
          </Tabs>

          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* TAB INSCRITOS */}
              {tabValue === 0 && (
                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {espaciosDisponibles > 0
                        ? `${espaciosDisponibles} espacios disponibles`
                        : 'Clase llena'}
                    </Typography>
                    <Button
                      startIcon={<PersonAddIcon />}
                      onClick={handleAgregarInscrito}
                      disabled={espaciosDisponibles === 0}
                      size="small"
                      variant="contained"
                    >
                      Añadir
                    </Button>
                  </Box>

                  {inscritos.length === 0 ? (
                    <Alert severity="info">No hay inscritos en esta clase</Alert>
                  ) : (
                    <List>
                      {inscritos.map((inscrito) => (
                        <ListItem key={inscrito.uid} divider>
                          <ListItemText
                            primary={inscrito.usuarioNombre}
                            secondary={
                              <>
                                {inscrito.usuarioEmail} • {inscrito.metodoPago}
                                {inscrito.precioPagado > 0 && ` • ${inscrito.precioPagado}€`}
                              </>
                            }
                          />
                          <Box display="flex" gap={1} alignItems="center">
                            <Chip
                              label={inscrito.status}
                              color={getStatusColor(inscrito.status)}
                              size="small"
                            />
                            {inscrito.status === 'confirmada' && (
                              <>
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={() => handleMarcarAsistencia(inscrito, true)}
                                  title="Marcar asistió"
                                >
                                  <CheckCircleIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="warning"
                                  onClick={() => handleMarcarAsistencia(inscrito, false)}
                                  title="Marcar ausente"
                                >
                                  <CancelIcon fontSize="small" />
                                </IconButton>
                              </>
                            )}
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleEliminarInscrito(inscrito)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>
              )}

              {/* TAB WAITLIST */}
              {tabValue === 1 && (
                <Box>
                  <Box display="flex" justifyContent="flex-end" mb={2}>
                    <Button
                      startIcon={<PersonAddIcon />}
                      onClick={handleAgregarWaitlist}
                      size="small"
                      variant="contained"
                    >
                      Añadir a waitlist
                    </Button>
                  </Box>

                  {waitlist.length === 0 ? (
                    <Alert severity="info">No hay usuarios en lista de espera</Alert>
                  ) : (
                    <List>
                      {waitlist.map((item) => (
                        <ListItem key={item.uid} divider>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              bgcolor: 'primary.main',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 2,
                              fontWeight: 'bold'
                            }}
                          >
                            {item.posicion}
                          </Box>
                          <ListItemText
                            primary={item.usuarioNombre}
                            secondary={`${item.usuarioEmail} • Registrado: ${new Date(item.fechaRegistro).toLocaleDateString()}`}
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              color="error"
                              onClick={() => handleQuitarWaitlist(item)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <MultiUserSelector
        open={userSelectorOpen}
        onClose={() => setUserSelectorOpen(false)}
        onSelectUsers={handleUserSelect}
        usuarios={usuarios}
        title={userSelectorMode === 'inscripcion' ? 'Seleccionar usuarios para inscribir' : 'Seleccionar usuarios para waitlist'}
      />
    </>
  );
};
