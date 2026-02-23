/**
 * AuthContext - Contexto global de autenticación
 * JWT con refresh token en cookie HttpOnly + BroadcastChannel para multi-tabs.
 */

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { JwtService } from '../services/JwtService';
import { authChannel } from '../services/apiSpring';
import { getCurrentUser } from '../services/queries/authQueries';
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
  type LoginRequest,
  type RegisterRequest,
  type AuthResponse,
} from '../services/mutations/authMutations';

type Usuario = AuthResponse['usuario'];

interface AuthContextValue {
  user: Usuario | null;
  token: string | null;
  isAuth: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  setUser: (user: Usuario | null) => void;
  setToken: (token: string | null) => void;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  register: (data: RegisterRequest) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  reloadUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  isAuth: false,
  isAdmin: false,
  isLoading: true,
  setUser: () => {},
  setToken: () => {},
  login: async () => { throw new Error('AuthContext not initialized'); },
  register: async () => { throw new Error('AuthContext not initialized'); },
  logout: async () => {},
  reloadUser: async () => {},
});

interface AuthProviderProps { children: ReactNode; }

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isAuth  = !!user && !!token;
  const isAdmin = user?.role.toLowerCase() === 'admin';

  // ── Logout ──────────────────────────────────────────────────────
  const logout = async (): Promise<void> => {
    await logoutService();   // invalida DB + borra cookie HttpOnly
    setUser(null);
    setToken(null);
    window.location.href = '/auth/login';
  };

  // ── Login ───────────────────────────────────────────────────────
  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await loginService(credentials);
    setUser(response.usuario);
    setToken(response.accessToken);
    return response;
  };

  // ── Register ────────────────────────────────────────────────────
  const register = async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await registerService(data);
    setUser(response.usuario);
    setToken(response.accessToken);
    return response;
  };

  // ── Reload user ──────────────────────────────────────────────────
  const reloadUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch {
      logout();
    }
  };

  // ── Restaurar sesión al iniciar ──────────────────────────────────
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      const storedToken = JwtService.getToken();

      if (storedToken) {
        setToken(storedToken);
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch {
          // Access token expirado → el interceptor de apiSpring ya intenta refresh
          // Si llega aquí es porque refresh también falló → limpiar
          JwtService.destroyToken();
          setToken(null);
        }
      }
      // Si no hay access token pero hay cookie de refresh, el interceptor lo gestionará
      // en la primera petición protegida (devuelve 401 → refresh → retry)

      setIsLoading(false);
    };

    initAuth();
  }, []);

  // ── Sincronizar token en localStorage ───────────────────────────
  useEffect(() => {
    if (token) {
      JwtService.saveToken(token);
    } else {
      JwtService.destroyToken();
    }
  }, [token]);

  // ── BroadcastChannel: escuchar eventos de otras pestañas ────────
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'LOGOUT') {
        // Otra pestaña hizo logout → limpiar estado sin llamar a la API de nuevo
        setUser(null);
        setToken(null);
        JwtService.destroyToken();
      } else if (event.data?.type === 'TOKEN_REFRESHED') {
        // Otra pestaña refrescó el token → actualizar el nuestro
        const newToken: string = event.data.token;
        setToken(newToken);
        JwtService.saveToken(newToken);
      }
    };

    authChannel.addEventListener('message', handleMessage);
    return () => authChannel.removeEventListener('message', handleMessage);
  }, []);

  const value: AuthContextValue = {
    user, token, isAuth, isAdmin, isLoading,
    setUser, setToken, login, register, logout, reloadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
