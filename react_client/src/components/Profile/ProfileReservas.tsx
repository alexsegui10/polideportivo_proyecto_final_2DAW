import { useEffect, useMemo, useState } from 'react'
import { Box, Typography, Grid, Chip, CircularProgress, Alert } from '@mui/material'
import EventIcon from '@mui/icons-material/Event'
import GroupIcon from '@mui/icons-material/Group'
import SchoolIcon from '@mui/icons-material/School'
import { useAuth, useReservas, useClubMiembroMutations, useClaseInscripcionMutations } from '../../hooks'
import { ClaseInscripcion, ClubMiembro } from '../../types'

const cardSx = {
  bgcolor: '#111722',
  border: '1px solid rgba(255,255,255,0.05)',
  borderRadius: 3,
  p: 3,
  boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
  height: '100%',
} as const

const itemSx = {
  py: 1.5,
  borderBottom: '1px solid rgba(255,255,255,0.06)',
  '&:last-of-type': { borderBottom: 'none' },
} as const

const formatDate = (value?: string) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const ProfileReservas = () => {
  const { user } = useAuth()
  const { reservas, loading: loadingReservas, error: errorReservas } = useReservas()
  const { getClubsByUsuarioId } = useClubMiembroMutations()
  const { getClasesByUsuarioId } = useClaseInscripcionMutations()

  const [clubs, setClubs] = useState<ClubMiembro[]>([])
  const [clases, setClases] = useState<ClaseInscripcion[]>([])
  const [loadingRelacionados, setLoadingRelacionados] = useState(false)
  const [errorRelacionados, setErrorRelacionados] = useState<string | null>(null)

  const reservasUsuario = useMemo(
    () => (user ? reservas.filter((reserva) => reserva.usuarioId === user.id) : []),
    [reservas, user]
  )

  useEffect(() => {
    if (!user) {
      setClubs([])
      setClases([])
      return
    }

    setLoadingRelacionados(true)
    setErrorRelacionados(null)

    Promise.all([
      getClubsByUsuarioId(user.id),
      getClasesByUsuarioId(user.id),
    ])
      .then(([clubsData, clasesData]) => {
        setClubs(clubsData)
        setClases(clasesData)
      })
      .catch((err: unknown) => {
        setErrorRelacionados(err instanceof Error ? err.message : 'Error al cargar actividad del perfil')
      })
      .finally(() => setLoadingRelacionados(false))
  }, [user, getClubsByUsuarioId, getClasesByUsuarioId])

  if (!user) {
    return (
      <Alert severity="info" sx={{ bgcolor: 'rgba(6,127,249,0.08)', color: '#93c5fd' }}>
        Inicia sesión para ver tu actividad.
      </Alert>
    )
  }

  if (loadingReservas || loadingRelacionados) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 280 }}>
        <CircularProgress size={42} />
      </Box>
    )
  }

  const error = errorReservas || errorRelacionados
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    )
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={4}>
        <Box sx={cardSx}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <EventIcon sx={{ color: '#067ff9', fontSize: 20 }} />
            <Typography variant="body1" fontWeight={700} sx={{ color: 'white' }}>
              Mis Reservas
            </Typography>
            <Chip size="small" label={reservasUsuario.length} sx={{ ml: 'auto', bgcolor: 'rgba(6,127,249,0.15)', color: '#93c5fd' }} />
          </Box>

          {reservasUsuario.length === 0 ? (
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              No tienes reservas todavía.
            </Typography>
          ) : (
            reservasUsuario.slice(0, 8).map((reserva) => (
              <Box key={reserva.uid} sx={itemSx}>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                  {reserva.tipoReserva || 'Reserva'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                  {formatDate(reserva.fechaHoraInicio)} → {formatDate(reserva.fechaHoraFin)}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  Estado: {reserva.status}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Grid>

      <Grid item xs={12} lg={4}>
        <Box sx={cardSx}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <GroupIcon sx={{ color: '#22c55e', fontSize: 20 }} />
            <Typography variant="body1" fontWeight={700} sx={{ color: 'white' }}>
              Mis Clubs
            </Typography>
            <Chip size="small" label={clubs.length} sx={{ ml: 'auto', bgcolor: 'rgba(34,197,94,0.15)', color: '#86efac' }} />
          </Box>

          {clubs.length === 0 ? (
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              No perteneces a ningún club.
            </Typography>
          ) : (
            clubs.slice(0, 8).map((club) => (
              <Box key={club.uid} sx={itemSx}>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                  {club.clubNombre || `Club #${club.clubId}`}
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                  Inscrito: {formatDate(club.fechaInscripcion)}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  Estado: {club.status}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Grid>

      <Grid item xs={12} lg={4}>
        <Box sx={cardSx}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <SchoolIcon sx={{ color: '#a855f7', fontSize: 20 }} />
            <Typography variant="body1" fontWeight={700} sx={{ color: 'white' }}>
              Mis Clases
            </Typography>
            <Chip size="small" label={clases.length} sx={{ ml: 'auto', bgcolor: 'rgba(168,85,247,0.15)', color: '#d8b4fe' }} />
          </Box>

          {clases.length === 0 ? (
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              No tienes clases inscritas.
            </Typography>
          ) : (
            clases.slice(0, 8).map((clase) => (
              <Box key={clase.uid} sx={itemSx}>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                  {clase.claseNombre || `Clase #${clase.claseId}`}
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                  {formatDate(clase.claseFechaHoraInicio)}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  Estado: {clase.status}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Grid>
    </Grid>
  )
}
