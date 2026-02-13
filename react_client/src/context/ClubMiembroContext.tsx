import { createContext, ReactNode } from 'react';
import { ClubMiembro, ClubSuscripcion } from '../types';
import { getMiembrosByClubId, getSuscripcionesByClubId, getSuscripcionesByMiembroUid } from '../services/queries/clubMiembroQueries';
import { 
  inscribirMiembro as inscribirMiembroService, 
  darDeBajaMiembro as darDeBajaMiembroService, 
  expulsarMiembro as expulsarMiembroService, 
  reactivarMiembro as reactivarMiembroService, 
  crearSuscripcion as crearSuscripcionService, 
  cancelarSuscripcion as cancelarSuscripcionService, 
  pausarSuscripcion as pausarSuscripcionService, 
  reanudarSuscripcion as reanudarSuscripcionService 
} from '../services/mutations/clubMiembroMutations';

interface ClubMiembroContextType {
  getMiembrosByClubId: (clubId: number) => Promise<ClubMiembro[]>;
  getSuscripcionesByClubId: (clubId: number) => Promise<ClubSuscripcion[]>;
  getSuscripcionesByMiembroUid: (miembroUid: string) => Promise<ClubSuscripcion[]>;
  inscribirMiembro: (data: { clubId: number; usuarioId: number }) => Promise<ClubMiembro>;
  darDeBajaMiembro: (uid: string) => Promise<void>;
  expulsarMiembro: (uid: string) => Promise<void>;
  reactivarMiembro: (uid: string) => Promise<ClubMiembro>;
  crearSuscripcion: (data: { miembroUid: string; precioMensual: number }) => Promise<ClubSuscripcion>;
  cancelarSuscripcion: (uid: string) => Promise<void>;
  pausarSuscripcion: (uid: string) => Promise<void>;
  reanudarSuscripcion: (uid: string) => Promise<void>;
}

export const ClubMiembroContext = createContext<ClubMiembroContextType | undefined>(undefined);

interface ClubMiembroProviderProps {
  children: ReactNode;
}

export const ClubMiembroProvider = ({ children }: ClubMiembroProviderProps) => {
  const handleGetMiembrosByClubId = async (clubId: number): Promise<ClubMiembro[]> => {
    try {
      return await getMiembrosByClubId(clubId);
    } catch (err) {
      throw err;
    }
  };

  const handleGetSuscripcionesByClubId = async (clubId: number): Promise<ClubSuscripcion[]> => {
    try {
      return await getSuscripcionesByClubId(clubId);
    } catch (err) {
      throw err;
    }
  };

  const handleGetSuscripcionesByMiembroUid = async (miembroUid: string): Promise<ClubSuscripcion[]> => {
    try {
      return await getSuscripcionesByMiembroUid(miembroUid);
    } catch (err) {
      throw err;
    }
  };

  const handleInscribirMiembro = async (data: { clubId: number; usuarioId: number }): Promise<ClubMiembro> => {
    try {
      return await inscribirMiembroService(data);
    } catch (err) {
      throw err;
    }
  };

  const handleDarDeBajaMiembro = async (uid: string): Promise<void> => {
    try {
      await darDeBajaMiembroService(uid);
    } catch (err) {
      throw err;
    }
  };

  const handleExpulsarMiembro = async (uid: string): Promise<void> => {
    try {
      await expulsarMiembroService(uid);
    } catch (err) {
      throw err;
    }
  };

  const handleReactivarMiembro = async (uid: string): Promise<ClubMiembro> => {
    try {
      return await reactivarMiembroService(uid);
    } catch (err) {
      throw err;
    }
  };

  const handleCrearSuscripcion = async (data: { miembroUid: string; precioMensual: number }): Promise<ClubSuscripcion> => {
    try {
      return await crearSuscripcionService(data);
    } catch (err) {
      throw err;
    }
  };

  const handleCancelarSuscripcion = async (uid: string): Promise<void> => {
    try {
      await cancelarSuscripcionService(uid);
    } catch (err) {
      throw err;
    }
  };

  const handlePausarSuscripcion = async (uid: string): Promise<void> => {
    try {
      await pausarSuscripcionService(uid);
    } catch (err) {
      throw err;
    }
  };

  const handleReanudarSuscripcion = async (uid: string): Promise<void> => {
    try {
      await reanudarSuscripcionService(uid);
    } catch (err) {
      throw err;
    }
  };

  const value: ClubMiembroContextType = {
    getMiembrosByClubId: handleGetMiembrosByClubId,
    getSuscripcionesByClubId: handleGetSuscripcionesByClubId,
    getSuscripcionesByMiembroUid: handleGetSuscripcionesByMiembroUid,
    inscribirMiembro: handleInscribirMiembro,
    darDeBajaMiembro: handleDarDeBajaMiembro,
    expulsarMiembro: handleExpulsarMiembro,
    reactivarMiembro: handleReactivarMiembro,
    crearSuscripcion: handleCrearSuscripcion,
    cancelarSuscripcion: handleCancelarSuscripcion,
    pausarSuscripcion: handlePausarSuscripcion,
    reanudarSuscripcion: handleReanudarSuscripcion
  };

  return (
    <ClubMiembroContext.Provider value={value}>
      {children}
    </ClubMiembroContext.Provider>
  );
};
