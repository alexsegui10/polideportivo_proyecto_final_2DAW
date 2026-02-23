/**
 * Servicio para gestión de JWT y datos de sesión en localStorage.
 */

const TOKEN_KEY     = 'auth_token';
const DEVICE_ID_KEY = 'device_id';

export const JwtService = {
  // ── Access Token ────────────────────────────────────────────────
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },
  destroyToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },
  hasToken(): boolean {
    return !!this.getToken();
  },

  // ── Device ID ───────────────────────────────────────────────────
  /**
   * Genera o recupera un identificador único por navegador/dispositivo.
   * Se usa como X-Device-Id en login para permitir logout por dispositivo.
   */
  getDeviceId(): string {
    let deviceId = localStorage.getItem(DEVICE_ID_KEY);
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    return deviceId;
  },
};
