import axios from 'axios';
import { JwtService } from './JwtService';


export const authChannel = new BroadcastChannel('auth');

// Instancia principal — todas las peticiones autenticadas
// Usa el proxy de Vite (/api/springboot → SpringBoot:8080/api)
// → la cookie queda bajo el mismo origen que React (withCredentials no es necesario,
//   pero lo mantenemos para que funcione también fuera del proxy)
export const apiSpring = axios.create({
  baseURL: '/api/springboot',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Instancia sin interceptores para el propio /auth/refresh (evita bucle infinito)
const apiSpringRaw = axios.create({
  baseURL: '/api/springboot',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

/**
 * Renueva la sesión usando la cookie HttpOnly de refresh.
 * Útil para restaurar sesión al arrancar cuando no hay access token en localStorage.
 */
export const refreshSession = () =>
  apiSpringRaw.post<{ accessToken: string }>('/auth/refresh');

// ── Request interceptor: inyecta access token ───────────────────
apiSpring.interceptors.request.use(
  (config) => {
    const token = JwtService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      (config as any)._hadToken = true; // marca para el interceptor de respuesta
    }

    // Enviar deviceId en cada petición para que el backend pueda identificar el dispositivo
    config.headers['X-Device-Id'] = JwtService.getDeviceId();
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Shared refresh promise (evita race condition con múltiples 401 simultáneos) ──
// Si varias peticiones expiran al mismo tiempo, solo se hace UNA llamada a /auth/refresh.
// Todas las demás esperan el resultado de la primera.
let refreshPromise: Promise<string> | null = null;

// ── Response interceptor: maneja 401 con refresh ────────────────
apiSpring.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status   = error.response?.status;

    // Solo intentar refresh en 401, solo una vez (_retry flag),
    // y solo si la petición original llevaba token (era una ruta protegida).
    // Usamos _hadToken (marcado en el interceptor de request) porque Axios no
    // garantiza que Authorization esté disponible en error.config.headers.
    const hadToken = !!(original as any)._hadToken;
    console.log('[INTERCEPTOR] 401 en', original.url, '| hadToken:', hadToken, '| _retry:', original._retry);
    if (status === 401 && !original._retry && hadToken) {
      original._retry = true;

      try {
        // Si ya hay un refresh en curso (otra petición lo inició), reutilizarlo.
        // Esto evita que múltiples 401 simultáneos lancen múltiples /auth/refresh
        // y activen la detección de reuse → revocación de familia → logout.
        if (!refreshPromise) {
          refreshPromise = apiSpringRaw.post('/auth/refresh')
            .then(({ data }) => {
              const newToken: string = data.accessToken;
              JwtService.saveToken(newToken);
              // Avisar a las demás pestañas que hay nuevo token
              authChannel.postMessage({ type: 'TOKEN_REFRESHED', token: newToken });
              // BroadcastChannel NO se envía a la propia pestaña → usar evento DOM
              window.dispatchEvent(new CustomEvent('auth:tokenRefreshed', { detail: { token: newToken } }));
              return newToken;
            })
            .finally(() => {
              refreshPromise = null; // Limpiar para el próximo ciclo de expiración
            });
        }

        const newAccessToken = await refreshPromise;
        console.log('[INTERCEPTOR] Refresh OK — reintentando petición original');
        // Reintentar la petición original con el nuevo token
        original.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiSpring(original);

      } catch {
        // Antes de forzar logout, comprobar si otra pestaña ya renovó el token
        // (race condition multi-tab: dos pestañas con access token expirado al mismo tiempo)
        const latestToken = JwtService.getToken();
        const usedToken = (original.headers?.Authorization as string | undefined)
          ?.replace('Bearer ', '');

        if (latestToken && latestToken !== usedToken) {
          // Otra pestaña fue más rápida → reusar su nuevo token
          original.headers.Authorization = `Bearer ${latestToken}`;
          return apiSpring(original);
        }

        // Refresh realmente fallido → sesión expirada, limpiar y redirigir
        console.log('[INTERCEPTOR] Refresh FALLIDO — disparando auth:sessionExpired');
        JwtService.destroyToken();
        authChannel.postMessage({ type: 'LOGOUT' });
        // Delegar el logout limpio a AuthContext para que limpie el estado React
        console.log('[INTERCEPTOR] <<< disparando auth:sessionExpired >>>');
        window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
      }
    }

    // 403 → autenticado pero sin permisos, dejar que el componente lo gestione
    if (status !== 401) {
      console.error('SpringBoot API Error:', error.response?.data || error.message);
    }

    return Promise.reject(error);
  }
);
