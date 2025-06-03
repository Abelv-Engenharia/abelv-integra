
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useOcorrenciasReferenceData = () => {
  // Parte do corpo atingida
  const { data: partesCorpo = [] } = useQuery({
    queryKey: ['partes-corpo'],
    queryFn: async () => {
      const { data } = await supabase
        .from('parte_corpo_atingida')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('nome');
      return data || [];
    },
  });

  // Lateralidade
  const { data: lateralidades = [] } = useQuery({
    queryKey: ['lateralidades'],
    queryFn: async () => {
      const { data } = await supabase
        .from('lateralidade')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('nome');
      return data || [];
    },
  });

  // Agente causador
  const { data: agentesCausadores = [] } = useQuery({
    queryKey: ['agentes-causadores'],
    queryFn: async () => {
      const { data } = await supabase
        .from('agente_causador')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('nome');
      return data || [];
    },
  });

  // Situação geradora
  const { data: situacoesGeradoras = [] } = useQuery({
    queryKey: ['situacoes-geradoras'],
    queryFn: async () => {
      const { data } = await supabase
        .from('situacao_geradora')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('nome');
      return data || [];
    },
  });

  // Natureza da lesão
  const { data: naturezasLesao = [] } = useQuery({
    queryKey: ['naturezas-lesao'],
    queryFn: async () => {
      const { data } = await supabase
        .from('natureza_lesao')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('nome');
      return data || [];
    },
  });

  return {
    partesCorpo,
    lateralidades,
    agentesCausadores,
    situacoesGeradoras,
    naturezasLesao,
  };
};
