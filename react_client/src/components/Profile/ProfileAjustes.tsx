/**
 * ProfileAjustes - Pestaña de ajustes del perfil (solo visible para el owner)
 */

import { useState } from 'react'
import {
  Box, Typography, Switch, FormControlLabel, Button, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, CircularProgress, Alert
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SecurityIcon from '@mui/icons-material/Security'
import LanguageIcon from '@mui/icons-material/Language'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useAuth } from '../../hooks'
import { changePassword } from '../../services/mutations/usuariosMutations'

const sectionSx = {
  bgcolor: '#111722',
  border: '1px solid rgba(255,255,255,0.05)',
  borderRadius: 3,
  p: 3,
  boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
} as const

const NOTIFICACIONES = [
  { label: 'Confirmación de reserva por email',    defaultChecked: true  },
  { label: 'Recordatorio 24h antes de la reserva', defaultChecked: true  },
  { label: 'Novedades y promociones',              defaultChecked: false },
]

export const ProfileAjustes = () => {
  const { user } = useAuth()

  // ── Estado del diálogo de cambio de contraseña ──
  const [dialogOpen, setDialogOpen]       = useState(false)
  const [currentPwd, setCurrentPwd]       = useState('')
  const [newPwd, setNewPwd]               = useState('')
  const [confirmPwd, setConfirmPwd]       = useState('')
  const [pwdLoading, setPwdLoading]       = useState(false)
  const [pwdError, setPwdError]           = useState<string | null>(null)
  const [pwdSuccess, setPwdSuccess]       = useState(false)

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setCurrentPwd('')
    setNewPwd('')
    setConfirmPwd('')
    setPwdError(null)
    setPwdSuccess(false)
  }

  const handleChangePassword = async () => {
    if (newPwd !== confirmPwd) {
      setPwdError('Las contraseñas nuevas no coinciden')
      return
    }
    if (newPwd.length < 8) {
      setPwdError('La nueva contraseña debe tener al menos 8 caracteres')
      return
    }
    if (!user?.slug) return
    setPwdLoading(true)
    setPwdError(null)
    try {
      await changePassword(user.slug, { currentPassword: currentPwd, newPassword: newPwd })
      setPwdSuccess(true)
      setTimeout(handleCloseDialog, 1500)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setPwdError(msg ?? 'Error al cambiar la contraseña')
    } finally {
      setPwdLoading(false)
    }
  }

  const pwdFieldSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: '#0f1720',
      color: 'white',
      '& fieldset': { borderColor: '#1e293b' },
      '&:hover fieldset': { borderColor: '#334155' },
      '&.Mui-focused fieldset': { borderColor: '#067ff9' },
    },
    '& input': { fontSize: '0.875rem' },
    '& .MuiInputLabel-root': { color: '#94a3b8' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#067ff9' },
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

      {/* Notificaciones */}
      <Box sx={sectionSx}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <NotificationsIcon sx={{ color: '#067ff9', fontSize: 20 }} />
          <Typography variant="body1" fontWeight={700} sx={{ color: 'white' }}>
            Notificaciones
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {NOTIFICACIONES.map(({ label, defaultChecked }) => (
            <FormControlLabel
              key={label}
              control={
                <Switch
                  defaultChecked={defaultChecked}
                  size="small"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked':                 { color: '#067ff9' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#067ff9' },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                  {label}
                </Typography>
              }
              sx={{ mx: 0, py: 0.5 }}
            />
          ))}
        </Box>
      </Box>

      {/* Seguridad */}
      <Box sx={sectionSx}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <SecurityIcon sx={{ color: '#22c55e', fontSize: 20 }} />
          <Typography variant="body1" fontWeight={700} sx={{ color: 'white' }}>
            Seguridad
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2.5 }}>
          Mantén tu cuenta segura actualizando tu contraseña regularmente.
        </Typography>

        <Button
          variant="outlined"
          size="small"
          onClick={() => setDialogOpen(true)}
          sx={{
            color: '#067ff9', borderColor: 'rgba(6,127,249,0.3)',
            textTransform: 'none', fontWeight: 600, fontSize: '0.875rem',
            '&:hover': { borderColor: '#067ff9', bgcolor: 'rgba(6,127,249,0.05)' },
          }}
        >
          Cambiar Contraseña
        </Button>
      </Box>

      {/* Idioma y región */}
      <Box sx={sectionSx}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <LanguageIcon sx={{ color: '#a855f7', fontSize: 20 }} />
          <Typography variant="body1" fontWeight={700} sx={{ color: 'white' }}>
            Idioma y Región
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ color: '#64748b' }}>
          Español (España) — UTC+1
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />

      {/* Zona de peligro */}
      <Box sx={{ ...sectionSx, border: '1px solid rgba(239,68,68,0.2)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <DeleteOutlineIcon sx={{ color: '#ef4444', fontSize: 20 }} />
          <Typography variant="body1" fontWeight={700} sx={{ color: '#ef4444' }}>
            Zona de Peligro
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ color: '#64748b', mb: 2.5 }}>
          Una vez eliminada tu cuenta, todos los datos serán borrados de forma permanente y no podrán recuperarse.
        </Typography>

        <Button
          variant="outlined"
          size="small"
          color="error"
          sx={{
            textTransform: 'none', fontWeight: 600, fontSize: '0.875rem',
            '&:hover': { bgcolor: 'rgba(239,68,68,0.05)' },
          }}
        >
          Eliminar Cuenta
        </Button>
      </Box>

      {/* ── Diálogo: Cambiar Contraseña ── */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        PaperProps={{ sx: { bgcolor: '#111722', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, minWidth: 360 } }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 700, pb: 1 }}>
          Cambiar Contraseña
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '16px !important' }}>
          {pwdSuccess && (
            <Alert severity="success" sx={{ bgcolor: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
              ¡Contraseña actualizada correctamente!
            </Alert>
          )}
          {pwdError && (
            <Alert severity="error" sx={{ bgcolor: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
              {pwdError}
            </Alert>
          )}

          <TextField
            label="Contraseña actual"
            type="password"
            fullWidth
            value={currentPwd}
            onChange={e => setCurrentPwd(e.target.value)}
            disabled={pwdLoading || pwdSuccess}
            sx={pwdFieldSx}
          />
          <TextField
            label="Nueva contraseña"
            type="password"
            fullWidth
            value={newPwd}
            onChange={e => setNewPwd(e.target.value)}
            disabled={pwdLoading || pwdSuccess}
            helperText="Mínimo 8 caracteres"
            FormHelperTextProps={{ sx: { color: '#64748b' } }}
            sx={pwdFieldSx}
          />
          <TextField
            label="Confirmar nueva contraseña"
            type="password"
            fullWidth
            value={confirmPwd}
            onChange={e => setConfirmPwd(e.target.value)}
            disabled={pwdLoading || pwdSuccess}
            sx={pwdFieldSx}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={handleCloseDialog}
            disabled={pwdLoading}
            sx={{ color: '#64748b', textTransform: 'none' }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleChangePassword}
            disabled={pwdLoading || pwdSuccess || !currentPwd || !newPwd || !confirmPwd}
            startIcon={pwdLoading ? <CircularProgress size={16} color="inherit" /> : undefined}
            sx={{
              bgcolor: '#067ff9',
              '&:hover': { bgcolor: '#0558b8' },
              textTransform: 'none', fontWeight: 600
            }}
          >
            {pwdLoading ? 'Guardando…' : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  )
}
