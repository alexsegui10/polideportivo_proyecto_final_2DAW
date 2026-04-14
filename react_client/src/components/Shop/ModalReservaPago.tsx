import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, TextField, Select, MenuItem,
  FormControl, InputLabel, CircularProgress, Alert, Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EuroIcon from '@mui/icons-material/Euro';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createPaymentIntent } from '../../services/mutations/pagosMutations';
import { useAuth } from '../../hooks';
import { Pista } from '../../types';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#ffffff',
      fontFamily: '"Inter", sans-serif',
      '::placeholder': { color: 'rgba(255,255,255,0.4)' },
    },
    invalid: { color: '#ef4444' },
  },
};

const HORAS_DISPONIBLES = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
  '16:00', '17:00', '18:00', '19:00', '20:00', '21:00',
];

// ── Formulario interno (necesita estar dentro de <Elements>) ────────────────
interface CheckoutFormProps {
  pista: Pista;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  precio: number;
  onSuccess: () => void;
}

const CheckoutForm = ({ pista, fechaHoraInicio, fechaHoraFin, precio, onSuccess }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePagar = async () => {
    if (!stripe || !elements || !user) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Crear reserva PENDIENTE + Stripe PaymentIntent en el backend
      const { clientSecret } = await createPaymentIntent({
        pistaId: pista.id,
        usuarioId: user.id,
        fechaHoraInicio,
        fechaHoraFin,
        precio,
      });

      // 2. Confirmar el pago con Stripe.js (el usuario no sale de la web)
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${user.nombre} ${user.apellidos ?? ''}`.trim(),
            email: user.email,
          },
        },
      });

      if (result.error) {
        setError(result.error.message ?? 'Error al procesar el pago');
      } else if (result.paymentIntent?.status === 'succeeded') {
        onSuccess();
      }
    } catch (err: unknown) {
      const axiosMsg =
        (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.error ||
        (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.message;
      const msg = axiosMsg || (err instanceof Error ? err.message : 'Error al procesar la reserva');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Datos de tarjeta */}
      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', mb: 1.5 }}>
        Datos de pago
      </Typography>
      <Box
        sx={{
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 2,
          p: 2,
          bgcolor: 'rgba(255,255,255,0.05)',
          mb: 2,
        }}
      >
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2, fontSize: '0.875rem' }}>
          {error}
        </Alert>
      )}

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={handlePagar}
        disabled={!stripe || loading}
        sx={{
          bgcolor: '#2563eb',
          fontWeight: 700,
          fontSize: '1rem',
          py: 1.5,
          borderRadius: 2,
          textTransform: 'none',
          '&:hover': { bgcolor: '#1d4ed8' },
          '&.Mui-disabled': { bgcolor: 'rgba(37,99,235,0.4)', color: 'rgba(255,255,255,0.5)' },
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={20} color="inherit" />
            Procesando...
          </Box>
        ) : (
          `Pagar €${precio.toFixed(2)}`
        )}
      </Button>

      <Typography sx={{ mt: 1.5, textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
        Pago seguro con Stripe · Tu tarjeta nunca toca nuestros servidores
      </Typography>
    </Box>
  );
};

// ── Modal principal ──────────────────────────────────────────────────────────
interface ModalReservaPagoProps {
  pista: Pista;
  onClose: () => void;
}

export const ModalReservaPago = ({ pista, onClose }: ModalReservaPagoProps) => {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [duracion, setDuracion] = useState(1);
  const [success, setSuccess] = useState(false);

  // Calcular hora de fin y precio
  const calcularHoraFin = (inicio: string, horas: number): string => {
    const [h, m] = inicio.split(':').map(Number);
    const totalMin = h * 60 + m + horas * 60;
    const hFin = Math.floor(totalMin / 60) % 24;
    const mFin = totalMin % 60;
    return `${String(hFin).padStart(2, '0')}:${String(mFin).padStart(2, '0')}`;
  };

  const horaFin = horaInicio ? calcularHoraFin(horaInicio, duracion) : '';
  const precio = pista.precioHora * duracion;
  const fechaHoraInicio = fecha && horaInicio ? `${fecha}T${horaInicio}:00` : '';
  const fechaHoraFin = fecha && horaFin ? `${fecha}T${horaFin}:00` : '';
  const formularioCompleto = !!fecha && !!horaInicio;

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#111722',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 3,
          color: 'white',
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.25rem' }}>Reservar pista</Typography>
          <Typography sx={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>{pista.nombre}</Typography>
        </Box>
        <Button onClick={onClose} sx={{ minWidth: 0, color: 'rgba(255,255,255,0.5)', p: 0.5 }}>
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {success ? (
          // ── Pantalla de éxito ──
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 64, color: '#22c55e', mb: 2 }} />
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, mb: 1 }}>
              ¡Reserva confirmada!
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>
              {pista.nombre} · {fecha} · {horaInicio} – {horaFin}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>
              Recibirás la confirmación cuando Stripe procese el pago.
            </Typography>
          </Box>
        ) : (
          <>
            {/* ── Selección de fecha y hora ── */}
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', mb: 1.5 }}>
              Selecciona fecha y hora
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Fecha"
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                inputProps={{ min: today }}
                InputLabelProps={{ shrink: true }}
                InputProps={{ startAdornment: <EventIcon sx={{ mr: 1, color: 'rgba(255,255,255,0.4)', fontSize: 20 }} /> }}
                sx={{ flex: 1, minWidth: 160, '& .MuiOutlinedInput-root': { color: 'white', borderColor: 'rgba(255,255,255,0.2)' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
              />

              <FormControl sx={{ flex: 1, minWidth: 130 }}>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.6)' }}>Hora inicio</InputLabel>
                <Select
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  label="Hora inicio"
                  startAdornment={<AccessTimeIcon sx={{ mr: 1, color: 'rgba(255,255,255,0.4)', fontSize: 20 }} />}
                  sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' }, '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' } }}
                >
                  {HORAS_DISPONIBLES.map((h) => (
                    <MenuItem key={h} value={h}>{h}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ flex: 1, minWidth: 120 }}>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.6)' }}>Duración</InputLabel>
                <Select
                  value={duracion}
                  onChange={(e) => setDuracion(Number(e.target.value))}
                  label="Duración"
                  sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' }, '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' } }}
                >
                  <MenuItem value={1}>1 hora</MenuItem>
                  <MenuItem value={2}>2 horas</MenuItem>
                  <MenuItem value={3}>3 horas</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* ── Resumen de precio ── */}
            {formularioCompleto && (
              <Box
                sx={{
                  bgcolor: 'rgba(37,99,235,0.15)',
                  border: '1px solid rgba(37,99,235,0.3)',
                  borderRadius: 2,
                  p: 2,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>
                    {fecha} · {horaInicio} – {horaFin} · {duracion}h
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                    €{pista.precioHora}/h × {duracion}h
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <EuroIcon sx={{ fontSize: 20, color: '#2563eb' }} />
                  <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>
                    {precio.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            )}

            {formularioCompleto && stripePromise && (
              <>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2.5 }} />
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    pista={pista}
                    fechaHoraInicio={fechaHoraInicio}
                    fechaHoraFin={fechaHoraFin}
                    precio={precio}
                    onSuccess={() => setSuccess(true)}
                  />
                </Elements>
              </>
            )}

            {formularioCompleto && !stripePromise && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                Falta configurar Stripe en frontend (`VITE_STRIPE_PUBLIC_KEY`).
              </Alert>
            )}

            {!formularioCompleto && (
              <Typography sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', py: 2 }}>
                Selecciona fecha y hora para continuar con el pago
              </Typography>
            )}
          </>
        )}
      </DialogContent>

      {success && (
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={onClose}
            sx={{ bgcolor: '#22c55e', fontWeight: 700, textTransform: 'none', borderRadius: 2, '&:hover': { bgcolor: '#16a34a' } }}
          >
            Cerrar
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
