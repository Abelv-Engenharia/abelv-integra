import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserCCAs } from "./useUserCCAs";

export const useOcorrenciasEmpresas = () => {
  const { data: userCCAs = [] } = useUserCCAs();

  return useQuery({
    queryKey: ['ocorrencias-empresas', userCCAs],
    queryFn: async () => {
      // Primeiro buscar ocorrências para obter IDs únicos de empresas
      const { data: ocorrencias } = await supabase
        .from('ocorrencias')
        .select('empresa')
        .not('empresa', 'is', null);

      if (!ocorrencias || ocorrencias.length === 0) {
        return [];
      }

      // Obter IDs únicos de empresas
      const empresaIds = [...new Set(ocorrencias
        .map(o => o.empresa)
        .filter(id => id && !isNaN(Number(id)))
        .map(id => Number(id))
      )];

      if (empresaIds.length === 0) {
        return [];
      }

      // Buscar nomes das empresas
      const { data: empresas } = await supabase
        .from('empresas')
        .select('id, nome')
        .in('id', empresaIds)
        .order('nome');

      return empresas?.map(empresa => ({
        id: empresa.id.toString(),
        nome: empresa.nome
      })) || [];
    },
    enabled: userCCAs.length >= 0,
  });
};