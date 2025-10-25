import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface FeriasHistorico {
  id: string;
  nomeprestador: string;
  empresa: string;
  funcaocargo: string;
  cca_codigo: string;
  cca_nome: string;
  datainicioferias: string;
  diasferias: number;
  responsaveldireto: string;
  observacoes: string | null;
  status: string;
  created_at: string;
  justificativareprovacao?: string | null;
  aprovadopor_gestor?: string | null;
  dataaprovacao_gestor?: string | null;
}

export const useFeriasUsuario = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['ferias-usuario', user?.id],
    queryFn: async (): Promise<FeriasHistorico[]> => {
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
          observacoes,
          status,
          created_at,
          justificativareprovacao,
          aprovadopor_gestor,
          dataaprovacao_gestor
        `)
        .eq('created_by', user.id)
        .eq('ativo', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar férias do usuário:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!user?.id,
    staleTime: 1 * 60 * 1000
  });
};
