import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface FeriasParaAprovacao {
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
}

export const useFeriasParaAprovacao = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['ferias-para-aprovacao', user?.id],
    queryFn: async (): Promise<FeriasParaAprovacao[]> => {
      if (!user?.id) return [];

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
          prestador_pj_id
        `)
        .eq('responsaveldireto_id', user.id)
        .eq('status', 'solicitado')
        .eq('ativo', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar férias para aprovação:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!user?.id,
    staleTime: 1 * 60 * 1000
  });
};
