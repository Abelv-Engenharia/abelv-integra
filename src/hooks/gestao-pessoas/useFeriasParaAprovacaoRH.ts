import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface FeriasParaAprovacaoRH {
  id: string;
  nomeprestador: string;
  empresa: string;
  funcaocargo: string;
  cca_codigo: string;
  cca_nome: string;
  datainicioferias: string;
  diasferias: number;
  responsaveldireto: string;
  responsaveldireto_id: string;
  observacoes: string | null;
  status: string;
  created_at: string;
  prestador_pj_id: string;
  aprovadopor_gestor: string | null;
  dataaprovacao_gestor: string | null;
  observacoes_aprovacao_gestor: string | null;
}

export const useFeriasParaAprovacaoRH = () => {
  return useQuery({
    queryKey: ['ferias-para-aprovacao-rh'],
    queryFn: async (): Promise<FeriasParaAprovacaoRH[]> => {
      const { data, error } = await supabase
        .from('prestadores_ferias')
        .select(`
          id,
          nomeprestador,
          empresa,
          funcaocargo,
          cca_codigo,
          cca_nome,
          datainicioferias,
          diasferias,
          responsaveldireto,
          responsaveldireto_id,
          observacoes,
          status,
          created_at,
          prestador_pj_id,
          aprovadopor_gestor,
          dataaprovacao_gestor,
          observacoes_aprovacao_gestor
        `)
        .eq('status', 'aguardando_aprovacao')
        .eq('ativo', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar férias para aprovação do RH:', error);
        return [];
      }

      return data || [];
    },
    staleTime: 1 * 60 * 1000
  });
};
