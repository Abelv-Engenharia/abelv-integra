
import { supabase } from "@/integrations/supabase/client";

export const fetchFuncionariosComTreinamentos = async () => {
  // Get funcionarios with their trainings
  const { data: funcionarios } = await supabase
    .from('funcionarios')
    .select('*')
    .eq('ativo', true)
    .limit(100);
  
  const { data: treinamentosNormativos } = await supabase
    .from('treinamentos_normativos')
    .select('id, funcionario_id, treinamento_id, tipo, data_realizacao, data_validade, status, arquivado')
    .eq('arquivado', false)
    .limit(1000);
  
  const { data: treinamentosInfo } = await supabase
    .from('treinamentos')
    .select('id, nome')
    .limit(100);

  // Map treinamentos to funcionarios
  const funcionariosComTreinamentos = (funcionarios || []).map(funcionario => {
    const treinamentos = (treinamentosNormativos || [])
      .filter(t => t.funcionario_id === funcionario.id && !t.arquivado)
      .map(t => ({
        ...t,
        treinamentoNome: (treinamentosInfo || [])
          .find(tr => tr.id === t.treinamento_id)?.nome || "Desconhecido"
      }));

    return {
      ...funcionario,
      treinamentos
    };
  });

  return funcionariosComTreinamentos;
};
