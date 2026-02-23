import axios from 'axios';
import { JwtService } from './JwtService';

// Canal compartido entre pestañas (doc profesora 4_BroadcastChannel.txt)
export const authChannel = new BroadcastChannel('auth');

// Instancia principal — todas las peticiones autenticadas
export const apiSpring = axios.create({
  baseURL: (import.meta as any).env.VITE_SPRINGBOOT_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,   // enviar/recibir cookies HttpOnly (refresh token)
});

// Instancia sin interceptores para el propio /auth/refresh (evita bucle infinito)
const apiSpringRaw = axios.create({
  baseURL: (import.meta as any).env.VITE_SPRINGBOOT_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// ── Request interceptor: inyecta access token ───────────────────
apiSpring.interceptors.request.use(
  (config) => {
    const token = JwtService.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // Enviar deviceId en cada petición para que el backend pueda identificar el dispositivo
    config.headers['X-Device-Id'] = JwtService.getDeviceId();
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: maneja 401 con refresh ────────────────
apiSpring.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status   = error.response?.status;

    // Solo intentar refresh en 401 y solo una vez (_retry flag)
    if (status === 401 && !original._retry) {
      original._retry = true;

      try {
        // Llamar a /auth/refresh con la instancia sin interceptores (evita recursión)
        const { data } = await apiSpringRaw.post('/auth/refresh');
        const newAccessToken: string = data.accessToken;

        // Guardar nuevo access token y reintentar la petición original
        JwtService.saveToken(newAccessToken);
        original.headers.Authorization = `Bearer ${newAccessToken}`;

        // Avisar a las demás pestañas que hay nuevo token
        authChannel.postMessage({ type: 'TOKEN_REFRESHED', token: newAccessToken });

        return apiSpring(original);

      } catch {
        // Refresh fallido → sesión expirada, limpiar y redirigir
        JwtService.destroyToken();
        authChannel.postMessage({ type: 'LOGOUT' });

        const publicPaths = ['/login', '/auth', '/register'];
        const isAlreadyPublic = publicPaths.some(p =>
          window.location.pathname.startsWith(p)
        );
        if (!isAlreadyPublic) window.location.href = '/login';
      }
    }

    // 403 → autenticado pero sin permisos, dejar que el componente lo gestione
    if (status !== 401) {
      console.error('SpringBoot API Error:', error.response?.data || error.message);
    }

    return Promise.reject(error);
  }
);
