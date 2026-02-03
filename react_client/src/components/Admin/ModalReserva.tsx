import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box
} from '@mui/material';
import { FormField, FormSelect, DateTimeWithDuration, UserSelector } from '../Shared';
import { Reserva, ReservaCreateRequest, ReservaUpdateRequest, Pista, Usuario, ClasePublica } from '../../types';
import { formatLocalDateTime } from '../../utils/formatLocalDateTime';
import { showAlert } from '../../utils/sweetAlert';

interface ModalReservaProps {
    open: boolean;
    onClose: () => void;
    onCreate: (reserva: ReservaCreateRequest) => Promise<any>;
    onUpdate: (slug: string, reserva: ReservaUpdateRequest) => Promise<any>;
    reservaEditando?: Reserva;
    fechasIniciales?: {
        fechaHoraInicio: string;
        fechaHoraFin: string;
        pistaId: number;
    };
    pistas: Pista[];
    usuarios: Usuario[];
    clases: ClasePublica[];
    reservas: Reserva[];
    adminId: number;
}

// Funciones helper
function extraerFechaHora(isoString: string): { fecha: string; hora: string } {
    if (!isoString) return { fecha: '', hora: '' };
    const d = new Date(isoString);
    const fecha = d.toISOString().split('T')[0];
    const hora = d.toTimeString().slice(0, 8);
    return { fecha, hora };
}

function calcularDuracion(inicio: string, fin: string): number {
    if (!inicio || !fin) return 60;
    const diff = new Date(fin).getTime() - new Date(inicio).getTime();
    return Math.round(diff / (1000 * 60));
}

function combinarFechaHoraDuracion(fecha: string, hora: string, duracionMin: number): { inicio: string; fin: string } {
    const inicio = new Date(`${fecha}T${hora}`);
    const fin = new Date(inicio.getTime() + duracionMin * 60 * 1000);
    return {
        inicio: inicio.toISOString(),
        fin: fin.toISOString()
    };
}

