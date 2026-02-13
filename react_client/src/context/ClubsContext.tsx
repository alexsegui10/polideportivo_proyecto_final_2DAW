import { createContext, useState, useEffect, ReactNode } from 'react';
import { Club, ClubCreateRequest, ClubUpdateRequest, Stats } from '../types';
import { getClubs, getClubsStats } from '../services/queries/clubsQueries';
import { 
  createClub as createClubService, 
  updateClub as updateClubService, 
  deleteClub as deleteClubService 
} from '../services/mutations/clubsMutations';

interface ClubsContextType {
  clubs: Club[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createClub: (club: ClubCreateRequest) => Promise<Club>;
  updateClub: (slug: string, club: ClubUpdateRequest) => Promise<Club>;
  deleteClub: (slug: string) => Promise<void>;
  getStats: () => Promise<Stats>;
  getClubs: () => Promise<Club[]>;
}

export const ClubsContext = createContext<ClubsContextType | undefined>(undefined);

interface ClubsProviderProps {
  children: ReactNode;
}

export const ClubsProvider = ({ children }: ClubsProviderProps) => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching clubs...');
      const data = await getClubs();
      console.log('Clubs obtenidos:', data);
      setClubs(data);
    } catch (err) {
      console.error('Error al cargar clubs:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar clubs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const createClub = async (club: ClubCreateRequest): Promise<Club> => {
    try {
      const nuevoClub = await createClubService(club);
      setClubs(prev => [...prev, nuevoClub]);
      return nuevoClub;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear club');
      throw err;
    }
  };

  const updateClub = async (slug: string, club: ClubUpdateRequest): Promise<Club> => {
    try {
      const clubActualizado = await updateClubService(slug, club);
      setClubs(prev => prev.map(c => c.slug === slug ? clubActualizado : c));
      return clubActualizado;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar club');
      throw err;
    }
  };

  const deleteClub = async (slug: string): Promise<void> => {
    try {
      await deleteClubService(slug);
      await fetchClubs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar club');
      throw err;
    }
  };

  const handleGetStats = async (): Promise<Stats> => {
    try {
      setError(null);
      return await getClubsStats();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al cargar estadísticas';
      setError(errorMsg);
      throw err;
    }
  };

  const handleGetClubs = async (): Promise<Club[]> => {
    try {
      setError(null);
      return await getClubs();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al cargar clubs';
      setError(errorMsg);
      throw err;
    }
  };

  return (
    <ClubsContext.Provider value={{ 
      clubs, 
      loading, 
      error, 
      refetch: fetchClubs, 
      createClub, 
      updateClub, 
      deleteClub,
      getStats: handleGetStats,
      getClubs: handleGetClubs
    }}>
      {children}
    </ClubsContext.Provider>
  );
};
