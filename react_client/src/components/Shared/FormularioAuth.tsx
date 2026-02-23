/**
 * FormularioAuth - Componente reutilizable para formularios de autenticación
 * Usado en Login, Register y Recover Password
 */

import { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import SportsIcon from '@mui/icons-material/Sports';

interface FormularioAuthProps {
  children: ReactNode;
  titulo: string;
  subtitulo?: string;
  onSubmit: (e: React.FormEvent) => void;
}

export const FormularioAuth = ({ children, titulo, subtitulo, onSubmit }: FormularioAuthProps) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f1923 0%, #182635 100%)',
        backgroundImage: 'url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
        position: 'relative',
        py: 4,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 25, 35, 0.85)',
        }
      }}
    >
      {/* Card de formulario */}
      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 550,
          mx: 2,
          p: 4,
          backgroundColor: 'rgba(24, 38, 53, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Logo/Icono */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #067ff9 0%, #0558b8 100%)',
              mb: 2,
              boxShadow: '0 4px 20px rgba(6, 127, 249, 0.4)',
            }}
          >
            <SportsIcon sx={{ fontSize: 48, color: 'white' }} />
          </Box>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
            {titulo}
          </Typography>
          {subtitulo && (
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              {subtitulo}
            </Typography>
          )}
        </Box>

        {/* Contenido del formulario (children) */}
        {children}

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: 12 }}>
            © 2024 Emotiva Poli - Polideportivo
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
