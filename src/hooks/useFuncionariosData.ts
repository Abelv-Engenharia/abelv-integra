
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserCCAs } from "./useUserCCAs";

export interface SimpleFuncionario {
  id: string;
  nome: string;
  funcao: string;
  matricula: string;
  ativo: boolean;
  foto?: string;
  data_admissao?: string | null;
}

export const useFuncionariosData = () => {
  const { data: userCCAs = [] } = useUserCCAs();

  return useQuery({
    queryKey: ['funcionarios-data', userCCAs.map(c => c.id)],
    queryFn: async (): Promise<SimpleFuncionario[]> => {
      if (!userCCAs || userCCAs.length === 0) return [];
      
      const ccaIds = userCCAs.map(cca => cca.id);
      
      // Buscar funcionários básicos
      const { data: funcionariosData, error: funcionariosError } = await supabase
        .from('funcionarios')
        .select('id, nome, funcao, matricula, ativo, foto, data_admissao')
        .eq('ativo', true)
        .order('nome');
      
      if (funcionariosError || !funcionariosData) {
        console.error("Erro ao buscar funcionários:", funcionariosError);
        return [];
      }
      
      // Buscar relacionamentos
      const { data: relacionamentos, error: relError } = await supabase
        .from('funcionario_ccas')
        .select('funcionario_id, cca_id')
        .in('cca_id', ccaIds);
      
      if (relError) {
        console.error("Erro ao buscar relacionamentos:", relError);
        return funcionariosData;
      }
      
      // Filtrar funcionários que têm relacionamento com CCAs do usuário
      const funcionariosPermitidos = funcionariosData.filter(funcionario => 
        relacionamentos?.some(rel => rel.funcionario_id === funcionario.id)
      );
      
      return funcionariosPermitidos;
    },
    enabled: userCCAs.length > 0,
    staleTime: 5 * 60 * 1000,
  });
};
