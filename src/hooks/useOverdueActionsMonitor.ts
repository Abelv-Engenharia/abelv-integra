import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useOverdueActionsMonitor = () => {
  useEffect(() => {
    const checkOverdueActions = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('update-overdue-actions');
        
        if (error) {
          console.error('Erro ao verificar ações em atraso:', error);
        } else if (data) {
          console.log('Verificação de ações em atraso concluída:', data);
        }
      } catch (error) {
        console.error('Erro ao executar verificação de ações em atraso:', error);
      }
    };

    // Executar imediatamente ao carregar
    checkOverdueActions();

    // Configurar para executar a cada 1 hora (3600000 ms)
    const interval = setInterval(checkOverdueActions, 3600000);

    // Cleanup ao desmontar componente
    return () => clearInterval(interval);
  }, []);
};

export default useOverdueActionsMonitor;