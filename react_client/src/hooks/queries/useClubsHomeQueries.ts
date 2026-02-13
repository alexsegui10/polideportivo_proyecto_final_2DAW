import { useContext } from 'react';
import { ClubsContext } from '../../context/ClubsContext';

export const useClubsHomeQueries = () => {
  const context = useContext(ClubsContext);
  
  if (!context) {
    throw new Error('useClubsHomeQueries debe usarse dentro de ClubsProvider');
  }

  return {
    getStats: context.getStats,
    getClubs: context.getClubs,
    loading: context.loading,
    error: context.error,
  };
};
