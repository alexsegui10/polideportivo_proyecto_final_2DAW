import { useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { showAlert, successAlert, errorAlert } from '../../utils/sweetAlert';
import {
    Box,
    Paper,
    Typography,
    IconButton,
    Stack,
    Chip,
    useTheme,
    alpha
} from '@mui/material';
import {
    ChevronLeft as PrevIcon,
    ChevronRight as NextIcon,
    Today as TodayIcon,
    CheckCircle as CheckIcon,
    Group as GroupIcon,
    School as SchoolIcon,
    PlayArrow as PlayIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import { EventClickArg, DateSelectArg, EventContentArg } from '@fullcalendar/core';
import {
    usePistas,
    useUsuarios,
    useClases,
    useClasesMutations,
    useReservas,
    useReservasMutations,
    useAutoUpdateStatus
} from '../../hooks';
import { ModalClase } from './ModalClase';
import { ModalReserva } from './ModalReserva';
import { ModalGestionClase } from './ModalGestionClase';
import { EventTypeDialog } from '../Shared';
import { EventDetailsDialog } from './EventDetailsDialog';
import { Reserva, ClasePublica, Usuario } from '../../types';

export const CalendarioGestion = () => {
    const theme = useTheme();
    const { pistas } = usePistas();
    const { usuarios } = useUsuarios();
    const { clases, refetch: refetchClases } = useClases();
    const { createClase: createClaseMutation, updateClase, deleteClase } = useClasesMutations();
    const { reservas, refetch: refetchReservas } = useReservas();

    // Versión para forzar remount de FullCalendar en cada mutación
    const [calendarVersion, setCalendarVersion] = useState(0);
    const bumpCalendar = () => setCalendarVersion(v => v + 1);
    const { createReserva: createReservaMutation, updateReserva, deleteReserva } = useReservasMutations();
    
    // Auto-actualizar estados basándose en fecha/hora
    useAutoUpdateStatus();

    // Estado para modales de creación/edición
    const [modalClaseAbierto, setModalClaseAbierto] = useState(false);
    const [modalReservaAbierto, setModalReservaAbierto] = useState(false);
    const [dialogTipoEventoAbierto, setDialogTipoEventoAbierto] = useState(false);

    // Estado para datos en edición
    const [claseEditando, setClaseEditando] = useState<ClasePublica | undefined>();
    const [reservaEditando, setReservaEditando] = useState<Reserva | undefined>();
    const [fechasIniciales, setFechasIniciales] = useState<any>(null);

    // Estado para Dialog de Detalles (Nuevo)
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<ClasePublica | Reserva | null>(null);
    const [selectedEventType, setSelectedEventType] = useState<'clase' | 'reserva' | null>(null);

    // Estado para Modal de Gestión de Clase
    const [gestionClaseOpen, setGestionClaseOpen] = useState(false);
    const [claseParaGestionar, setClaseParaGestionar] = useState<ClasePublica | null>(null);

    // Estado del calendario
    const obtenerFechaInicial = (): Date => {
        const fechaGuardada = localStorage.getItem('calendario-fecha-seleccionada');
        if (fechaGuardada) {
            const fecha = new Date(fechaGuardada);
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            fecha.setHours(0, 0, 0, 0);

            if (fecha < hoy) {
                return new Date();
            }
            return fecha;
        }
        return new Date();
    };

    const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(obtenerFechaInicial());
    const [calendarApi, setCalendarApi] = useState<any>(null);

    // Obtener usuario admin por defecto
    const adminUser = usuarios.find((u: Usuario) => u.role === 'admin');
    const adminId = adminUser?.id || 0;

    // Guardar fecha en localStorage
    const actualizarFecha = (nuevaFecha: Date) => {
        setFechaSeleccionada(nuevaFecha);
        localStorage.setItem('calendario-fecha-seleccionada', nuevaFecha.toISOString());
    };

    // Colores estilo imagen de referencia (fondos suaves + bordes)
    const COLORS = {
        tipo: {
            reserva: '#2196F3',      // Azul
            clase: '#4CAF50'         // Verde
        },
        estado: {
            pendiente: '#FB8C00',    // Orange
            confirmado: '#43A047',   // Green
            confirmada: '#43A047',
            en_curso: '#8E24AA',     // Purple
            completado: '#757575',   // Grey
            completada: '#757575',
            cancelado: '#E53935',    // Red
            cancelada: '#E53935',
            no_show: '#C62828'       // Dark Red
        }
    };

    // Mapear pistas a recursos
    const pistasRecursos = useMemo(() => {
        return pistas.map(pista => ({
            id: pista.id.toString(),
            title: pista.nombre,
            extendedProps: {
                tipo: pista.tipo,
                precioHora: pista.precioHora
            }
        }));
    }, [pistas]);

    // Mapear reservas a eventos
    const eventosReservas = useMemo(() => {
        if (!reservas || reservas.length === 0) return [];

        return reservas
            .filter(reserva => reserva && reserva.id && reserva.pistaId)
            .map(reserva => {
                const colorTipo = COLORS.tipo.reserva;
                const colorEstado = COLORS.estado[reserva.status as keyof typeof COLORS.estado] || COLORS.estado.pendiente;
                
                return {
                    id: `reserva-${reserva.id}`,
                    resourceId: reserva.pistaId.toString(),
                    title: '', // Título personalizado en render
                    start: reserva.fechaHoraInicio,
                    end: reserva.fechaHoraFin,
                    backgroundColor: 'transparent', // Usaremos gradiente personalizado
                    borderColor: '#424242',
                    extendedProps: {
                        tipo: 'reserva',
                        reserva: reserva,
                        colorTipo,
                        colorEstado
                    }
                };
            });
    }, [reservas]);

    // Mapear clases a eventos
    const eventosClases = useMemo(() => {
        if (!clases || clases.length === 0) return [];

        return clases
            .filter(clase => clase && clase.id && clase.pistaId)
            .map(clase => {
                const colorTipo = COLORS.tipo.clase;
                const colorEstado = COLORS.estado[clase.status as keyof typeof COLORS.estado] || COLORS.estado.pendiente;
                
                return {
                    id: `clase-${clase.id}`,
                    resourceId: clase.pistaId.toString(),
                    title: '', // Título personalizado en render
                    start: clase.fechaHoraInicio,
                    end: clase.fechaHoraFin,
                    backgroundColor: 'transparent', // Usaremos gradiente personalizado
                    borderColor: '#424242',
                    extendedProps: {
                        tipo: 'clase',
                        clase: clase,
                        colorTipo,
                        colorEstado
                    }
                };
            });
    }, [clases]);

    // Combinar todos los eventos
    const todosLosEventos = useMemo(() => {
        return [...eventosReservas, ...eventosClases];
    }, [eventosReservas, eventosClases]);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    // Click en espacio vacío -> Diálogo Tipo Evento
    const handleSeleccionFecha = async (selectInfo: DateSelectArg) => {
        const pistaId = parseInt(selectInfo.resource?.id || '0');
        const pista = pistas.find(p => p.id === pistaId);

        if (!pistaId) return;

        // VALIDAR QUE NO SEA FECHA PASADA
        const fechaSeleccionada = new Date(selectInfo.startStr);
        const ahora = new Date();
        
        if (fechaSeleccionada < ahora) {
            await errorAlert('Fecha pasada', 'No se pueden crear eventos en fechas u horas pasadas.');
            selectInfo.view.calendar.unselect();
            return;
        }

        setFechasIniciales({
            fechaHoraInicio: selectInfo.startStr,
            fechaHoraFin: selectInfo.endStr,
            pistaId,
            pistaNombre: pista?.nombre
        });
        setDialogTipoEventoAbierto(true);
        selectInfo.view.calendar.unselect();
    };

    // Selección de tipo
    const handleSelectClase = () => {
        setDialogTipoEventoAbierto(false);
        setClaseEditando(undefined);
        setModalClaseAbierto(true);
    };

    const handleSelectReserva = () => {
        setDialogTipoEventoAbierto(false);
        setReservaEditando(undefined);
        setModalReservaAbierto(true);
    };

    const handleCerrarDialogoTipo = () => {
        setDialogTipoEventoAbierto(false);
        setFechasIniciales(null);
    };

    // Click en evento existente -> Abrir Detalles
    const handleEventoClick = (clickInfo: EventClickArg) => {
        const tipo = clickInfo.event.extendedProps.tipo;

        if (tipo === 'clase') {
            const clase = clickInfo.event.extendedProps.clase as ClasePublica;
            setSelectedEvent(clase);
            setSelectedEventType('clase');
        } else {
            const reserva = clickInfo.event.extendedProps.reserva as Reserva;
            setSelectedEvent(reserva);
            setSelectedEventType('reserva');
        }
        setDetailsOpen(true);
    };

    // Manejar gestión de miembros desde dialog
    const handleManageMembers = (clase: ClasePublica) => {
        setDetailsOpen(false);
        setClaseParaGestionar(clase);
        setGestionClaseOpen(true);
    };

    // Handlers para Create (el contexto ya actualiza el estado automáticamente)
    const handleCreateClase = async (data: any) => {
        await createClaseMutation(data);
        await refetchClases();
        bumpCalendar();
    };

    const handleCreateReserva = async (data: any) => {
        await createReservaMutation(data);
        await refetchReservas();
        bumpCalendar();
    };

    // Handlers para Update con refetch
    const handleUpdateClase = async (slug: string, data: any) => {
        await updateClase(slug, data);
        await refetchClases();
        bumpCalendar();
    };

    const handleUpdateReserva = async (slug: string, data: any) => {
        await updateReserva(slug, data);
        await refetchReservas();
        bumpCalendar();
    };

    // Acciones desde Detalles
    const handleEditEvent = (event: any) => {
        setDetailsOpen(false);
        if (selectedEventType === 'clase') {
            setClaseEditando(event);
            setFechasIniciales(null);
            setModalClaseAbierto(true);
        } else {
            setReservaEditando(event);
            setFechasIniciales(null);
            setModalReservaAbierto(true);
        }
    };

    const handleDeleteEvent = async (event: any) => {
        setDetailsOpen(false);

        const isClase = selectedEventType === 'clase';
        const result = await showAlert({
            title: isClase ? '¿Eliminar clase?' : '¿Eliminar reserva?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d32f2f',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                if (isClase) {
                    await deleteClase(event.slug);
                    await refetchClases();
                } else {
                    await deleteReserva(event.slug);
                    await refetchReservas();
                }
                bumpCalendar();
                await successAlert(
                    '¡Eliminado!',
                    `La ${isClase ? 'clase' : 'reserva'} ha sido eliminada.`
                );
            } catch (error) {
                console.error(error);
                await errorAlert('Error', 'No se pudo eliminar el evento.');
            }
        }
    };

    // Renderizado profesional del contenido del evento estilo imagen de referencia
    const renderEventoContenido = (eventInfo: EventContentArg) => {
        const tipo = eventInfo.event.extendedProps.tipo;
        const isClase = tipo === 'clase';
        const data = isClase ? eventInfo.event.extendedProps.clase : eventInfo.event.extendedProps.reserva;
        // const colorTipo = eventInfo.event.extendedProps.colorTipo; // Disponible para futuras funcionalidades
        const colorEstado = eventInfo.event.extendedProps.colorEstado;
        
        // Calcular duración del evento en minutos
        const start = new Date(eventInfo.event.start!);
        const end = new Date(eventInfo.event.end!);
        const duracionMinutos = (end.getTime() - start.getTime()) / (1000 * 60);
        
        // Determinar si es evento corto (menos de 90 min)
        const esCorto = duracionMinutos < 90;
        
        let titulo = '';
        if (isClase) {
            // Para clases: mostrar nombre de la clase
            titulo = data.nombre;
        } else {
            // Para reservas: buscar nombre del usuario
            const usuario = usuarios.find(u => u.id === data.usuarioId);
            titulo = usuario ? `${usuario.nombre} ${usuario.apellidos || ''}`.trim() : `Usuario #${data.usuarioId}`;
        }

        // Obtener icono según el estado y tipo
        const getEventIcon = () => {
            const estado = data.estado;
            if (estado === 'completado' || estado === 'completada') return <CheckIcon sx={{ fontSize: 16 }} />;
            if (estado === 'en_curso') return <PlayIcon sx={{ fontSize: 16 }} />;
            if (estado === 'cancelado' || estado === 'cancelada') return <CancelIcon sx={{ fontSize: 16 }} />;
            if (isClase) return <SchoolIcon sx={{ fontSize: 16 }} />;
            return <GroupIcon sx={{ fontSize: 16 }} />;
        };

        // Obtener color pastel de fondo según el estado
        const getBgColor = () => {
            const estado = data.estado;
            if (estado === 'completado' || estado === 'completada') return alpha('#4CAF50', 0.08);
            if (estado === 'en_curso') return alpha('#9C27B0', 0.08);
            if (estado === 'confirmado' || estado === 'confirmada') return alpha('#2196F3', 0.08);
            if (estado === 'cancelado' || estado === 'cancelada') return alpha('#F44336', 0.08);
            if (estado === 'pendiente') return alpha('#FF9800', 0.08);
            if (estado === 'no_show') return alpha('#D32F2F', 0.08);
            return alpha('#757575', 0.08);
        };

        // Layout compacto para eventos cortos
        if (esCorto) {
            return (
                <Box sx={{
                    position: 'relative',
                    height: '100%',
                    width: '100%',
                    overflow: 'hidden',
                    borderRadius: '6px',
                    backgroundColor: getBgColor(),
                    borderLeft: `4px solid ${colorEstado}`,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        transform: 'translateY(-1px)'
                    }
                }}>
                    <Box sx={{
                        px: 1.5,
                        py: 1,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: 0.5
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <Typography 
                                variant="body2" 
                                fontWeight="700" 
                                noWrap
                                sx={{ 
                                    fontSize: '0.75rem',
                                    color: alpha(colorEstado, 0.9),
                                    flex: 1
                                }}
                            >
                                {titulo}
                            </Typography>
                            <Box sx={{ color: colorEstado, display: 'flex', alignItems: 'center', ml: 0.5 }}>
                                {getEventIcon()}
                            </Box>
                        </Box>
                        <Typography 
                            variant="caption" 
                            sx={{ 
                                color: alpha(colorEstado, 0.7),
                                fontWeight: 500,
                                fontSize: '0.625rem'
                            }}
                        >
                            {eventInfo.timeText}
                        </Typography>
                    </Box>
                </Box>
            );
        }

        // Obtener texto del estado
        const getEstadoLabel = () => {
            const estado = data.estado;
            if (estado === 'completado' || estado === 'completada') return 'Completado';
            if (estado === 'en_curso') return 'En curso';
            if (estado === 'confirmado' || estado === 'confirmada') return 'Confirmado';
            if (estado === 'cancelado' || estado === 'cancelada') return 'Cancelado';
            if (estado === 'pendiente') return 'Pendiente';
            if (estado === 'no_show') return 'No Show';
            return estado;
        };

        // Layout expandido para eventos largos
        return (
            <Box sx={{
                position: 'relative',
                height: '100%',
                width: '100%',
                overflow: 'hidden',
                borderRadius: '6px',
                backgroundColor: getBgColor(),
                borderLeft: `4px solid ${colorEstado}`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transform: 'translateY(-1px)'
                }
            }}>
                <Box sx={{
                    px: 1.5,
                    py: 1.25,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <Typography 
                            variant="body2" 
                            fontWeight="700" 
                            noWrap
                            sx={{ 
                                fontSize: '0.8rem',
                                color: alpha(colorEstado, 0.9),
                                flex: 1
                            }}
                        >
                            {titulo}
                        </Typography>
                        <Box sx={{ color: colorEstado, display: 'flex', alignItems: 'center', ml: 0.5 }}>
                            {getEventIcon()}
                        </Box>
                    </Box>
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            color: alpha(colorEstado, 0.7),
                            fontWeight: 500,
                            fontSize: '0.65rem'
                        }}
                    >
                        {eventInfo.timeText}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        <Chip 
                            label={getEstadoLabel()} 
                            size="small"
                            sx={{ 
                                height: '20px',
                                fontSize: '0.625rem',
                                fontWeight: 600,
                                bgcolor: alpha('#fff', 0.9),
                                color: colorEstado,
                                border: `1px solid ${alpha(colorEstado, 0.3)}`,
                                '& .MuiChip-label': { px: 1, py: 0 }
                            }}
                        />
                        {isClase && data.nivel && (
                            <Chip 
                                label={data.nivel.slice(0, 3).toUpperCase()} 
                                size="small"
                                sx={{ 
                                    height: '20px',
                                    fontSize: '0.625rem',
                                    fontWeight: 600,
                                    bgcolor: alpha('#fff', 0.9),
                                    color: alpha(colorEstado, 0.8),
                                    border: `1px solid ${alpha(colorEstado, 0.3)}`,
                                    '& .MuiChip-label': { px: 1, py: 0 }
                                }}
                            />
                        )}
                    </Box>
                </Box>
            </Box>
        );
    };

    // Navegación
    const handleHoy = () => {
        if (calendarApi) {
            const hoy = new Date();
            calendarApi.gotoDate(hoy);
            actualizarFecha(hoy);
        }
    };

    const handleAnterior = () => { if (calendarApi) { calendarApi.prev(); actualizarFecha(calendarApi.getDate()); } };
    const handleSiguiente = () => { if (calendarApi) { calendarApi.next(); actualizarFecha(calendarApi.getDate()); } };

    // Cerrar Modales
    const handleCerrarModalClase = () => {
        setModalClaseAbierto(false);
        setClaseEditando(undefined);
        setFechasIniciales(null);
    };

    const handleCerrarModalReserva = () => {
        setModalReservaAbierto(false);
        setReservaEditando(undefined);
        setFechasIniciales(null);
    };

    return (
        <Box sx={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', p: 1 }}>
            {/* Header Compacto: Fecha + Controles + Leyenda */}
            <Paper
                elevation={0}
                sx={{
                    px: 2,
                    py: 0.5,
                    mb: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    flexShrink: 0,
                    gap: 2
                }}
            >
                {/* Fecha y Controles */}
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2" fontWeight="600" color="text.primary" sx={{ fontSize: '0.85rem' }}>
                        {fechaSeleccionada.toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })}
                    </Typography>
                    
                    <Stack direction="row" spacing={0.5}>
                        <IconButton size="small" onClick={handleAnterior} sx={{ p: 0.5, border: '1px solid', borderColor: 'divider' }}>
                            <PrevIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        <IconButton size="small" onClick={handleHoy} color="primary" sx={{ p: 0.5, border: '1px solid', borderColor: 'divider', bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                            <TodayIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        <IconButton size="small" onClick={handleSiguiente} sx={{ p: 0.5, border: '1px solid', borderColor: 'divider' }}>
                            <NextIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Stack>
                </Stack>

                {/* Leyenda Compacta */}
                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                    <Chip label="Reserva" size="small" sx={{ bgcolor: COLORS.tipo.reserva, color: 'white', height: 18, fontSize: '0.65rem', px: 0.5 }} />
                    <Chip label="Clase" size="small" sx={{ bgcolor: COLORS.tipo.clase, color: 'white', height: 18, fontSize: '0.65rem', px: 0.5 }} />
                    <Box sx={{ width: 4 }} />
                    <Chip label="Pendiente" size="small" sx={{ bgcolor: COLORS.estado.pendiente, color: 'white', height: 18, fontSize: '0.65rem', px: 0.5 }} />
                    <Chip label="Confirmado" size="small" sx={{ bgcolor: COLORS.estado.confirmado, color: 'white', height: 18, fontSize: '0.65rem', px: 0.5 }} />
                    <Chip label="En curso" size="small" sx={{ bgcolor: COLORS.estado.en_curso, color: 'white', height: 18, fontSize: '0.65rem', px: 0.5 }} />
                    <Chip label="Completado" size="small" sx={{ bgcolor: COLORS.estado.completado, color: 'white', height: 18, fontSize: '0.65rem', px: 0.5 }} />
                    <Chip label="Cancelado" size="small" sx={{ bgcolor: COLORS.estado.cancelado, color: 'white', height: 18, fontSize: '0.65rem', px: 0.5 }} />
                </Stack>
            </Paper>

            {/* Calendario Profesional */}
            <Paper
                elevation={0}
                sx={{
                    p: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    // Ocupa el espacio restante con scroll interno
                    flex: 1,
                    minHeight: 0, // Importante para flex
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    // Estilos imagen de referencia - limpio y profesional
                    '& .fc': {
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        height: '100%',
                        width: '100%'
                    },
                    '& .fc-view-harness': {
                        height: '100% !important',
                        overflow: 'hidden'
                    },
                    '& .fc-scrollgrid': {
                        border: 'none !important',
                        height: '100% !important'
                    },
                    '& .fc-timegrid-slot': {
                        height: 'auto !important',
                        minHeight: '80px', // 80px por hora como en la imagen
                        borderColor: '#e2e8f0' // Líneas grid suaves
                    },
                    // Header columnas pistas - estilo imagen con badges
                    '& .fc-col-header-cell': {
                        backgroundColor: '#f8fafc',
                        py: 2,
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        borderBottom: '1px solid #e2e8f0',
                        borderRight: '1px solid #e2e8f0',
                        color: '#1e293b'
                    },
                    '& .fc-timegrid-axis-cushion': {
                        color: '#64748b',
                        fontWeight: 500,
                        fontSize: '0.75rem'
                    },
                    '& .fc-timegrid-slot-label': {
                        color: '#64748b',
                        fontWeight: 500,
                        fontSize: '0.75rem'
                    },
                    '& .fc-timegrid-axis': {
                        backgroundColor: '#ffffff'
                    },
                    // Línea hora actual - ROJA destacada con badge como en la imagen
                    '& .fc-timegrid-now-indicator-line': {
                        borderColor: '#ef4444',
                        borderWidth: '2px',
                        boxShadow: '0 0 4px rgba(239,68,68,0.4)'
                    },
                    '& .fc-timegrid-now-indicator-arrow': {
                        borderColor: '#ef4444',
                        borderWidth: '8px'
                    },
                    // Eventos - fondos pasteles, bordes gruesos
                    '& .fc-event': {
                        borderRadius: '6px',
                        border: 'none !important',
                        backgroundColor: 'transparent !important', // Lo manejamos en el renderizador
                        boxShadow: 'none !important',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        padding: '0 !important',
                        overflow: 'visible',
                        '&:hover': {
                            transform: 'scale(1.01)'
                        }
                    },
                    '& .fc-timegrid-event-harness': {
                        margin: '0 4px' // Separación entre eventos
                    },
                    '& .fc-daygrid-day-frame': {
                        backgroundColor: '#ffffff'
                    },
                    '& .fc-timegrid-col': {
                        backgroundColor: '#ffffff',
                        borderRight: '1px solid #e2e8f0',
                        backgroundImage: 'linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)',
                        backgroundSize: '100% 80px' // Grid lines cada hora
                    },
                    '& .fc-timegrid-col-frame': {
                        borderColor: alpha(theme.palette.divider, 0.4)
                    },
                    '& .fc-scrollgrid-section > *': {
                        borderColor: theme.palette.divider
                    },
                    '& .fc-scrollgrid-section-body > td': {
                        borderColor: alpha(theme.palette.divider, 0.4)
                    },
                    // Permitir scroll vertical, ocultar horizontal
                    '& .fc-scroller': {
                        overflowY: 'auto !important',
                        overflowX: 'hidden !important'
                    },
                    '& .fc-scroller-harness': {
                        overflowY: 'auto !important',
                        overflowX: 'hidden !important'
                    },
                    // Quitar fondo naranja del día actual
                    '& .fc-day-today': {
                        backgroundColor: 'transparent !important'
                    }
                }}
            >
                <FullCalendar
                    key={calendarVersion}
                    ref={(el) => { if (el) setCalendarApi(el.getApi()); }}
                    plugins={[resourceTimeGridPlugin, interactionPlugin]}
                    initialView="resourceTimeGridDay"
                    initialDate={fechaSeleccionada}
                    headerToolbar={false}
                    locale={esLocale}
                    resources={pistasRecursos}
                    events={todosLosEventos}
                    editable={false}
                    selectable={true}
                    selectMirror={true}
                    slotMinTime="07:00:00"
                    slotMaxTime="23:00:00"
                    allDaySlot={false}
                    eventClick={handleEventoClick}
                    select={handleSeleccionFecha}
                    eventContent={renderEventoContenido}
                    height="100%"
                    expandRows={false}
                    slotDuration="00:30:00"
                    slotLabelInterval="01:00:00"
                    resourceAreaWidth="15%"
                    slotLabelFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        meridiem: false
                    }}
                />
            </Paper>

            {/* Leyenda inferior - estilo imagen de referencia */}
            <Paper
                elevation={0}
                sx={{
                    px: 3,
                    py: 1.5,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: '#fafafa',
                    borderRadius: 0
                }}
            >
                <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.7rem', mr: 1 }}>
                        ESTADOS:
                    </Typography>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: COLORS.estado.confirmado }} />
                            <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#475569' }}>Confirmado</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: COLORS.estado.en_curso }} />
                            <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#475569' }}>En Curso</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: COLORS.estado.completado }} />
                            <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#475569' }}>Completado</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: COLORS.estado.pendiente }} />
                            <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#475569' }}>Pendiente</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: COLORS.estado.cancelado }} />
                            <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#475569' }}>Cancelado</Typography>
                        </Box>
                    </Stack>
                </Stack>
            </Paper>

            {/* Modales Actions */}
            <ModalClase
                open={modalClaseAbierto}
                onClose={handleCerrarModalClase}
                onCreate={handleCreateClase}
                onUpdate={handleUpdateClase}
                claseEditando={claseEditando}
                fechasIniciales={fechasIniciales}
                pistas={pistas}
                entrenadores={usuarios.filter((u: Usuario) => u.role === 'entrenador')}
                reservas={reservas}
                clases={clases}
            />

            <ModalReserva
                open={modalReservaAbierto}
                onClose={handleCerrarModalReserva}
                onCreate={handleCreateReserva}
                onUpdate={handleUpdateReserva}
                reservaEditando={reservaEditando}
                fechasIniciales={fechasIniciales}
                pistas={pistas}
                usuarios={usuarios}
                clases={clases}
                reservas={reservas}
                adminId={adminId}
            />

            {/* Dialogs Informativos y de Selección */}
            <EventTypeDialog
                open={dialogTipoEventoAbierto}
                onClose={handleCerrarDialogoTipo}
                onSelectClase={handleSelectClase}
                onSelectReserva={handleSelectReserva}
                pistaName={fechasIniciales?.pistaNombre}
                startTime={fechasIniciales?.fechaHoraInicio}
            />

            <EventDetailsDialog
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                event={selectedEvent}
                type={selectedEventType}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
                onManageMembers={handleManageMembers}
            />

            {/* Modal de Gestión de Clase */}
            {claseParaGestionar && (
                <ModalGestionClase
                    open={gestionClaseOpen}
                    onClose={() => {
                        setGestionClaseOpen(false);
                        setClaseParaGestionar(null);
                    }}
                    claseId={claseParaGestionar.id}
                    claseNombre={claseParaGestionar.nombre}
                    maxParticipantes={claseParaGestionar.maxParticipantes}
                />
            )}
        </Box>
    );
};
