/**
 * LoginForm - Componente de formulario de login
 * Arquitectura: Component → Hook → Context → Service
 */

import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Typography, Checkbox, FormControlLabel, Alert, Box } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { FormularioAuth } from '../Shared/FormularioAuth';
import { CampoFormulario } from '../Shared/CampoFormulario';
import { useAuthMutations } from '../../hooks';

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuthMutations();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormularioAuth 
      titulo="Iniciar Sesión" 
      subtitulo="Accede a tu cuenta de Emotiva Poli"
      onSubmit={handleSubmit}
    >
      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Email Field */}
      <CampoFormulario
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        icono={<EmailIcon fontSize="small" />}
      />

      {/* Password Field */}
      <CampoFormulario
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        icono={<LockIcon fontSize="small" />}
      />

      {/* Remember Me */}
      <FormControlLabel
        control={
          <Checkbox
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            sx={{
              color: 'rgba(255, 255, 255, 0.5)',
              '&.Mui-checked': {
                color: '#067ff9',
              },
            }}
          />
        }
        label={
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 14 }}>
            Recordarme
          </Typography>
        }
        sx={{ mb: 3 }}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{
          py: 1.5,
          mb: 2,
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
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>

      {/* Link a Register */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 14 }}>
          ¿No tienes cuenta?{' '}
          <Link 
            to="/auth/register" 
            style={{ 
              color: '#067ff9', 
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Regístrate aquí
          </Link>
        </Typography>
      </Box>

      {/* Link a Recover Password */}
      <Box sx={{ textAlign: 'center' }}>
        <Link 
          to="/auth/recover" 
          style={{ 
            color: 'rgba(255, 255, 255, 0.5)', 
            textDecoration: 'none',
            fontSize: 14,
          }}
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </Box>
    </FormularioAuth>
  );
};
