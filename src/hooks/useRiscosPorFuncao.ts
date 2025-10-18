import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useRiscosPorFuncao = (ccaId: number | undefined, funcao: string | undefined) => {
  return useQuery({
    queryKey: ['riscos-funcao', ccaId, funcao],
    queryFn: async () => {
      if (!ccaId || !funcao) return null;
      
      const { data, error } = await supabase
        .from('documentacao_riscos_funcao')
        .select('*')
        .eq('cca_id', ccaId)
        .eq('funcao', funcao)
        .eq('ativo', true)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!ccaId && !!funcao,
  });
};
