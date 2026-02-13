import { createContext, ReactNode } from 'react';
import { ClaseInscripcion, ClaseWaitlist } from '../types';
import { getInscritosByClaseId, getWaitlistByClaseId, getClasesByUsuarioId } from '../services/queries/claseInscripcionQueries';
import { 
  inscribirUsuario as inscribirUsuarioService, 
  cancelarInscripcion as cancelarInscripcionService, 
  eliminarInscripcion as eliminarInscripcionService, 
  marcarAsistencia as marcarAsistenciaService, 
  agregarAWaitlist as agregarAWaitlistService, 
  quitarDeWaitlist as quitarDeWaitlistService 
} from '../services/mutations/claseInscripcionMutations';

interface ClaseInscripcionContextType {
  getInscritosByClaseId: (claseId: number) => Promise<ClaseInscripcion[]>;
  getWaitlistByClaseId: (claseId: number) => Promise<ClaseWaitlist[]>;
  getClasesByUsuarioId: (usuarioId: number) => Promise<ClaseInscripcion[]>;
  inscribirUsuario: (data: { claseId: number; usuarioId: number; metodoPago: string }) => Promise<ClaseInscripcion>;
  cancelarInscripcion: (uid: string) => Promise<void>;
  eliminarInscripcion: (uid: string) => Promise<void>;
  marcarAsistencia: (uid: string, asistio: boolean) => Promise<void>;
  agregarAWaitlist: (data: { claseId: number; usuarioId: number }) => Promise<ClaseWaitlist>;
  quitarDeWaitlist: (uid: string) => Promise<void>;
}

export const ClaseInscripcionContext = createContext<ClaseInscripcionContextType | undefined>(undefined);

interface ClaseInscripcionProviderProps {
  children: ReactNode;
}

export const ClaseInscripcionProvider = ({ children }: ClaseInscripcionProviderProps) => {
  const handleGetInscritosByClaseId = async (claseId: number): Promise<ClaseInscripcion[]> => {
    try {
      return await getInscritosByClaseId(claseId);
    } catch (err) {
      throw err;
    }
  };

  const handleGetWaitlistByClaseId = async (claseId: number): Promise<ClaseWaitlist[]> => {
    try {
      return await getWaitlistByClaseId(claseId);
    } catch (err) {
      throw err;
    }
  };

  const handleGetClasesByUsuarioId = async (usuarioId: number): Promise<ClaseInscripcion[]> => {
    try {
      return await getClasesByUsuarioId(usuarioId);
    } catch (err) {
      throw err;
    }
  };

  const handleInscribirUsuario = async (data: { claseId: number; usuarioId: number; metodoPago: string }): Promise<ClaseInscripcion> => {
    try {
      return await inscribirUsuarioService(data);
    } catch (err) {
      throw err;
    }
  };

  const handleCancelarInscripcion = async (uid: string): Promise<void> => {
    try {
      await cancelarInscripcionService(uid);
    } catch (err) {
      throw err;
    }
  };

  const handleEliminarInscripcion = async (uid: string): Promise<void> => {
    try {
      await eliminarInscripcionService(uid);
    } catch (err) {
      throw err;
    }
  };

  const handleMarcarAsistencia = async (uid: string, asistio: boolean): Promise<void> => {
    try {
      await marcarAsistenciaService(uid, asistio);
    } catch (err) {
      throw err;
    }
  };

  const handleAgregarAWaitlist = async (data: { claseId: number; usuarioId: number }): Promise<ClaseWaitlist> => {
    try {
      return await agregarAWaitlistService(data);
    } catch (err) {
      throw err;
    }
  };

  const handleQuitarDeWaitlist = async (uid: string): Promise<void> => {
    try {
      await quitarDeWaitlistService(uid);
    } catch (err) {
      throw err;
    }
  };

  const value: ClaseInscripcionContextType = {
    getInscritosByClaseId: handleGetInscritosByClaseId,
    getWaitlistByClaseId: handleGetWaitlistByClaseId,
    getClasesByUsuarioId: handleGetClasesByUsuarioId,
    inscribirUsuario: handleInscribirUsuario,
    cancelarInscripcion: handleCancelarInscripcion,
    eliminarInscripcion: handleEliminarInscripcion,
    marcarAsistencia: handleMarcarAsistencia,
    agregarAWaitlist: handleAgregarAWaitlist,
    quitarDeWaitlist: handleQuitarDeWaitlist
  };

  return (
    <ClaseInscripcionContext.Provider value={value}>
      {children}
    </ClaseInscripcionContext.Provider>
  );
};
