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
  IconButton,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import RestoreIcon from '@mui/icons-material/Restore';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { showAlert, successAlert, errorAlert } from '../../utils/sweetAlert';
import { ClubMiembro, ClubSuscripcion } from '../../types';
import { useClubMiembroMutations } from '../../hooks/mutations/useClubMiembroMutations';
import { MultiUserSelector } from '../Shared';
import { useUsuarios } from '../../hooks';
import { Usuario } from '../../types';

interface ModalGestionClubProps {
  open: boolean;
  onClose: () => void;
  clubId: number;
  clubNombre: string;
  maxMiembros: number;
  clubPrecioMensual: number;
}

export const ModalGestionClub = ({
  open,
  onClose,
  clubId,
  clubNombre,
  maxMiembros,
  clubPrecioMensual
}: ModalGestionClubProps) => {
  const [tabValue, setTabValue] = useState(0);
  const [miembros, setMiembros] = useState<ClubMiembro[]>([]);
  const [suscripciones, setSuscripciones] = useState<ClubSuscripcion[]>([]);
  const [loading, setLoading] = useState(false);
  const [userSelectorOpen, setUserSelectorOpen] = useState(false);
  const { usuarios } = useUsuarios();
  const { 
    getMiembrosByClubId, 
    getSuscripcionesByClubId, 
    inscribirMiembro, 
    darDeBajaMiembro, 
    expulsarMiembro, 
    reactivarMiembro, 
    crearSuscripcion, 
    cancelarSuscripcion, 
    pausarSuscripcion, 
    reanudarSuscripcion 
  } = useClubMiembroMutations();

  const loadData = async () => {
    setLoading(true);
    try {
      const [miembrosData, suscripcionesData] = await Promise.all([
        getMiembrosByClubId(clubId),
        getSuscripcionesByClubId(clubId)
      ]);
      setMiembros(miembrosData);
      setSuscripciones(suscripcionesData);
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
  }, [open, clubId]);

  const handleAgregarMiembro = () => {
    setUserSelectorOpen(true);
  };

  const handleUserSelect = async (usuarios: Usuario[]) => {
    setUserSelectorOpen(false);
    
    const errores: string[] = [];
    const exitosos: string[] = [];
    const yaRegistrados: string[] = [];

    for (const usuario of usuarios) {
      try {
        await inscribirMiembro({
          clubId,
          usuarioId: usuario.id
        });
        exitosos.push(`${usuario.nombre} ${usuario.apellidos || ''}`);
      } catch (error: any) {
        const errorMsg = error.response?.data?.message || error.message || 'Error desconocido';
        const usuarioNombre = `${usuario.nombre} ${usuario.apellidos || ''}`;
        
        if (errorMsg.toLowerCase().includes('lleno') || errorMsg.toLowerCase().includes('capacidad')) {
          errores.push(`${usuarioNombre}: Club lleno (capacidad máxima alcanzada)`);
        } else if (errorMsg.toLowerCase().includes('ya inscrito') || errorMsg.toLowerCase().includes('ya existe') || errorMsg.toLowerCase().includes('duplicado')) {
          yaRegistrados.push(usuarioNombre);
        } else {
          errores.push(`${usuarioNombre}: ${errorMsg}`);
        }
      }
    }

    // Mostrar resultados detallados
    if (exitosos.length > 0 && errores.length === 0 && yaRegistrados.length === 0) {
      await successAlert('¡Completado!', `${exitosos.length} miembro(s) añadido(s) correctamente`);
    } else if (exitosos.length > 0 || yaRegistrados.length > 0 || errores.length > 0) {
      let htmlContent = '';
      
      if (exitosos.length > 0) {
        htmlContent += `<div style="text-align: left; margin-bottom: 15px;"><strong style="color: #4caf50;">✓ Exitosos (${exitosos.length}):</strong><br>${exitosos.map(n => `  • ${n}`).join('<br>')}</div>`;
      }
      
      if (yaRegistrados.length > 0) {
        htmlContent += `<div style="text-align: left; margin-bottom: 15px;"><strong style="color: #ff9800;">⚠ Ya miembros (${yaRegistrados.length}):</strong><br>${yaRegistrados.map(n => `  • ${n}`).join('<br>')}</div>`;
      }
      
      if (errores.length > 0) {
        htmlContent += `<div style="text-align: left;"><strong style="color: #f44336;">✗ Errores (${errores.length}):</strong><br>${errores.map(e => `  • ${e}`).join('<br>')}</div>`;
      }
      
      await showAlert({
        title: exitosos.length > 0 ? 'Completado parcialmente' : 'No se pudieron añadir miembros',
        html: htmlContent,
        icon: exitosos.length > 0 ? 'warning' : 'error',
        width: '600px'
      });
    } else {
      await errorAlert('Error', 'No se pudo procesar ninguna inscripción');
    }

    loadData();
  };

  const handleDarDeBaja = async (miembro: ClubMiembro) => {
    const result = await showAlert({
      title: '¿Dar de baja?',
      text: `Se dará de baja a ${miembro.usuarioNombre}. Se cancelarán sus suscripciones activas.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff9800',
      cancelButtonColor: '#757575',
      confirmButtonText: 'Sí, dar de baja',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await darDeBajaMiembro(miembro.uid);
        await successAlert('¡Dado de baja!', 'Miembro dado de baja correctamente');
        loadData();
      } catch (error) {
        await errorAlert('Error', 'No se pudo dar de baja');
      }
    }
  };

  const handleExpulsar = async (miembro: ClubMiembro) => {
    const result = await showAlert({
      title: '¿Expulsar miembro?',
      text: `Se expulsará a ${miembro.usuarioNombre}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#757575',
      confirmButtonText: 'Sí, expulsar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await expulsarMiembro(miembro.uid);
        await successAlert('¡Expulsado!', 'Miembro expulsado correctamente');
        loadData();
      } catch (error) {
        await errorAlert('Error', 'No se pudo expulsar');
      }
    }
  };

  const handleReactivar = async (miembro: ClubMiembro) => {
    try {
      await reactivarMiembro(miembro.uid);
      await successAlert('¡Reactivado!', 'Miembro reactivado correctamente');
      loadData();
    } catch (error) {
      await errorAlert('Error', 'No se pudo reactivar');
    }
  };

  const handleCrearSuscripcion = async (miembroUid: string) => {
    const result = await showAlert({
      title: 'Crear suscripción',
      text: `Se creará una suscripción con el precio del club (${clubPrecioMensual.toFixed(2)}€/mes)`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await crearSuscripcion({
          miembroUid,
          precioMensual: clubPrecioMensual
        });
        await successAlert('¡Creada!', 'Suscripción creada correctamente');
        loadData();
      } catch (error: any) {
        const mensaje = error.response?.data?.message || 'Error al crear suscripción';
        await errorAlert('Error', mensaje);
      }
    }
  };

  const handleCancelarSuscripcion = async (suscripcion: ClubSuscripcion) => {
    const result = await showAlert({
      title: '¿Cancelar suscripción?',
      text: 'La suscripción se marcará como cancelada',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#757575',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No'
    });

    if (result.isConfirmed) {
      try {
        await cancelarSuscripcion(suscripcion.uid);
        await successAlert('¡Cancelada!', 'Suscripción cancelada correctamente');
        loadData();
      } catch (error) {
        await errorAlert('Error', 'No se pudo cancelar');
      }
    }
  };

  const handlePausarSuscripcion = async (suscripcion: ClubSuscripcion) => {
    try {
      await pausarSuscripcion(suscripcion.uid);
      await successAlert('¡Pausada!', 'Suscripción pausada correctamente');
      loadData();
    } catch (error) {
      await errorAlert('Error', 'No se pudo pausar');
    }
  };

  const handleReanudarSuscripcion = async (suscripcion: ClubSuscripcion) => {
    try {
      await reanudarSuscripcion(suscripcion.uid);
      await successAlert('¡Reanudada!', 'Suscripción reanudada correctamente');
      loadData();
    } catch (error) {
      await errorAlert('Error', 'No se pudo reanudar');
    }
  };

  const getMiembroStatusColor = (status: string) => {
    switch (status) {
      case 'activo': return 'success';
      case 'baja': return 'warning';
      case 'expulsado': return 'error';
      default: return 'default';
    }
  };

  const getSuscripcionStatusColor = (status: string) => {
    switch (status) {
      case 'activa': return 'success';
      case 'pausada': return 'warning';
      case 'cancelada': return 'default';
      case 'impago': return 'error';
      default: return 'default';
    }
  };

  const miembrosActivos = miembros.filter(m => m.status === 'activo').length;
  const espaciosDisponibles = maxMiembros - miembrosActivos;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6">{clubNombre}</Typography>
          <Box display="flex" gap={2} mt={1}>
            <Chip
              label={`${miembrosActivos}/${maxMiembros} miembros activos`}
              color={espaciosDisponibles > 0 ? 'success' : 'error'}
              size="small"
            />
            <Chip
              label={`${suscripciones.filter(s => s.status === 'activa').length} suscripciones activas`}
              color="primary"
              size="small"
            />
          </Box>
        </DialogTitle>

        <DialogContent>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 2 }}>
            <Tab label="Miembros" />
            <Tab label="Suscripciones" />
          </Tabs>

          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* TAB MIEMBROS */}
              {tabValue === 0 && (
                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {espaciosDisponibles > 0
                        ? `${espaciosDisponibles} espacios disponibles`
                        : 'Club lleno'}
                    </Typography>
                    <Button
                      startIcon={<PersonAddIcon />}
                      onClick={handleAgregarMiembro}
                      disabled={espaciosDisponibles === 0}
                      size="small"
                      variant="contained"
                    >
                      Añadir miembro
                    </Button>
                  </Box>

                  {miembros.length === 0 ? (
                    <Alert severity="info">No hay miembros en este club</Alert>
                  ) : (
                    <List>
                      {miembros.map((miembro) => (
                        <ListItem key={miembro.uid} divider>
                          <ListItemText
                            primary={miembro.usuarioNombre}
                            secondary={
                              <>
                                {miembro.usuarioEmail} •{' '}
                                Desde: {new Date(miembro.fechaInscripcion).toLocaleDateString()}
                                {miembro.tieneSuscripcionActiva && ' • Con suscripción activa'}
                              </>
                            }
                          />
                          <Box display="flex" gap={1} alignItems="center">
                            <Chip
                              label={miembro.status}
                              color={getMiembroStatusColor(miembro.status)}
                              size="small"
                            />
                            {miembro.status === 'activo' && (
                              <>
                                <IconButton
                                  size="small"
                                  color="warning"
                                  onClick={() => handleDarDeBaja(miembro)}
                                  title="Dar de baja"
                                >
                                  <PersonOffIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleExpulsar(miembro)}
                                  title="Expulsar"
                                >
                                  <RemoveCircleIcon fontSize="small" />
                                </IconButton>
                              </>
                            )}
                            {miembro.status === 'baja' && (
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleReactivar(miembro)}
                                title="Reactivar"
                              >
                                <RestoreIcon fontSize="small" />
                              </IconButton>
                            )}
                            {miembro.status === 'activo' && !miembro.tieneSuscripcionActiva && (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleCrearSuscripcion(miembro.uid)}
                              >
                                + Suscripción
                              </Button>
                            )}
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>
              )}

              {/* TAB SUSCRIPCIONES */}
              {tabValue === 1 && (
                <Box>
                  {suscripciones.length === 0 ? (
                    <Alert severity="info">No hay suscripciones en este club</Alert>
                  ) : (
                    <List>
                      {suscripciones.map((suscripcion) => (
                        <ListItem key={suscripcion.uid} divider>
                          <ListItemText
                            primary={suscripcion.usuarioNombre}
                            secondary={
                              <>
                                {suscripcion.precioMensual}€/mes •{' '}
                                Próximo cobro: {new Date(suscripcion.proximoCobro).toLocaleDateString()}
                                {suscripcion.status === 'impago' && ` • Intentos: ${suscripcion.intentosCobro}/3`}
                              </>
                            }
                          />
                          <Box display="flex" gap={1} alignItems="center">
                            <Chip
                              label={suscripcion.status}
                              color={getSuscripcionStatusColor(suscripcion.status)}
                              size="small"
                            />
                            {suscripcion.status === 'activa' && (
                              <>
                                <IconButton
                                  size="small"
                                  color="warning"
                                  onClick={() => handlePausarSuscripcion(suscripcion)}
                                  title="Pausar"
                                >
                                  <PauseCircleIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleCancelarSuscripcion(suscripcion)}
                                  title="Cancelar"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </>
                            )}
                            {suscripcion.status === 'pausada' && (
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleReanudarSuscripcion(suscripcion)}
                                title="Reanudar"
                              >
                                <PlayCircleIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
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
        title="Seleccionar usuarios para inscribir"
      />
    </>
  );
};
