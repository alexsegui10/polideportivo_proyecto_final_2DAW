import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box
} from '@mui/material';
import { FormField, FormSelect, DateTimeWithDuration } from '../Shared';
import { ClasePublica, ClaseCreateRequest, ClaseUpdateRequest, Pista, Usuario, Reserva } from '../../types';
import { DEPORTES } from '../../constants/deportes';
import { formatLocalDateTime } from '../../utils/formatLocalDateTime';
import Swal from 'sweetalert2';

interface ModalClaseProps {
    open: boolean;
    onClose: () => void;
    onCreate: (clase: ClaseCreateRequest) => Promise<any>;
    onUpdate: (slug: string, clase: ClaseUpdateRequest) => Promise<any>;
    claseEditando?: ClasePublica;
    fechasIniciales?: {
        fechaHoraInicio: string;
        fechaHoraFin: string;
        pistaId: number;
    };
    pistas: Pista[];
    entrenadores: Usuario[];
    reservas: Reserva[];
    clases: ClasePublica[];
}

// Extraer fecha, hora y duración desde ISO string
function extraerFechaHora(isoString: string): { fecha: string; hora: string } {
    if (!isoString) return { fecha: '', hora: '' };
    const d = new Date(isoString);
    const fecha = d.toISOString().split('T')[0]; // YYYY-MM-DD
    const hora = d.toTimeString().slice(0, 8); // HH:mm:ss
    return { fecha, hora };
}

function calcularDuracion(inicio: string, fin: string): number {
    if (!inicio || !fin) return 60;
    const diff = new Date(fin).getTime() - new Date(inicio).getTime();
    return Math.round(diff / (1000 * 60));
}

// Combinar fecha, hora y duración en ISO string
function combinarFechaHoraDuracion(fecha: string, hora: string, duracionMin: number): { inicio: string; fin: string } {
    const inicio = new Date(`${fecha}T${hora}`);
    const fin = new Date(inicio.getTime() + duracionMin * 60 * 1000);
    return {
        inicio: inicio.toISOString(),
        fin: fin.toISOString()
    };
}

