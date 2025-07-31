import { createContext, useContext } from 'react';

export interface DesviosFiltersContextType {
  year: string;
  month: string;
  ccaId: string;
  disciplinaId: string;
  empresaId: string;
  userCCAs: any[];
  filtersApplied: boolean;
}

export const DesviosFiltersContext = createContext<DesviosFiltersContextType | null>(null);

export const useDesviosFilters = () => {
  const context = useContext(DesviosFiltersContext);
  if (!context) {
    return {
      year: "",
      month: "",
      ccaId: "",
      disciplinaId: "",
      empresaId: "",
      userCCAs: [],
      filtersApplied: false
    };
  }
  return context;
};