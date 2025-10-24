import { useState, useEffect } from 'react';
import { RNC } from '@/types/sgq';

// Mock data
const mockRNCs: RNC[] = [];

export const useRNCData = () => {
  const [rncs, setRncs] = useState<RNC[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setRncs(mockRNCs);
      setLoading(false);
    }, 500);
  }, []);

  const createRNC = async (rncData: Omit<RNC, 'id' | 'created_at' | 'updated_at'>): Promise<RNC> => {
    const newRNC: RNC = {
      ...rncData,
      id: `rnc-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setRncs(prev => [...prev, newRNC]);
    return newRNC;
  };

  const updateRNC = async (id: string, updates: Partial<RNC>): Promise<void> => {
    setRncs(prev => prev.map(rnc => 
      rnc.id === id ? { ...rnc, ...updates, updated_at: new Date().toISOString() } : rnc
    ));
  };

  const getRNC = (id: string): RNC | undefined => {
    return rncs.find(rnc => rnc.id === id);
  };

  return {
    rncs,
    loading,
    createRNC,
    updateRNC,
    getRNC
  };
};
