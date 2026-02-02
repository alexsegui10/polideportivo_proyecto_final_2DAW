import { useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import Swal from 'sweetalert2';
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
    Today as TodayIcon
} from '@mui/icons-material';
import { EventClickArg, DateSelectArg, EventContentArg } from '@fullcalendar/core';
import {
    usePistas,
    useUsuarios,
    useClases,
    useClasesMutations,
    useReservas,
    useReservasMutations
} from '../../hooks';
import { ModalClase } from './ModalClase';
import { ModalReserva } from './ModalReserva';
import { EventTypeDialog } from '../Shared';
import { EventDetailsDialog } from './EventDetailsDialog';
import { Reserva, ClasePublica, Usuario } from '../../types';

export const CalendarioGestion = () => {
    const theme = useTheme();
    const { pistas } = usePistas();
    const { usuarios } = useUsuarios();
    const { clases } = useClases();
    const { createClase: createClaseMutation, updateClase, deleteClase } = useClasesMutations();
    const { reservas } = useReservas();
    const { createReserva: createReservaMutation, updateReserva, deleteReserva } = useReservasMutations();

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

    // Colores según estado (Palette Profesional)
    const COLORS = {
        clase: { bg: '#3949ab', border: '#283593' }, // Indigo 600
        reserva: {
            confirmada: { bg: '#2e7d32', border: '#1b5e20' }, // Green 800
            pendiente: { bg: '#ef6c00', border: '#e65100' }, // Orange 800
            cancelada: { bg: '#c62828', border: '#b71c1c' }, // Red 800
            completada: { bg: '#1565c0', border: '#0d47a1' } // Blue 800
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
                const statusColor = COLORS.reserva[reserva.status as keyof typeof COLORS.reserva] || COLORS.reserva.pendiente;
                return {
                    id: `reserva-${reserva.id}`,
                    resourceId: reserva.pistaId.toString(),
                    title: '', // Título personalizado en render
                    start: reserva.fechaHoraInicio,
                    end: reserva.fechaHoraFin,
                    backgroundColor: statusColor.bg,
                    borderColor: statusColor.border,
                    extendedProps: {
                        tipo: 'reserva',
                        reserva: reserva
                    }
                };
            });
    }, [reservas]);

    // Mapear clases a eventos
    const eventosClases = useMemo(() => {
        if (!clases || clases.length === 0) return [];

        return clases
            .filter(clase => clase && clase.id && clase.pistaId)
            .map(clase => ({
                id: `clase-${clase.id}`,
                resourceId: clase.pistaId.toString(),
                title: '', // Título personalizado en render
                start: clase.fechaHoraInicio,
                end: clase.fechaHoraFin,
                backgroundColor: COLORS.clase.bg,
                borderColor: COLORS.clase.border,
                extendedProps: {
                    tipo: 'clase',
                    clase: clase
                }
            }));
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

    // Handlers para Create (el contexto ya actualiza el estado automáticamente)
    const handleCreateClase = async (data: any) => {
        await createClaseMutation(data);
    };

    const handleCreateReserva = async (data: any) => {
        await createReservaMutation(data);
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
        const result = await Swal.fire({
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
                } else {
                    await deleteReserva(event.slug);
                }
                Swal.fire(
                    '¡Eliminado!',
                    `La ${isClase ? 'clase' : 'reserva'} ha sido eliminada.`,
                    'success'
                );
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'No se pudo eliminar el evento.', 'error');
            }
        }
    };

    // Renderizado profesional del contenido del evento
    const renderEventoContenido = (eventInfo: EventContentArg) => {
        const tipo = eventInfo.event.extendedProps.tipo;
        const isClase = tipo === 'clase';
        const data = isClase ? eventInfo.event.extendedProps.clase : eventInfo.event.extendedProps.reserva;
        
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

        // Layout compacto para eventos cortos
        if (esCorto) {
            return (
                <Box sx={{
                    px: 1.2,
                    py: 0.5,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 0.5,
                    overflow: 'hidden'
                }}>
                    <Typography 
                        variant="body2" 
                        fontWeight="600" 
                        noWrap
                        sx={{ 
                            fontSize: '0.75rem',
                            color: 'white',
                            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                            flex: 1
                        }}
                    >
                        {titulo}
                    </Typography>
                    <Typography 
                        variant="caption" 
                        noWrap
                        sx={{ 
                            color: 'rgba(255,255,255,0.9)',
                            fontWeight: 500,
                            fontSize: '0.7rem'
                        }}
                    >
                        {eventInfo.timeText}
                    </Typography>
                </Box>
            );
        }

        // Layout expandido para eventos largos
        return (
            <Box sx={{
                px: 1.5,
                py: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 0.8,
                overflow: 'hidden'
            }}>
                <Typography 
                    variant="body2" 
                    fontWeight="600" 
                    noWrap
                    sx={{ 
                        fontSize: '0.875rem',
                        color: 'white',
                        textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                        letterSpacing: '0.01em'
                    }}
                >
                    {titulo}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            color: 'rgba(255,255,255,0.95)',
                            fontWeight: 600,
                            fontSize: '0.75rem'
                        }}
                    >
                        {eventInfo.timeText}
                    </Typography>
                    {isClase && data.nivel && (
                        <Chip 
                            label={data.nivel.slice(0, 3).toUpperCase()} 
                            size="small"
                            sx={{ 
                                height: '20px',
                                fontSize: '0.625rem',
                                fontWeight: 700,
                                bgcolor: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.3)',
                                '& .MuiChip-label': { px: 0.8, py: 0 }
                            }}
                        />
                    )}
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
        <Box>
            {/* Header / Toolbar */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2
                }}
            >
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography variant="h5" fontWeight="bold" color="text.primary">
                        {fechaSeleccionada.toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        }).replace(/^./, (str) => str.toUpperCase())}
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={1}>
                    <IconButton onClick={handleAnterior} sx={{ border: '1px solid', borderColor: 'divider' }}>
                        <PrevIcon />
                    </IconButton>
                    <IconButton onClick={handleHoy} color="primary" sx={{ border: '1px solid', borderColor: 'divider', bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                        <TodayIcon />
                    </IconButton>
                    <IconButton onClick={handleSiguiente} sx={{ border: '1px solid', borderColor: 'divider' }}>
                        <NextIcon />
                    </IconButton>
                </Stack>
            </Paper>

            {/* Leyenda Moderna */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1.5,
                    alignItems: 'center'
                }}
            >
                <Typography variant="body2" fontWeight="600" color="text.secondary" sx={{ mr: 1 }}>
                    Estados:
                </Typography>
                <Chip
                    label="Clase"
                    size="small"
                    sx={{
                        bgcolor: COLORS.clase.bg,
                        color: 'white',
                        fontWeight: 600,
                        '&:hover': { bgcolor: COLORS.clase.border }
                    }}
                />
                <Chip
                    label="Confirmada"
                    size="small"
                    sx={{
                        bgcolor: COLORS.reserva.confirmada.bg,
                        color: 'white',
                        fontWeight: 600,
                        '&:hover': { bgcolor: COLORS.reserva.confirmada.border }
                    }}
                />
                <Chip
                    label="Pendiente"
                    size="small"
                    sx={{
                        bgcolor: COLORS.reserva.pendiente.bg,
                        color: 'white',
                        fontWeight: 600,
                        '&:hover': { bgcolor: COLORS.reserva.pendiente.border }
                    }}
                />
                <Chip
                    label="Completada"
                    size="small"
                    sx={{
                        bgcolor: COLORS.reserva.completada.bg,
                        color: 'white',
                        fontWeight: 600,
                        '&:hover': { bgcolor: COLORS.reserva.completada.border }
                    }}
                />
                <Chip
                    label="Cancelada"
                    size="small"
                    sx={{
                        bgcolor: COLORS.reserva.cancelada.bg,
                        color: 'white',
                        fontWeight: 600,
                        '&:hover': { bgcolor: COLORS.reserva.cancelada.border }
                    }}
                />
            </Paper>

            {/* Calendario Profesional */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    // Altura fija que ocupa el viewport disponible
                    height: 'calc(100vh - 320px)',
                    minHeight: '700px',
                    display: 'flex',
                    flexDirection: 'column',
                    // Estilos personalizados profesionales para FullCalendar
                    '& .fc': {
                        fontFamily: theme.typography.fontFamily,
                        height: '100%',
                        width: '100%'
                    },
                    '& .fc-view-harness': {
                        height: '100% !important'
                    },
                    '& .fc-scrollgrid': {
                        border: 'none !important',
                        height: '100% !important'
                    },
                    '& .fc-timegrid-slots': {
                        // Sin scroll interno
                    },
                    '& .fc-timegrid-slot': {
                        height: 'auto !important',
                        minHeight: '45px',
                        borderColor: alpha(theme.palette.divider, 0.4)
                    },
                    '& .fc-col-header-cell': {
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        py: 1.5,
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        borderColor: theme.palette.divider,
                        color: theme.palette.primary.main
                    },
                    '& .fc-timegrid-axis-cushion': {
                        color: theme.palette.text.secondary,
                        fontWeight: 600,
                        fontSize: '0.8rem'
                    },
                    '& .fc-timegrid-slot-label': {
                        color: theme.palette.text.secondary,
                        fontWeight: 500
                    },
                    '& .fc-event': {
                        borderRadius: '6px',
                        border: '2px solid rgba(255,255,255,0.2) !important',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease-in-out',
                        padding: '6px 10px',
                        overflow: 'hidden',
                        fontWeight: 600,
                        '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)',
                            zIndex: 10,
                            borderColor: 'rgba(255,255,255,0.35) !important'
                        }
                    },
                    '& .fc-timegrid-event-harness': {
                        marginRight: '2px'
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
                    key={`calendar-${clases.length}-${reservas.length}`}
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

            {/* Modales Actions */}
            <ModalClase
                open={modalClaseAbierto}
                onClose={handleCerrarModalClase}
                onCreate={handleCreateClase}
                onUpdate={updateClase}
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
                onUpdate={updateReserva}
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
            />
        </Box>
    );
};
