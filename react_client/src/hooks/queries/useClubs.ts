import { useContext } from 'react';
import { ClubsContext } from '../../context/ClubsContext';

export const useClubs = () => {
  const context = useContext(ClubsContext);
  if (!context) {
    throw new Error('useClubs debe usarse dentro de ClubsProvider');
  }
  
  return {
    clubs: context.clubs,
    loading: context.loading,
    error: context.error,
    refetch: context.refetch
  };
};
