import { useState, useEffect } from 'react';
import { relatoriosService } from '@/services/relatoriosService';
import { RelatorioConfig } from '@/hooks/useRelatoriosManager';

export const useRelatoriosDisponiveis = () => {
  const [relatorios, setRelatorios] = useState<RelatorioConfig[]>([]);

  useEffect(() => {
    // Subscreve para mudanças no serviço de relatórios
    const unsubscribe = relatoriosService.subscribe(setRelatorios);
    
    // Cleanup da subscrição
    return unsubscribe;
  }, []);

  return { relatorios };
};