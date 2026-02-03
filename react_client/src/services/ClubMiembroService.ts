import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface ClubMiembro {
  id: number;
  uid: string;
  clubId: number;
  clubNombre: string;
  usuarioId: number;
  usuarioNombre: string;
  usuarioEmail: string;
  status: string;
  isActive: boolean;
  tieneSuscripcionActiva: boolean;
  fechaInscripcion: string;
  fechaBaja?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClubSuscripcion {
  id: number;
  uid: string;
  clubMiembroUid: string;
  clubNombre: string;
  usuarioNombre: string;
  usuarioEmail: string;
  fechaInicio: string;
  fechaFin?: string;
  precioMensual: number;
  status: string;
  isActive: boolean;
  proximoCobro: string;
  intentosCobro: number;
  createdAt: string;
  updatedAt: string;
}

export interface MiembroCreateRequest {
  clubId: number;
  usuarioId: number;
}

export interface SuscripcionCreateRequest {
  miembroUid: string;
  precioMensual?: number;
}

class ClubMiembroService {
  async inscribirMiembro(data: MiembroCreateRequest): Promise<ClubMiembro> {
    const response = await axios.post(`${API_URL}/club-miembros`, data);
    return response.data;
  }

  async getMiembrosByClubId(clubId: number): Promise<ClubMiembro[]> {
    const response = await axios.get(`${API_URL}/club-miembros/club/${clubId}`);
    return response.data;
  }

  async darDeBajaMiembro(uid: string): Promise<void> {
    await axios.patch(`${API_URL}/club-miembros/${uid}/baja`);
  }

  async expulsarMiembro(uid: string): Promise<void> {
    await axios.patch(`${API_URL}/club-miembros/${uid}/expulsar`);
  }

  async reactivarMiembro(uid: string): Promise<ClubMiembro> {
    const response = await axios.patch(`${API_URL}/club-miembros/${uid}/reactivar`);
    return response.data;
  }

  // Suscripciones
  async crearSuscripcion(data: SuscripcionCreateRequest): Promise<ClubSuscripcion> {
    const response = await axios.post(`${API_URL}/club-suscripciones`, data);
    return response.data;
  }

  async getSuscripcionesByClubId(clubId: number): Promise<ClubSuscripcion[]> {
    const response = await axios.get(`${API_URL}/club-suscripciones/club/${clubId}`);
    return response.data;
  }

  async getSuscripcionesByMiembroUid(miembroUid: string): Promise<ClubSuscripcion[]> {
    const response = await axios.get(`${API_URL}/club-suscripciones/miembro/${miembroUid}`);
    return response.data;
  }

  async cancelarSuscripcion(uid: string): Promise<void> {
    await axios.patch(`${API_URL}/club-suscripciones/${uid}/cancelar`);
  }

  async pausarSuscripcion(uid: string): Promise<void> {
    await axios.patch(`${API_URL}/club-suscripciones/${uid}/pausar`);
  }

  async reanudarSuscripcion(uid: string): Promise<void> {
    await axios.patch(`${API_URL}/club-suscripciones/${uid}/reanudar`);
  }
}

export default new ClubMiembroService();
