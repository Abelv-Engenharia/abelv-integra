
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useOcorrenciasBasicData = () => {
  // CCAs
  const { data: ccas = [] } = useQuery({
    queryKey: ['ccas-ocorrencias'],
    queryFn: async () => {
      const { data } = await supabase
        .from('ccas')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('codigo');
      return data || [];
    },
  });

  // Disciplinas
  const { data: disciplinas = [] } = useQuery({
    queryKey: ['disciplinas-ocorrencias'],
    queryFn: async () => {
      const { data } = await supabase
        .from('disciplinas')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('nome');
      return data || [];
    },
  });

  // Tipos de ocorrência
  const { data: tiposOcorrencia = [] } = useQuery({
    queryKey: ['tipos-ocorrencia'],
    queryFn: async () => {
      const { data } = await supabase
        .from('tipos_ocorrencia')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('nome');
      return data || [];
    },
  });

  // Tipos de evento
  const { data: tiposEvento = [] } = useQuery({
    queryKey: ['tipos-evento'],
    queryFn: async () => {
      const { data } = await supabase
        .from('tipos_evento')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('nome');
      return data || [];
    },
  });

  // Classificações de ocorrência
  const { data: classificacoesOcorrencia = [] } = useQuery({
    queryKey: ['classificacoes-ocorrencia'],
    queryFn: async () => {
      const { data } = await supabase
        .from('classificacoes_ocorrencia')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('nome');
      return data || [];
    },
  });

  return {
    ccas,
    disciplinas,
    tiposOcorrencia,
    tiposEvento,
    classificacoesOcorrencia,
  };
};
