/**
 * AuthContext - Contexto global de autenticación
 * JWT con refresh token en cookie HttpOnly + BroadcastChannel para multi-tabs.
 */

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { JwtService } from '../services/JwtService';
import { authChannel, refreshSession } from '../services/apiSpring';
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
  // Inicializar token DESDE localStorage directamente — evita que el efecto
  // de sincronización corra con null en el primer render y borre el token.
  const [token, setToken] = useState<string | null>(() => JwtService.getToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isAuth  = !!user && !!token;
  const isAdmin = user?.role.toLowerCase() === 'admin';

  const logout = async (): Promise<void> => {
    try { await logoutService(); } catch { /* ignorar si ya expiró */ }
    setUser(null);
    setToken(null);
    window.location.href = '/auth/login';
  };

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await loginService(credentials);
    setUser(response.usuario);
    setToken(response.accessToken);
    console.log('[AUTH] Login OK - role:', response.usuario.role, '| token inicio:', response.accessToken.substring(0, 40));
    return response;
  };

  const register = async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await registerService(data);
    setUser(response.usuario);
    setToken(response.accessToken);
    return response;
  };

  const reloadUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (err: any) {
      const status = err?.response?.status;
      console.log('[AUTH] reloadUser FAIL - status:', status);
      if (status === 401) logout();
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      const storedToken = JwtService.getToken();
      console.log('[AUTH] initAuth - token en storage:', storedToken ? 'EXISTE(' + storedToken.substring(0,20) + ')' : 'NINGUNO');

      console.log('[AUTH] initAuth START - token:', storedToken ? storedToken.substring(0, 40) + '...' : 'NINGUNO');

      if (storedToken) {
        // Token ya está en el estado inicial — no hace falta setToken aquí
        const tryGetUser = async (): Promise<void> => {
          const userData = await getCurrentUser();
          const currentToken = JwtService.getToken();
          if (currentToken && currentToken !== storedToken) setToken(currentToken);
          setUser(userData);
        };

        try {
          await tryGetUser();
          console.log('[AUTH] initAuth - getCurrentUser OK');
        } catch (firstErr: any) {
          const status = firstErr?.response?.status;
          console.log('[AUTH] initAuth - FAIL status:', status, '| token ahora:', JwtService.getToken() ? 'EXISTE' : 'DESTRUIDO');

          if (!status) {
            console.log('[AUTH] Red caida - reintentando en 2s...');
            try {
              await new Promise(r => setTimeout(r, 2000));
              await tryGetUser();
              console.log('[AUTH] Reintento OK');
            } catch (retryErr: any) {
              console.log('[AUTH] Reintento FAIL status:', retryErr?.response?.status);
              if (!JwtService.getToken()) setToken(null);
            }
          } else if (status === 401) {
            // Token expirado — destruirlo activamente y limpiar sesión
            // El interceptor no lo manejó (Axios headers bug), lo hacemos aquí
            console.log('[AUTH] 401 en initAuth - token expirado, limpiando');
            JwtService.destroyToken();
            setToken(null);
            const publicPaths = ['/auth', '/login', '/register'];
            const isPublic = publicPaths.some(p => window.location.pathname.startsWith(p));
            if (!isPublic) window.location.href = '/auth/login';
          } else {
            console.log('[AUTH] Error', status, '- preservando token');
          }
        }
      } else {
        console.log('[AUTH] Sin token local - intentando refresh con cookie...');
        try {
          const { data } = await refreshSession();
          JwtService.saveToken(data.accessToken);
          setToken(data.accessToken);
          const userData = await getCurrentUser();
          setUser(userData);
          console.log('[AUTH] Sesion restaurada via cookie');
        } catch {
          console.log('[AUTH] Sin cookie valida - no autenticado');
        }
      }

      console.log('[AUTH] initAuth END');
      setIsLoading(false);
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (token) JwtService.saveToken(token);
    else JwtService.destroyToken();
  }, [token]);

  useEffect(() => {
    const handleTokenRefreshed = (e: Event) => {
      const newToken = (e as CustomEvent<{ token: string }>).detail.token;
      console.log('[AUTH] auth:tokenRefreshed');
      setToken(newToken);
    };
    window.addEventListener('auth:tokenRefreshed', handleTokenRefreshed);
    return () => window.removeEventListener('auth:tokenRefreshed', handleTokenRefreshed);
  }, []);

  useEffect(() => {
    const handleSessionExpired = () => {
      console.log('[AUTH] auth:sessionExpired - redirigiendo a login');
      setUser(null);
      setToken(null);
      const publicPaths = ['/auth', '/login', '/register'];
      const isPublic = publicPaths.some(p => window.location.pathname.startsWith(p));
      if (!isPublic) window.location.href = '/auth/login';
    };
    window.addEventListener('auth:sessionExpired', handleSessionExpired);
    return () => window.removeEventListener('auth:sessionExpired', handleSessionExpired);
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'LOGOUT') {
        setUser(null);
        setToken(null);
        JwtService.destroyToken();
      } else if (event.data?.type === 'TOKEN_REFRESHED') {
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
