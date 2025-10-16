
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useUserCCAs = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-ccas', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      try {
        console.log('Buscando CCAs para usuário:', user.id);
        
        // Buscar CCAs permitidos usando a função RPC (usuario_ccas)
        const { data: ccaIds, error: ccaIdsError } = await supabase.rpc('get_user_allowed_ccas', {
          user_id_param: user.id
        });

        if (ccaIdsError) {
          console.error("Erro ao buscar CCAs permitidos:", ccaIdsError);
          return [];
        }

        console.log('CCAs permitidos (IDs):', ccaIds);
        
        // Se não tem CCAs específicos, retorna vazio (sem acesso)
        if (!ccaIds || ccaIds.length === 0) {
          console.log('Usuário sem CCAs permitidos');
          return [];
        }

        // Buscar os detalhes dos CCAs permitidos
        const { data: ccas, error: ccasError } = await supabase
          .from('ccas')
          .select('*')
          .in('id', ccaIds)
          .eq('ativo', true)
          .order('nome');

        if (ccasError) {
          console.error("Erro ao buscar CCAs:", ccasError);
          return [];
        }

        console.log('CCAs do usuário:', ccas);
        return ccas || [];
      } catch (error) {
        console.error("Erro ao verificar CCAs do usuário:", error);
        return [];
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutos de cache
    gcTime: 10 * 60 * 1000, // 10 minutos antes de garbage collect
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
