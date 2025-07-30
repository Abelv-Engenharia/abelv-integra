import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OcorrenciasFilterContextType {
  year: string;
  month: string;
  ccaId: string;
  setYear: (year: string) => void;
  setMonth: (month: string) => void;
  setCcaId: (ccaId: string) => void;
  clearFilters: () => void;
}

const OcorrenciasFilterContext = createContext<OcorrenciasFilterContextType | undefined>(undefined);

interface OcorrenciasFilterProviderProps {
  children: ReactNode;
}

export const OcorrenciasFilterProvider: React.FC<OcorrenciasFilterProviderProps> = ({ children }) => {
  const [year, setYear] = useState('todos');
  const [month, setMonth] = useState('todos');
  const [ccaId, setCcaId] = useState('todos');

  const clearFilters = () => {
    setYear('todos');
    setMonth('todos');
    setCcaId('todos');
  };

  return (
    <OcorrenciasFilterContext.Provider value={{
      year,
      month,
      ccaId,
      setYear,
      setMonth,
      setCcaId,
      clearFilters
    }}>
      {children}
    </OcorrenciasFilterContext.Provider>
  );
};

export const useOcorrenciasFilter = () => {
  const context = useContext(OcorrenciasFilterContext);
  if (context === undefined) {
    throw new Error('useOcorrenciasFilter must be used within a OcorrenciasFilterProvider');
  }
  return context;
};