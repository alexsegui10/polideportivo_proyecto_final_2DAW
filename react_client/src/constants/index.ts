// Constantes compartidas de la aplicación

// Lista de deportes válidos en el polideportivo
export const DEPORTES = [
  'Pádel',
  'Tenis',
  'Fútbol Sala',
  'Baloncesto',
  'Spinning',
  'Yoga',
  'Natación',
  'Crossfit'
] as const;

export type Deporte = typeof DEPORTES[number];

// Niveles de habilidad
export const NIVELES = [
  'principiante',
  'intermedio',
  'avanzado'
] as const;

export type Nivel = typeof NIVELES[number];

// Estados de reserva
export const ESTADOS_RESERVA = [
  'pendiente',
  'confirmada',
  'en_curso',
  'completada',
  'cancelada',
  'no_show'
] as const;

export type EstadoReserva = typeof ESTADOS_RESERVA[number];

// Estados de clase
export const ESTADOS_CLASE = [
  'pendiente',
  'confirmado',
  'en_curso',
  'completado',
  'cancelado'
] as const;

export type EstadoClase = typeof ESTADOS_CLASE[number];

// Métodos de pago
export const METODOS_PAGO = [
  'efectivo',
  'tarjeta',
  'bizum',
  'transferencia'
] as const;

export type MetodoPago = typeof METODOS_PAGO[number];
