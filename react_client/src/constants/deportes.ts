/**
 * Lista centralizada de deportes disponibles en el polideportivo
 */

export interface Deporte {
    value: string;
    label: string;
}

export const DEPORTES: Deporte[] = [
    { value: 'Pádel', label: 'Pádel' },
    { value: 'Tenis', label: 'Tenis' },
    { value: 'Fútbol Sala', label: 'Fútbol Sala' },
    { value: 'Baloncesto', label: 'Baloncesto' },
    { value: 'Spinning', label: 'Spinning' },
    { value: 'Yoga', label: 'Yoga' },
];
