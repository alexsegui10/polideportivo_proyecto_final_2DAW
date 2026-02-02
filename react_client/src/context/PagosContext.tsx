import { createContext, useState, useEffect, ReactNode } from 'react';
import { Pago } from '../types';
import { getPagos } from '../services/queries/pagosQueries';

interface PagosContextType {
  pagos: Pago[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const PagosContext = createContext<PagosContextType | undefined>(undefined);

interface PagosProviderProps {
  children: ReactNode;
}

export const PagosProvider = ({ children }: PagosProviderProps) => {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPagos = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching pagos...');
      const data = await getPagos();
      console.log('Pagos obtenidos:', data);
      setPagos(data);
    } catch (err) {
      console.error('Error al cargar pagos:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar pagos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPagos();
  }, []);

  return (
    <PagosContext.Provider value={{ pagos, loading, error, refetch: fetchPagos }}>
      {children}
    </PagosContext.Provider>
  );
};
