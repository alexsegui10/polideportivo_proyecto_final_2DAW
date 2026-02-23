/**
 * RecoverPasswordForm - Componente de recuperación de contraseña
 * Arquitectura: Component → Hook → Context → Service
 */

import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Alert, Box } from '@mui/material';
import { FormularioAuth } from '../Shared/FormularioAuth';
import { CampoFormulario } from '../Shared/CampoFormulario';

export const RecoverPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      // TODO: Implementar servicio de recuperación de contraseña
      // await recoverPassword({ email });
      
      // Simulación temporal
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al enviar email de recuperación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormularioAuth 
      titulo="Recuperar Contraseña" 
      subtitulo="Te enviaremos un link de recuperación"
      onSubmit={handleSubmit}
    >
      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Success Message */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Email enviado correctamente. Revisa tu bandeja de entrada.
        </Alert>
      )}

      {/* Email Field */}
      <CampoFormulario
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        icono="mail"
      />

      {/* Submit Button */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading || success}
        sx={{
          py: 1.5,
          mb: 2,
          mt: 3,
          background: 'linear-gradient(135deg, #067ff9 0%, #0558b8 100%)',
          fontSize: 16,
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: '0 4px 20px rgba(6, 127, 249, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0558b8 0%, #044a9f 100%)',
            boxShadow: '0 6px 25px rgba(6, 127, 249, 0.4)',
          },
          '&:disabled': {
            background: 'rgba(6, 127, 249, 0.3)',
            color: 'rgba(255, 255, 255, 0.5)',
          },
        }}
      >
        {loading ? 'Enviando...' : success ? 'Email Enviado' : 'Enviar Email'}
      </Button>

      {/* Link a Login */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 14 }}>
          <Link 
            to="/auth/login" 
            style={{ 
              color: '#067ff9', 
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Volver al Login
          </Link>
        </Typography>
      </Box>
    </FormularioAuth>
  );
};
