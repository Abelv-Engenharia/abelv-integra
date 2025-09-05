import { createContext, useContext } from 'react';
import { normalizeFilters } from '@/utils/dateFilters';

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
      filtersApplied: false,
      normalizedFilters: {
        ccaIds: []
      }
    };
  }
  
  // Normalize filters for consistent date handling
  const allowedCcaIds = context.userCCAs.map(cca => cca.id.toString());
  const normalizedFilters = normalizeFilters({
    year: context.year,
    month: context.month,
    ccaId: context.ccaId,
    disciplinaId: context.disciplinaId,
    empresaId: context.empresaId,
    userCcaIds: allowedCcaIds
  });
  
  console.log('useDesviosFilters - Raw filters:', {
    year: context.year,
    month: context.month,
    ccaId: context.ccaId,
    allowedCcaIds
  });
  console.log('useDesviosFilters - Normalized filters:', normalizedFilters);
  
  return {
    ...context,
    normalizedFilters
  };
};