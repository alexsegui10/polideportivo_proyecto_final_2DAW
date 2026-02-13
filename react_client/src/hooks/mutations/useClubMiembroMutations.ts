import { useContext } from 'react';
import { ClubMiembroContext } from '../../context/ClubMiembroContext';

export const useClubMiembroMutations = () => {
  const context = useContext(ClubMiembroContext);
  if (!context) {
    throw new Error('useClubMiembroMutations debe usarse dentro de ClubMiembroProvider');
  }
  return context;
};
