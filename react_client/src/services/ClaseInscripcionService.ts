import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface ClaseInscripcion {
  id: number;
  uid: string;
  claseId: number;
  claseNombre: string;
  claseFechaHoraInicio: string;
  usuarioId: number;
  usuarioNombre: string;
  usuarioEmail: string;
  status: string;
  isActive: boolean;
  precioPagado: number;
  metodoPago: string;
  fechaInscripcion: string;
  cancelledAt?: string;
  cancelReason?: string;
  refundStatus?: string;
  refundAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClaseWaitlist {
  id: number;
  uid: string;
  claseId: number;
  claseNombre: string;
  claseFechaHoraInicio: string;
  usuarioId: number;
  usuarioNombre: string;
  usuarioEmail: string;
  posicion: number;
  status: string;
  isActive: boolean;
  fechaRegistro: string;
  fechaNotificacion?: string;
  fechaExpiracion?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InscripcionCreateRequest {
  claseId: number;
  usuarioId: number;
  precioPagado?: number;
  metodoPago?: string;
}

export interface WaitlistCreateRequest {
  claseId: number;
  usuarioId: number;
}

class ClaseInscripcionService {
  async inscribirUsuario(data: InscripcionCreateRequest): Promise<ClaseInscripcion> {
    const response = await axios.post(`${API_URL}/clase-inscripciones`, data);
    return response.data;
  }

  async getInscritosByClaseId(claseId: number): Promise<ClaseInscripcion[]> {
    const response = await axios.get(`${API_URL}/clase-inscripciones/clase/${claseId}`);
    return response.data;
  }

  async getClasesByUsuarioId(usuarioId: number): Promise<ClaseInscripcion[]> {
    const response = await axios.get(`${API_URL}/clase-inscripciones/usuario/${usuarioId}`);
    return response.data;
  }

  async cancelarInscripcion(uid: string, cancelReason?: string): Promise<void> {
    const params = cancelReason ? { cancelReason } : {};
    await axios.patch(`${API_URL}/clase-inscripciones/${uid}/cancelar`, null, { params });
  }

  async eliminarInscripcion(uid: string): Promise<void> {
    await axios.delete(`${API_URL}/clase-inscripciones/${uid}`);
  }

  async marcarAsistencia(uid: string, asistio: boolean): Promise<void> {
    await axios.patch(`${API_URL}/clase-inscripciones/${uid}/asistencia`, null, {
      params: { asistio }
    });
  }

  async agregarAWaitlist(data: WaitlistCreateRequest): Promise<ClaseWaitlist> {
    const response = await axios.post(`${API_URL}/clase-waitlist`, data);
    return response.data;
  }

  async getWaitlistByClaseId(claseId: number): Promise<ClaseWaitlist[]> {
    const response = await axios.get(`${API_URL}/clase-waitlist/clase/${claseId}`);
    return response.data;
  }

  async quitarDeWaitlist(uid: string): Promise<void> {
    await axios.delete(`${API_URL}/clase-waitlist/${uid}`);
  }

  async promoverPrimeroEnCola(claseId: number): Promise<void> {
    await axios.post(`${API_URL}/clase-waitlist/clase/${claseId}/promover`);
  }
}

export default new ClaseInscripcionService();
