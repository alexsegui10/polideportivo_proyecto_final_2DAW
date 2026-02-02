import { useContext } from 'react';
import { ClubsContext } from '../../context/ClubsContext';

export const useClubsMutations = () => {
  const context = useContext(ClubsContext);
  if (!context) {
    throw new Error('useClubsMutations debe usarse dentro de ClubsProvider');
  }
  
  return {
    createClub: context.createClub,
    updateClub: context.updateClub,
    deleteClub: context.deleteClub
  };
};
