import React from 'react';
import { DesviosFiltersContext, DesviosFiltersContextType } from '@/hooks/useDesviosFilters';

interface DesviosFiltersProviderProps extends DesviosFiltersContextType {
  children: React.ReactNode;
}

export const DesviosFiltersProvider: React.FC<DesviosFiltersProviderProps> = ({ 
  children, 
  year, 
  month, 
  ccaId, 
  disciplinaId, 
  empresaId, 
  userCCAs, 
  filtersApplied 
}) => {
  return (
    <DesviosFiltersContext.Provider value={{
      year,
      month,
      ccaId,
      disciplinaId,
      empresaId,
      userCCAs,
      filtersApplied
    }}>
      {children}
    </DesviosFiltersContext.Provider>
  );
};