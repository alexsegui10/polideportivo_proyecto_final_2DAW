/**
 * RegisterForm - Componente de formulario de registro
 * Arquitectura: Component → Hook → Context → Service
 */

import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Typography, Alert, Box } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { FormularioAuth } from '../Shared/FormularioAuth';
import { CampoFormulario } from '../Shared/CampoFormulario';
import { useAuthMutations } from '../../hooks';

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuthMutations();
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    dni: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      await register({
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        email: formData.email,
        password: formData.password,
        telefono: formData.telefono || undefined,
        dni: formData.dni || undefined,
      });
      
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormularioAuth 
      titulo="Crear Cuenta" 
      subtitulo="Únete a Emotiva Poli"
      onSubmit={handleSubmit}
    >
      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Nombre y Apellidos */}
      <Box sx={{ display: 'flex', gap: 2, mb: 0 }}>
        <CampoFormulario
          label="Nombre"
          value={formData.nombre}
          onChange={(e) => handleChange('nombre', e.target.value)}
          required
        />
        <CampoFormulario
          label="Apellidos"
          value={formData.apellidos}
          onChange={(e) => handleChange('apellidos', e.target.value)}
          required
        />
      </Box>

      {/* Email */}
      <CampoFormulario
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        required
        icono={<EmailIcon fontSize="small" />}
      />

      {/* Teléfono y DNI */}
      <Box sx={{ display: 'flex', gap: 2, mb: 0 }}>
        <CampoFormulario
          label="Teléfono (opcional)"
          value={formData.telefono}
          onChange={(e) => handleChange('telefono', e.target.value)}
        />
        <CampoFormulario
          label="DNI (opcional)"
          value={formData.dni}
          onChange={(e) => handleChange('dni', e.target.value)}
        />
      </Box>

      {/* Password */}
      <CampoFormulario
        label="Contraseña"
        type="password"
        value={formData.password}
        onChange={(e) => handleChange('password', e.target.value)}
        required
        icono={<LockIcon fontSize="small" />}
      />

      {/* Confirm Password */}
      <CampoFormulario
        label="Confirmar Contraseña"
        type="password"
        value={formData.confirmPassword}
        onChange={(e) => handleChange('confirmPassword', e.target.value)}
        required
        icono={<LockIcon fontSize="small" />}
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
        {loading ? 'Registrando...' : 'Crear Cuenta'}
      </Button>

      {/* Link a Login */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 14 }}>
          ¿Ya tienes cuenta?{' '}
          <Link 
            to="/auth/login" 
            style={{ 
              color: '#067ff9', 
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Iniciar Sesión
          </Link>
        </Typography>
      </Box>
    </FormularioAuth>
  );
};
