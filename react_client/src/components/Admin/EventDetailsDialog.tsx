import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Grid,
    Chip,
    IconButton,
    Divider,
    LinearProgress
} from '@mui/material';
import {
    Close as CloseIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    AccessTime as TimeIcon,
    Place as PlaceIcon,
    Person as PersonIcon,
    SportsTennis as SportsIcon,
    AttachMoney as MoneyIcon,
    Group as GroupIcon,
    Notes as NotesIcon,
    Event as EventIcon
} from '@mui/icons-material';
import { ClasePublica, Reserva } from '../../types';
import { usePistas } from '../../hooks';
import { useUsuarios } from '../../hooks';

interface EventDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    event: ClasePublica | Reserva | null;
    type: 'clase' | 'reserva' | null;
    onEdit: (event: any) => void;
    onDelete: (event: any) => void;
    onManageMembers?: (clase: ClasePublica) => void;
}

export const EventDetailsDialog = ({
    open,
    onClose,
    event,
    type,
    onEdit,
    onDelete,
    onManageMembers
}: EventDetailsDialogProps) => {
    const { pistas } = usePistas();
    const { usuarios } = useUsuarios();
    
    if (!event) return null;

    const isClase = type === 'clase';
    const data = event as any; // Helper para acceder a propiedades comunes

    // Obtener nombre de pista
    const pista = pistas.find(p => p.id === data.pistaId);
    const pistaNombre = pista ? pista.nombre : `Pista #${data.pistaId}`;

    //obetner nombre entrenador
    const usuario = usuarios.find(u => u.id === (isClase ? data.entrenadorId : data.usuarioId));
    const usuarioNombre = usuario ? `${usuario.nombre} ${usuario.apellidos || ''}` : `Usuario #${isClase ? data.entrenadorId : data.usuarioId}`;

    // Colores y Tema según tipo
    const themeColor = isClase ? '#3949ab' : '#00695c'; 
    const themeLight = isClase ? '#e8eaf6' : '#e0f2f1';

    // Título y Subtítulo
    const title = isClase ? data.nombre : 'Reserva de Pista';
    const subtitle = isClase ? data.deporte : (data.tipoReserva || 'Alquiler');

    // Estado Color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmada':
            case 'confirmado': return 'success';
            case 'pendiente': return 'warning';
            case 'en_curso': return 'secondary';
            case 'cancelada':
            case 'cancelado': return 'error';
            case 'completada':
            case 'completado': return 'info';
            case 'no_show': return 'error';
            default: return 'default';
        }
    };

    // Formatear fechas
    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('es-ES', {
            weekday: 'long', day: 'numeric', month: 'long'
        });
    };

    const formatTime = (dateStr: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleTimeString('es-ES', {
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2, overflow: 'hidden' }
            }}
        >
            {/* Header Profesional */}
            <Box sx={{
                bgcolor: themeColor,
                color: 'white',
                p: 3,
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between'
            }}>
                <Box>
                    <Typography variant="overline" sx={{ opacity: 0.9, letterSpacing: 1 }}>
                        {isClase ? 'CLASE GRUPAL' : 'RESERVA'}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" sx={{ mt: 0.5 }}>
                        {title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Chip
                            label={data.status?.toUpperCase()}
                            size="small"
                            color={getStatusColor(data.status)}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                fontWeight: 'bold',
                                border: '1px solid rgba(255,255,255,0.3)'
                            }}
                        />
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            | {subtitle}
                        </Typography>
                    </Box>
                </Box>
                <IconButton onClick={onClose} sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    {/* Fecha y Hora */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: themeLight, p: 2, borderRadius: 2 }}>
                            <EventIcon sx={{ color: themeColor, fontSize: 30 }} />
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Fecha</Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    {formatDate(data.fechaHoraInicio)}
                                </Typography>
                            </Box>
                            <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                            <TimeIcon sx={{ color: themeColor, fontSize: 30 }} />
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Horario</Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    {formatTime(data.fechaHoraInicio)} - {formatTime(data.fechaHoraFin)}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Info Principal */}
                    <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                            <PlaceIcon color="action" />
                            <Box>
                                <Typography variant="caption" color="text.secondary">Pista</Typography>
                                <Typography variant="body2" fontWeight="medium">
                                    {pistaNombre}
                                </Typography>
                            </Box>
                        </Box>

                        {!isClase && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <MoneyIcon color="action" />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Precio</Typography>
                                    <Typography variant="body2" fontWeight="medium">
                                        €{data.precio?.toFixed(2)}
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        {isClase && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <SportsIcon color="action" />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Nivel</Typography>
                                    <Typography variant="body2" fontWeight="medium">
                                        {data.nivel}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </Grid>

                    <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                            <PersonIcon color="action" />
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    {isClase ? 'Entrenador' : 'Usuario'}
                                </Typography>
                                <Typography variant="body2" fontWeight="medium">
                                    {isClase
                                        ? ` ${usuarioNombre} `
                                        : (data.usuarioNombre ? `${data.usuarioNombre} ${data.usuarioApellidos || ''}` : `Usuario #${data.usuarioId}`)}
                                </Typography>
                            </Box>
                        </Box>

                        {isClase && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <GroupIcon color="action" />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Participantes</Typography>
                                    <Typography variant="body2" fontWeight="medium">
                                        Max: {data.maxParticipantes}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </Grid>

                    {/* Rango de Ocupación para Clases */}
                    {isClase && (
                        <Grid item xs={12}>
                            <Box sx={{ mt: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption" fontWeight="bold" color={themeColor}>
                                        Capacidad
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {data.maxParticipantes} plazas totales
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={0} // TODO: Conectar con inscritos reales
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        bgcolor: themeLight,
                                        '& .MuiLinearProgress-bar': { bgcolor: themeColor }
                                    }}
                                />
                            </Box>
                        </Grid>
                    )}

                    {/* Notas / Descripción */}
                    {(data.descripcion || data.notas) && (
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 1.5, bgcolor: '#fafafa', p: 2, borderRadius: 2, border: '1px dashed #e0e0e0' }}>
                                <NotesIcon color="action" fontSize="small" sx={{ mt: 0.5 }} />
                                <Box>
                                    <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                        {isClase ? 'DESCRIPCIÓN' : 'NOTAS ADICIONALES'}
                                    </Typography>
                                    <Typography variant="body2" color="text.primary">
                                        {data.descripcion || data.notas}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ p: 2.5, justifyContent: 'space-between' }}>
                <Button
                    startIcon={<DeleteIcon />}
                    color="error"
                    onClick={() => onDelete(event)}
                >
                    Eliminar
                </Button>
                <Box>
                    {isClase && onManageMembers && (
                        <Button
                            startIcon={<GroupIcon />}
                            color="primary"
                            onClick={() => onManageMembers(event as ClasePublica)}
                            sx={{ mr: 1 }}
                        >
                            Gestionar Miembros
                        </Button>
                    )}
                    <Button onClick={onClose} sx={{ mr: 1, color: 'text.secondary' }}>
                        Cerrar
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => onEdit(event)}
                        sx={{ bgcolor: themeColor, '&:hover': { bgcolor: themeColor } }}
                    >
                        Editar
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};