export const ModalClase = ({
    open,
    onClose,
    onCreate,
    onUpdate,
    claseEditando,
    fechasIniciales,
    pistas,
    entrenadores,
    reservas,
    clases
}: ModalClaseProps) => {
    const [formData, setFormData] = useState<ClaseCreateRequest>({
        nombre: '',
        descripcion: '',
        imagen: '',
        entrenadorId: 0,
        pistaId: 0,
        fechaHoraInicio: '',
        fechaHoraFin: '',
        duracionMinutos: 60,
        maxParticipantes: 15,
        precio: 0, // Siempre 0, las clases son gratis
        nivel: 'principiante',
        deporte: DEPORTES[0]?.value || 'Pádel', // Prellenar con primer deporte
        status: 'programada',
        isActive: true
    });

    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [duracion, setDuracion] = useState(60);

    // Inicializar formulario
    useEffect(() => {
        if (claseEditando) {
            const { fecha: f, hora: h } = extraerFechaHora(claseEditando.fechaHoraInicio);
            setFecha(f);
            setHora(h);
            setDuracion(claseEditando.duracionMinutos);

            setFormData({
                nombre: claseEditando.nombre,
                descripcion: claseEditando.descripcion || '',
                imagen: claseEditando.imagen || '',
                entrenadorId: claseEditando.entrenadorId,
                pistaId: claseEditando.pistaId,
                fechaHoraInicio: claseEditando.fechaHoraInicio,
                fechaHoraFin: claseEditando.fechaHoraFin,
                duracionMinutos: claseEditando.duracionMinutos,
                maxParticipantes: claseEditando.maxParticipantes,
                precio: claseEditando.precio || 0,
                nivel: claseEditando.nivel,
                deporte: claseEditando.deporte,
                status: claseEditando.status,
                isActive: claseEditando.isActive
            });
        } else if (fechasIniciales) {
            const { fecha: f, hora: h } = extraerFechaHora(fechasIniciales.fechaHoraInicio);
            const dur = calcularDuracion(fechasIniciales.fechaHoraInicio, fechasIniciales.fechaHoraFin);

            setFecha(f);
            setHora(h);
            setDuracion(dur > 0 ? dur : 60);

            setFormData(prev => ({
                ...prev,
                pistaId: fechasIniciales.pistaId,
                fechaHoraInicio: fechasIniciales.fechaHoraInicio,
                fechaHoraFin: fechasIniciales.fechaHoraFin,
                duracionMinutos: dur > 0 ? dur : 60,
                deporte: DEPORTES[0]?.value || 'Pádel',
                nivel: 'principiante'
            }));
        }
    }, [claseEditando, fechasIniciales]);

    // Actualizar fechas cuando cambien fecha/hora/duración
    useEffect(() => {
        if (fecha && hora && duracion > 0) {
            const { inicio, fin } = combinarFechaHoraDuracion(fecha, hora, duracion);
            setFormData(prev => ({
                ...prev,
                fechaHoraInicio: inicio,
                fechaHoraFin: fin,
                duracionMinutos: duracion
            }));
        }
    }, [fecha, hora, duracion]);

    const handleGuardar = async () => {
        // Validaciones
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
        if (formData.pistaId <= 0) {
            alert('Debes seleccionar una pista');
            return;
        }
        if (!formData.fechaHoraInicio || !formData.fechaHoraFin) {
            alert('Debes especificar la fecha y hora');
            return;
        }

        const inicio = new Date(formData.fechaHoraInicio);
        const fin = new Date(formData.fechaHoraFin);

        if (fin <= inicio) {
            alert('La duración debe ser mayor a 0');
            return;
        }

        // Verificar conflictos con reservas existentes
        const hayConflictoReserva = reservas.some(reserva => {
            if (reserva.pistaId !== formData.pistaId) return false;
            if (!reserva.isActive) return false;

            const reservaInicio = new Date(reserva.fechaHoraInicio);
            const reservaFin = new Date(reserva.fechaHoraFin);

            return (
                (inicio >= reservaInicio && inicio < reservaFin) ||
                (fin > reservaInicio && fin <= reservaFin) ||
                (inicio <= reservaInicio && fin >= reservaFin)
            );
        });

        if (hayConflictoReserva) {
            await Swal.fire({
                title: '⚠️ Conflicto de Horario',
                html: `
          <div style="text-align: left;">
            <p>Ya existe una <strong>reserva</strong> en esta pista durante el horario seleccionado.</p>
            <p><strong>Pista:</strong> ${pistas.find(p => p.id === formData.pistaId)?.nombre}</p>
            <p><strong>Horario:</strong> ${inicio.toLocaleString('es-ES')} - ${fin.toLocaleString('es-ES')}</p>
            <p style="margin-top: 16px; color: #d32f2f;">Por favor, selecciona otro horario o pista.</p>
          </div>
        `,
                icon: 'warning',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#d32f2f'
            });
            return;
        }

        // Verificar conflictos con otras clases
        const hayConflictoClase = clases.some(clase => {
            // No comparar con la misma clase si estamos editando
            if (claseEditando && clase.id === claseEditando.id) return false;
            if (clase.pistaId !== formData.pistaId) return false;
            if (!clase.isActive) return false;

            const claseInicio = new Date(clase.fechaHoraInicio);
            const claseFin = new Date(clase.fechaHoraFin);

            return (
                (inicio >= claseInicio && inicio < claseFin) ||
                (fin > claseInicio && fin <= claseFin) ||
                (inicio <= claseInicio && fin >= claseFin)
            );
        });

        if (hayConflictoClase) {
            await Swal.fire({
                title: '⚠️ Conflicto de Horario',
                html: `
          <div style="text-align: left;">
            <p>Ya existe otra <strong>clase</strong> en esta pista durante el horario seleccionado.</p>
            <p><strong>Pista:</strong> ${pistas.find(p => p.id === formData.pistaId)?.nombre}</p>
            <p><strong>Horario:</strong> ${inicio.toLocaleString('es-ES')} - ${fin.toLocaleString('es-ES')}</p>
            <p style="margin-top: 16px; color: #d32f2f;">Por favor, selecciona otro horario o pista.</p>
          </div>
        `,
                icon: 'warning',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#d32f2f'
            });
            return;
        }

        try {
            // Formatear fechas para el backend
            const dataToSend = {
                ...formData,
                fechaHoraInicio: formatLocalDateTime(formData.fechaHoraInicio),
                fechaHoraFin: formatLocalDateTime(formData.fechaHoraFin),
                precio: 0 // Siempre 0, las clases son gratis
            };

            if (claseEditando) {
                await onUpdate(claseEditando.slug, dataToSend);
            } else {
                await onCreate(dataToSend);
            }
            handleClose();
        } catch (error) {
            console.error('Error al guardar clase:', error);
            alert('Error al guardar clase');
        }
    };

    const handleClose = () => {
        setFormData({
            nombre: '',
            descripcion: '',
            imagen: '',
            entrenadorId: 0,
            pistaId: 0,
            fechaHoraInicio: '',
            fechaHoraFin: '',
            duracionMinutos: 60,
            maxParticipantes: 15,
            precio: 0,
            nivel: 'principiante',
            deporte: DEPORTES[0]?.value || 'Pádel',
            status: 'programada',
            isActive: true
        });
        setFecha('');
        setHora('');
        setDuracion(60);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {claseEditando ? 'Editar Clase' : 'Nueva Clase'}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <FormField
                        label="Nombre de la Clase"
                        value={formData.nombre}
                        onChange={(v) => setFormData({ ...formData, nombre: v })}
                        required
                    />

                    <FormField
                        label="Descripción"
                        value={formData.descripcion || ''}
                        onChange={(v) => setFormData({ ...formData, descripcion: v })}
                        multiline
                        rows={3}
                    />

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormSelect
                            label="Deporte"
                            value={formData.deporte}
                            onChange={(v) => setFormData({ ...formData, deporte: v as string })}
                            options={DEPORTES.map(d => ({ value: d.value, label: d.label }))}
                            required
                        />

                        <FormSelect
                            label="Nivel"
                            value={formData.nivel || 'principiante'}
                            onChange={(v) => setFormData({ ...formData, nivel: v as string })}
                            options={[
                                { value: 'principiante', label: 'Principiante' },
                                { value: 'intermedio', label: 'Intermedio' },
                                { value: 'avanzado', label: 'Avanzado' }
                            ]}
                            required
                        />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormSelect
                            label="Entrenador"
                            value={formData.entrenadorId}
                            onChange={(v) => setFormData({ ...formData, entrenadorId: Number(v) })}
                            options={entrenadores.map(e => ({
                                value: e.id,
                                label: `${e.nombre} (${e.email})`
                            }))}
                            required
                        />

                        <FormSelect
                            label="Pista"
                            value={formData.pistaId}
                            onChange={(v) => setFormData({ ...formData, pistaId: Number(v) })}
                            options={pistas.map(p => ({
                                value: p.id,
                                label: `${p.nombre} - ${p.tipo}`
                            }))}
                            required
                        />
                    </Box>

                    <DateTimeWithDuration
                        fecha={fecha}
                        hora={hora}
                        duracionMinutos={duracion}
                        onChangeFecha={setFecha}
                        onChangeHora={setHora}
                        onChangeDuracion={setDuracion}
                    />

                    <FormField
                        label="Max Participantes"
                        type="number"
                        value={formData.maxParticipantes || 0}
                        onChange={(v) => setFormData({ ...formData, maxParticipantes: parseInt(v) || 0 })}
                        required
                        fullWidth
                    />

                    <FormSelect
                        label="Estado"
                        value={formData.status || 'programada'}
                        onChange={(v) => setFormData({ ...formData, status: v as string })}
                        options={[
                            { value: 'programada', label: 'Programada' },
                            { value: 'en_curso', label: 'En Curso' },
                            { value: 'finalizada', label: 'Finalizada' },
                            { value: 'cancelada', label: 'Cancelada' }
                        ]}
                        required
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="inherit">
                    Cancelar
                </Button>
                <Button onClick={handleGuardar} variant="contained">
                    {claseEditando ? 'Actualizar' : 'Crear'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
