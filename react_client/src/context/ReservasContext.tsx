import { createContext, useState, useEffect, ReactNode } from 'react';
import { Reserva, ReservaCreateRequest, ReservaUpdateRequest } from '../types';
import { getReservas } from '../services/queries/reservasQueries';
import { 
  createReserva as createReservaService, 
  updateReserva as updateReservaService, 
  deleteReserva as deleteReservaService 
} from '../services/mutations/reservasMutations';

interface ReservasContextType {
  reservas: Reserva[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createReserva: (reserva: ReservaCreateRequest) => Promise<Reserva>;
  updateReserva: (slug: string, reserva: ReservaUpdateRequest) => Promise<Reserva>;
  deleteReserva: (slug: string) => Promise<void>;
}

export const ReservasContext = createContext<ReservasContextType | undefined>(undefined);

interface ReservasProviderProps {
  children: ReactNode;
}

export const ReservasProvider = ({ children }: ReservasProviderProps) => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservas = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching reservas...');
      const data = await getReservas();
      console.log('Reservas obtenidas:', data);
      setReservas(data);
    } catch (err) {
      console.error('Error al cargar reservas:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar reservas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  const createReserva = async (reserva: ReservaCreateRequest): Promise<Reserva> => {
    try {
      const nuevaReserva = await createReservaService(reserva);
      setReservas(prev => [...prev, nuevaReserva]);
      return nuevaReserva;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear reserva');
      throw err;
    }
  };

  const updateReserva = async (slug: string, reserva: ReservaUpdateRequest): Promise<Reserva> => {
    try {
      const reservaActualizada = await updateReservaService(slug, reserva);
      setReservas(prev => prev.map(r => r.slug === slug ? reservaActualizada : r));
      return reservaActualizada;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar reserva');
      throw err;
    }
  };

  const deleteReserva = async (slug: string): Promise<void> => {
    try {
      await deleteReservaService(slug);
      await fetchReservas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar reserva');
      throw err;
    }
  };

  return (
    <ReservasContext.Provider value={{ reservas, loading, error, refetch: fetchReservas, createReserva, updateReserva, deleteReserva }}>
      {children}
    </ReservasContext.Provider>
  );
};