export const ModalReserva = ({
    open,
    onClose,
    onCreate,
    onUpdate,
    reservaEditando,
    fechasIniciales,
    pistas,
    usuarios,
    clases,
    reservas,
    adminId
}: ModalReservaProps) => {
    const [formData, setFormData] = useState<ReservaCreateRequest>({
        pistaId: 0,
        usuarioId: adminId,
        fechaHoraInicio: '',
        fechaHoraFin: '',
        precio: 0,
        tipoReserva: 'individual',
        metodoPago: 'tarjeta', // PREDETERMINADO TARJETA
        status: 'confirmada',
        notas: '',
        isActive: true
    });

    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [duracion, setDuracion] = useState(60);

    const [modalUsuarioAbierto, setModalUsuarioAbierto] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);

    // Inicializar formulario
    useEffect(() => {
        if (reservaEditando) {
            const { fecha: f, hora: h } = extraerFechaHora(reservaEditando.fechaHoraInicio);
            const dur = calcularDuracion(reservaEditando.fechaHoraInicio, reservaEditando.fechaHoraFin);

            setFecha(f);
            setHora(h);
            setDuracion(dur);

            setFormData({
                pistaId: reservaEditando.pistaId,
                usuarioId: reservaEditando.usuarioId,
                fechaHoraInicio: reservaEditando.fechaHoraInicio,
                fechaHoraFin: reservaEditando.fechaHoraFin,
                precio: reservaEditando.precio,
                tipoReserva: reservaEditando.tipoReserva,
                metodoPago: reservaEditando.metodoPago,
                status: reservaEditando.status,
                notas: reservaEditando.notas || '',
                isActive: reservaEditando.isActive
            });

            const user = usuarios.find(u => u.id === reservaEditando.usuarioId);
            setUsuarioSeleccionado(user || null);
        } else if (fechasIniciales) {
            const { fecha: f, hora: h } = extraerFechaHora(fechasIniciales.fechaHoraInicio);
            const dur = calcularDuracion(fechasIniciales.fechaHoraInicio, fechasIniciales.fechaHoraFin);

            setFecha(f);
            setHora(h);
            setDuracion(dur > 0 ? dur : 60);

            setFormData(prev => ({
                ...prev,
                pistaId: fechasIniciales.pistaId,
                usuarioId: adminId,
                fechaHoraInicio: fechasIniciales.fechaHoraInicio,
                fechaHoraFin: fechasIniciales.fechaHoraFin,
                metodoPago: 'tarjeta'
            }));

            const admin = usuarios.find(u => u.id === adminId);
            setUsuarioSeleccionado(admin || null);
        }
    }, [reservaEditando, fechasIniciales, adminId, usuarios]);

    // Actualizar fechas cuando cambien fecha/hora/duración
    useEffect(() => {
        if (fecha && hora && duracion > 0) {
            const { inicio, fin } = combinarFechaHoraDuracion(fecha, hora, duracion);
            setFormData(prev => ({
                ...prev,
                fechaHoraInicio: inicio,
                fechaHoraFin: fin
            }));
        }
    }, [fecha, hora, duracion]);

    // Calcular precio automáticamente desde precio de pista
    useEffect(() => {
        if (formData.pistaId && duracion > 0) {
            const pista = pistas.find(p => p.id === formData.pistaId);
            if (pista) {
                const horas = duracion / 60;
                const precioCalculado = horas * pista.precioHora;
                setFormData(prev => ({ ...prev, precio: precioCalculado }));
            }
        }
    }, [formData.pistaId, duracion, pistas]);

    const handleSelectUser = (user: Usuario) => {
        setUsuarioSeleccionado(user);
        setFormData(prev => ({ ...prev, usuarioId: user.id }));
    };

    const handleGuardar = async () => {
        // Validaciones
        if (formData.pistaId <= 0) {
            alert('Debes seleccionar una pista');
            return;
        }
        if (formData.usuarioId <= 0) {
            alert('Debes seleccionar un usuario');
            return;
        }
        if (!formData.fechaHoraInicio || !formData.fechaHoraFin) {
            alert('Debes especificar fecha y hora');
            return;
        }

        const inicio = new Date(formData.fechaHoraInicio);
        const fin = new Date(formData.fechaHoraFin);

        if (fin <= inicio) {
            alert('La duración debe ser mayor a 0');
            return;
        }

        // Verificar conflictos con clases
        const hayConflictoClase = clases.some(clase => {
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
            await showAlert({
                title: '⚠️ Conflicto de Horario',
                html: `
          <div style="text-align: left;">
            <p>Ya existe una <strong>clase</strong> en esta pista durante el horario seleccionado.</p>
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

        // Verificar conflictos con otras reservas
        const hayConflictoReserva = reservas.some(reserva => {
            // No comparar con la misma reserva si estamos editando
            if (reservaEditando && reserva.id === reservaEditando.id) return false;
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
            await showAlert({
                title: '⚠️ Conflicto de Horario',
                html: `
          <div style="text-align: left;">
            <p>Ya existe otra <strong>reserva</strong> en esta pista durante el horario seleccionado.</p>
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
                fechaHoraFin: formatLocalDateTime(formData.fechaHoraFin)
                // No enviamos clubId si no existe
            };

            if (reservaEditando) {
                await onUpdate(reservaEditando.slug, dataToSend);
            } else {
                await onCreate(dataToSend);
            }
            handleClose();
        } catch (error) {
            console.error('Error al guardar reserva:', error);
            alert('Error al guardar reserva');
        }
    };

    const handleClose = () => {
        setFormData({
            pistaId: 0,
            usuarioId: adminId,
            fechaHoraInicio: '',
            fechaHoraFin: '',
            precio: 0,
            tipoReserva: 'individual',
            metodoPago: 'tarjeta',
            status: 'confirmada',
            notas: '',
            isActive: true
        });
        setFecha('');
        setHora('');
        setDuracion(60);
        setUsuarioSeleccionado(null);
        onClose();
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    {reservaEditando ? 'Editar Reserva' : 'Nueva Reserva'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        <FormSelect
                            label="Pista"
                            value={formData.pistaId}
                            onChange={(v) => setFormData({ ...formData, pistaId: Number(v) })}
                            options={pistas.map(p => ({
                                value: p.id,
                                label: `${p.nombre} - ${p.tipo} (€${p.precioHora}/h)`
                            }))}
                            required
                        />

                        <Box>
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => setModalUsuarioAbierto(true)}
                            >
                                {usuarioSeleccionado
                                    ? `${usuarioSeleccionado.nombre} ${usuarioSeleccionado.apellidos}`
                                    : 'Seleccionar Usuario'}
                            </Button>
                            {usuarioSeleccionado && (
                                <Box sx={{ mt: 1, fontSize: '0.875rem', color: 'text.secondary' }}>
                                    Email: {usuarioSeleccionado.email}
                                </Box>
                            )}
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
                            label="Precio (€) - Auto-calculado"
                            type="number"
                            value={formData.precio}
                            onChange={(v) => setFormData({ ...formData, precio: parseFloat(v) || 0 })}
                            required
                        />

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <FormSelect
                                label="Tipo de Reserva"
                                value={formData.tipoReserva || 'individual'}
                                onChange={(v) => setFormData({ ...formData, tipoReserva: v as string })}
                                options={[
                                    { value: 'individual', label: 'Individual' },
                                    { value: 'club', label: 'Club' },
                                    { value: 'clase', label: 'Clase' }
                                ]}
                                required
                            />

                            <FormSelect
                                label="Estado"
                                value={formData.status || 'confirmada'}
                                onChange={(v) => setFormData({ ...formData, status: v as string })}
                                options={[
                                    { value: 'pendiente', label: 'Pendiente' },
                                    { value: 'confirmada', label: 'Confirmada' },
                                    { value: 'en_curso', label: 'En Curso' },
                                    { value: 'completada', label: 'Completada' },
                                    { value: 'cancelada', label: 'Cancelada' },
                                    { value: 'no_show', label: 'No Show' }
                                ]}
                                required
                            />
                        </Box>

                        <FormSelect
                            label="Método de Pago"
                            value={formData.metodoPago || 'tarjeta'}
                            onChange={(v) => setFormData({ ...formData, metodoPago: v as string })}
                            options={[
                                { value: 'efectivo', label: 'Efectivo' },
                                { value: 'tarjeta', label: 'Tarjeta' },
                                { value: 'transferencia', label: 'Transferencia' }
                            ]}
                            required
                        />

                        <FormField
                            label="Notas (opcional)"
                            value={formData.notas || ''}
                            onChange={(v) => setFormData({ ...formData, notas: v })}
                            multiline
                            rows={3}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="inherit">
                        Cancelar
                    </Button>
                    <Button onClick={handleGuardar} variant="contained">
                        {reservaEditando ? 'Actualizar' : 'Crear'}
                    </Button>
                </DialogActions>
            </Dialog>

            <UserSelector
                open={modalUsuarioAbierto}
                onClose={() => setModalUsuarioAbierto(false)}
                onSelectUser={handleSelectUser}
                usuarios={usuarios}
                defaultUser={usuarioSeleccionado || undefined}
            />
        </>
    );
};
