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

// ==================== AUTH TYPES ====================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  telefono?: string;
  dni?: string;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}

// Perfil público (sin datos sensibles)
export interface ProfileResponse {
  slug: string;
  nombre: string;
  apellidos: string;
  avatar?: string;
  role: string;
  especialidad?: string;
  certificaciones?: string[];
  bio?: string;
  fechaCreacion: string;
}

// ==================== END AUTH TYPES ====================


// Tipos para Stats del Home
export interface Stats {
  total: number;
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

// Respuesta paginada de búsqueda de pistas
export interface PistaSearchResponse {
  content: Pista[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Parámetros de búsqueda de pistas
export interface PistaSearchParams {
  q?: string;
  tipo?: string;
  precioMax?: number;
  page?: number;
  limit?: number;
  sort?: string;
}

// Parámetros de búsqueda de clases
export interface ClaseSearchParams {
  q?: string;
  deporte?: string;
  nivel?: string;
  precioMax?: number;
  page?: number;
  limit?: number;
  sort?: string;
}

// Respuesta paginada de búsqueda de clases
export interface ClaseSearchResponse {
  content: ClasePublica[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Parámetros de búsqueda de clubs
export interface ClubSearchParams {
  q?: string;
  deporte?: string;
  nivel?: string;
  precioMax?: number;
  page?: number;
  limit?: number;
  sort?: string;
}

// Respuesta paginada de búsqueda de clubs
export interface ClubSearchResponse {
  content: Club[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
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

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
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
// Types para Inscripciones de Clases
export interface ClaseInscripcion {
  id: number;
  uid: string;
  claseId: number;
  claseNombre?: string;
  claseFechaHoraInicio?: string;
  usuarioId: number;
  usuarioNombre?: string;
  usuarioEmail?: string;
  status: string; // confirmada, cancelada, asistio, ausente, eliminado
  isActive: boolean;
  precioPagado: number;
  metodoPago?: string;
  fechaInscripcion: string;
  cancelledAt?: string;
  cancelReason?: string;
  refundStatus?: string;
  refundAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClaseWaitlist {
  id: number;
  uid: string;
  claseId: number;
  claseNombre?: string;
  claseFechaHoraInicio?: string;
  usuarioId: number;
  usuarioNombre?: string;
  usuarioEmail?: string;
  posicion: number;
  status: string; // esperando, convertido, expirado, cancelado
  isActive: boolean;
  fechaRegistro: string;
  fechaNotificacion?: string;
  fechaExpiracion?: string;
  createdAt: string;
  updatedAt: string;
}

// Types para Miembros de Clubs
export interface ClubMiembro {
  id: number;
  uid: string;
  clubId: number;
  clubNombre?: string;
  usuarioId: number;
  usuarioNombre?: string;
  usuarioEmail?: string;
  status: string; // activo, inactivo, expulsado
  isActive: boolean;
  tieneSuscripcionActiva?: boolean;
  fechaInscripcion: string;
  fechaBaja?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClubSuscripcion {
  id: number;
  uid: string;
  clubMiembroUid: string;
  clubNombre?: string;
  usuarioNombre?: string;
  usuarioEmail?: string;
  fechaInicio: string;
  fechaFin?: string;
  precioMensual: number;
  status: string; // activa, pausada, cancelada, vencida, impago
  isActive: boolean;
  proximoCobro: string;
  intentosCobro: number;
  createdAt: string;
  updatedAt: string;
}
// Stripe PaymentIntent
export interface CreatePaymentIntentRequest {
  pistaId: number;
  usuarioId: number;
  fechaHoraInicio: string; // ISO-8601: "2024-03-15T10:00:00"
  fechaHoraFin: string;
  precio: number;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  reservaId: number;
  pagoId: number;
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