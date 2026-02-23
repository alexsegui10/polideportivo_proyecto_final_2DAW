/**
 * AuthPage - Página principal de autenticación
 * Arquitectura: Page → Components → Hooks
 * Uso: Rutas /auth/login, /auth/register, /auth/recover
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from '../../components/Auth/LoginForm';
import { RegisterForm } from '../../components/Auth/RegisterForm';
import { RecoverPasswordForm } from '../../components/Auth/RecoverPasswordForm';

export const AuthPage = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/recover" element={<RecoverPasswordForm />} />
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
};
