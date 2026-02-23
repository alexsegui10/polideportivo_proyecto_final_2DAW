// Custom hooks

// Auto-update status
export { useAutoUpdateStatus } from './useAutoUpdateStatus'

// URL & Debounce utilities
export { useUrlState } from './useUrlState'
export { useDebouncedValue } from './useDebouncedValue'

// Auth
export { useAuth } from './queries/useAuth'
export { useAuthMutations } from './mutations/useAuthMutations'

// Profile (público por slug)
export { useProfile } from './queries/useProfile'

// Pistas
export { usePistas } from './queries/usePistas'
export { usePistasMutations } from './mutations/usePistasMutations'
export { usePistasShopQueries } from './queries/usePistasShopQueries'

// Usuarios
export { useUsuarios } from './queries/useUsuarios'
export { useUsuariosMutations } from './mutations/useUsuariosMutations'

// Pagos (solo queries, read-only)
export { usePagos } from './queries/usePagos'

// Clubs
export { useClubs } from './queries/useClubs'
export { useClubsMutations } from './mutations/useClubsMutations'
export { useClubsShopQueries } from './queries/useClubsShopQueries'

// Clases
export { useClases } from './queries/useClases'
export { useClasesMutations } from './mutations/useClasesMutations'
export { useClaseInscripcionMutations } from './mutations/useClaseInscripcionMutations'
export { useClasesShopQueries } from './queries/useClasesShopQueries'

// Clubs
export { useClubMiembroMutations } from './mutations/useClubMiembroMutations'

// Reservas
export { useReservas } from './queries/useReservas'
export { useReservasMutations } from './mutations/useReservasMutations'

