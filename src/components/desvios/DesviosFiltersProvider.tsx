
import React, { useState } from 'react';
import { DesviosFiltersContext, DesviosFiltersContextType } from '@/hooks/useDesviosFilters';

interface DesviosFiltersProviderProps extends Omit<DesviosFiltersContextType, 'refreshCharts'> {
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
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshCharts = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <DesviosFiltersContext.Provider value={{
      year,
      month,
      ccaId,
      disciplinaId,
      empresaId,
      userCCAs,
      filtersApplied,
      refreshCharts
    }}>
      <div key={refreshKey}>
        {children}
      </div>
    </DesviosFiltersContext.Provider>
  );
};
