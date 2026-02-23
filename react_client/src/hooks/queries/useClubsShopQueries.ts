import { useContext } from 'react';
import { ClubsContext } from '../../context/ClubsContext';

export const useClubsShopQueries = () => {
  const context = useContext(ClubsContext);

  if (!context) {
    throw new Error('useClubsShopQueries debe usarse dentro de ClubsProvider');
  }

  return {
    searchClubs: context.searchClubs,
    error: context.error,
  };
};
