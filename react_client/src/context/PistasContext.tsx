import { createContext, useState, useEffect, ReactNode } from 'react';
import { Pista, PistaRequest } from '../types';
import { getPistas } from '../services/queries/pistasQueries';
import { createPista as createPistaService, updatePista as updatePistaService, deletePista as deletePistaService } from '../services/mutations/pistasMutations';

interface PistasContextType {
  pistas: Pista[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createPista: (pista: PistaRequest) => Promise<Pista>;
  updatePista: (slug: string, pista: PistaRequest) => Promise<Pista>;
  deletePista: (slug: string) => Promise<void>;
}

export const PistasContext = createContext<PistasContextType | undefined>(undefined);

interface PistasProviderProps {
  children: ReactNode;
}

export const PistasProvider = ({ children }: PistasProviderProps) => {
  const [pistas, setPistas] = useState<Pista[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPistas = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching pistas...');
      const data = await getPistas();
      console.log('Pistas obtenidas:', data);
      setPistas(data);
    } catch (err) {
      console.error('Error al cargar pistas:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar pistas');
      console.error('Error fetching pistas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPistas();
  }, []);

  const handleCreatePista = async (pista: PistaRequest): Promise<Pista> => {
    try {
      setLoading(true);
      setError(null);
      const nuevaPista = await createPistaService(pista);
      await fetchPistas();
      return nuevaPista;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al crear pista';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePista = async (slug: string, pista: PistaRequest): Promise<Pista> => {
    try {
      setLoading(true);
      setError(null);
      const pistaActualizada = await updatePistaService(slug, pista);
      await fetchPistas();
      return pistaActualizada;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al actualizar pista';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePista = async (slug: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await deletePistaService(slug);
      await fetchPistas();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al eliminar pista';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <PistasContext.Provider value={{ 
      pistas, 
      loading, 
      error, 
      refetch: fetchPistas,
      createPista: handleCreatePista,
      updatePista: handleUpdatePista,
      deletePista: handleDeletePista
    }}>
      {children}
    </PistasContext.Provider>
  );
};