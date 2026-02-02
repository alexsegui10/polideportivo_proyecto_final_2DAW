// Types para Pistas
export interface Pista {
  id: number;
  nombre: string;
  tipo: string;
  status: string;
  isActive: boolean;
  slug: string;
  precioHora: number;
  descripcion?: string;
  imagen?: string;
}

// Request para crear/actualizar pista (slug se genera automáticamente)
export interface PistaRequest {
  nombre: string;
  tipo: string;
  status: string;
  isActive: boolean;
  precioHora: number;
  descripcion?: string;
  imagen?: string;
}

// Types para Usuarios (completos según backend)
export interface Usuario {
  id: number;
  uid: string;
  slug: string;
  nombre: string;
  apellidos?: string;
  email: string;
  telefono?: string;
  dni?: string;
  fechaNacimiento?: string;
  avatar?: string;
  role: string; // admin, cliente, entrenador
  status: string; // activo, inactivo, suspendido, eliminado
  isActive: boolean;
  especialidad?: string;
  certificaciones?: string;
  bio?: string;
  direccion?: string;
  ciudad?: string;
  codigoPostal?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

// Request para crear usuario (slug se genera automáticamente)
export interface UsuarioCreateRequest {
  nombre: string;
  apellidos?: string;
  email: string;
  telefono?: string;
  dni?: string;
  fechaNacimiento?: string;
  avatar?: string;
  passwordHash: string; // Obligatorio
  role?: string;
  status?: string;
  isActive?: boolean;
  especialidad?: string;
  certificaciones?: string;
  bio?: string;
  direccion?: string;
  ciudad?: string;
  codigoPostal?: string;
}

// Request para actualizar usuario
export interface UsuarioUpdateRequest {
  nombre?: string;
  apellidos?: string;
  email?: string;
  telefono?: string;
  dni?: string;
  fechaNacimiento?: string;
  avatar?: string;
  role?: string;
  status?: string;
  isActive?: boolean;
  especialidad?: string;
  certificaciones?: string;
  bio?: string;
  direccion?: string;
  ciudad?: string;
  codigoPostal?: string;
}

// Types para Pagos
export interface Pago {
  id: number;
  uid: string;
  usuarioId: number;
  reservaId?: number;
  claseInscripcionId?: number;
  clubSuscripcionId?: number;
  amount: number;
  currency: string;
  provider: string;
  providerPaymentId?: string;
  status: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Types para Clubs
export interface Club {
  id: number;
  uid: string;
  slug: string;
  nombre: string;
  descripcion?: string;
  deporte: string;
  imagen?: string;
  entrenadorId: number;
  maxMiembros: number;
  nivel: string;
  precioMensual: number;
  status: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClubCreateRequest {
  nombre: string;
  descripcion?: string;
  deporte: string;
  imagen?: string;
  entrenadorId: number;
  maxMiembros?: number;
  nivel?: string;
  precioMensual: number;
  status?: string;
  isActive?: boolean;
}

export interface ClubUpdateRequest {
  nombre?: string;
  descripcion?: string;
  deporte?: string;
  imagen?: string;
  entrenadorId?: number;
  maxMiembros?: number;
  nivel?: string;
  precioMensual?: number;
  status?: string;
  isActive?: boolean;
}

// Types para Clases Públicas
export interface ClasePublica {
  id: number;
  uid: string;
  slug: string;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  entrenadorId: number;
  pistaId: number;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  duracionMinutos: number;
  maxParticipantes: number;
  precio: number;
  nivel: string;
  deporte: string;
  status: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClaseCreateRequest {
  nombre: string;
  descripcion?: string;
  imagen?: string;
  entrenadorId: number;
  pistaId: number;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  duracionMinutos: number;
  maxParticipantes?: number;
  precio?: number;
  nivel?: string;
  deporte: string;
  status?: string;
  isActive?: boolean;
}

export interface ClaseUpdateRequest {
  nombre?: string;
  descripcion?: string;
  imagen?: string;
  entrenadorId?: number;
  pistaId?: number;
  fechaHoraInicio?: string;
  fechaHoraFin?: string;
  duracionMinutos?: number;
  maxParticipantes?: number;
  precio?: number;
  nivel?: string;
  deporte?: string;
  status?: string;
  isActive?: boolean;
}

// Types para Reservas
export interface Reserva {
  id: number;
  uid: string;
  slug: string;
  pistaId: number;
  usuarioId: number;
  usuarioNombre?: string;
  usuarioApellidos?: string;
  clubId?: number;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  precio: number;
  metodoPago: string;
  status: string;
  isActive: boolean;
  notas?: string;
  tipoReserva: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReservaWithPago extends Reserva {
  pistaNombre: string;
  usuarioNombre: string;
  pagoId?: number;
  pagoAmount?: number;
  pagoStatus?: string;
  pagoProvider?: string;
}

export interface ReservaCreateRequest {
  pistaId: number;
  usuarioId: number;
  clubId?: number;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  precio: number;
  metodoPago: string;
  status?: string;
  isActive?: boolean;
  notas?: string;
  tipoReserva?: string;
}

export interface ReservaUpdateRequest {
  pistaId?: number;
  clubId?: number;
  fechaHoraInicio?: string;
  fechaHoraFin?: string;
  precio?: number;
  metodoPago?: string;
  status?: string;
  isActive?: boolean;
  notas?: string;
  tipoReserva?: string;
}