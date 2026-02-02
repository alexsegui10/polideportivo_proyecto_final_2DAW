import { Box } from '@mui/material';
import { FormField, FormSelect } from './';

interface DateTimeWithDurationProps {
    fecha: string; // YYYY-MM-DD
    hora: string; // HH:mm
    duracionMinutos: number;
    onChangeFecha: (value: string) => void;
    onChangeHora: (value: string) => void;
    onChangeDuracion: (value: number) => void;
    error?: string;
    required?: boolean;
    disabled?: boolean;
}

const DURACIONES = [
    { value: 30, label: '30 minutos' },
    { value: 60, label: '1 hora' },
    { value: 90, label: '1 hora 30 min' },
    { value: 120, label: '2 horas' },
    { value: 150, label: '2 horas 30 min' },
    { value: 180, label: '3 horas' },
    { value: 210, label: '3 horas 30 min' },
    { value: 240, label: '4 horas' }
];

export const DateTimeWithDuration = ({
    fecha,
    hora,
    duracionMinutos,
    onChangeFecha,
    onChangeHora,
    onChangeDuracion,
    error,
    required = true,
    disabled = false
}: DateTimeWithDurationProps) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
                <FormField
                    label="Fecha Inicio"
                    type="text"
                    value={fecha}
                    onChange={onChangeFecha}
                    required={required}
                    disabled={disabled}
                    inputProps={{ type: 'date' }}
                    fullWidth
                />
                <FormField
                    label="Hora Inicio"
                    type="text"
                    value={hora}
                    onChange={onChangeHora}
                    required={required}
                    disabled={disabled}
                    inputProps={{ type: 'time', step: 1 }}
                    fullWidth
                />
            </Box>
            <FormSelect
                label="Duración"
                value={duracionMinutos}
                onChange={(v) => onChangeDuracion(Number(v))}
                options={DURACIONES}
                required={required}
                disabled={disabled}
            />
            {error && (
                <Box sx={{ color: 'error.main', fontSize: '0.875rem' }}>
                    {error}
                </Box>
            )}
        </Box>
    );
};
