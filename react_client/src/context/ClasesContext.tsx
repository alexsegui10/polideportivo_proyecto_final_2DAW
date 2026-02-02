import { createContext, useState, useEffect, ReactNode } from 'react';
import { ClasePublica, ClaseCreateRequest, ClaseUpdateRequest } from '../types';
import { getClases } from '../services/queries/clasesQueries';
import { 
  createClase as createClaseService, 
  updateClase as updateClaseService, 
  deleteClase as deleteClaseService 
} from '../services/mutations/clasesMutations';

interface ClasesContextType {
  clases: ClasePublica[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createClase: (clase: ClaseCreateRequest) => Promise<ClasePublica>;
  updateClase: (slug: string, clase: ClaseUpdateRequest) => Promise<ClasePublica>;
  deleteClase: (slug: string) => Promise<void>;
}

export const ClasesContext = createContext<ClasesContextType | undefined>(undefined);

interface ClasesProviderProps {
  children: ReactNode;
}

export const ClasesProvider = ({ children }: ClasesProviderProps) => {
  const [clases, setClases] = useState<ClasePublica[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClases = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching clases...');
      const data = await getClases();
      console.log('Clases obtenidas:', data);
      setClases(data);
    } catch (err) {
      console.error('Error al cargar clases:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar clases');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClases();
  }, []);

  const createClase = async (clase: ClaseCreateRequest): Promise<ClasePublica> => {
    try {
      const nuevaClase = await createClaseService(clase);
      setClases(prev => [...prev, nuevaClase]);
      return nuevaClase;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear clase');
      throw err;
    }
  };

  const updateClase = async (slug: string, clase: ClaseUpdateRequest): Promise<ClasePublica> => {
    try {
      const claseActualizada = await updateClaseService(slug, clase);
      setClases(prev => prev.map(c => c.slug === slug ? claseActualizada : c));
      return claseActualizada;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar clase');
      throw err;
    }
  };

  const deleteClase = async (slug: string): Promise<void> => {
    try {
      await deleteClaseService(slug);
      await fetchClases();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar clase');
      throw err;
    }
  };

  return (
    <ClasesContext.Provider value={{ clases, loading, error, refetch: fetchClases, createClase, updateClase, deleteClase }}>
      {children}
    </ClasesContext.Provider>
  );
};
