
import { supabase } from "@/integrations/supabase/client";

// Busca dados agregados dos subprocessos para um processo específico
export async function fetchDonutSubprocessoData(processoTreinamentoId: string | null) {
  if (!processoTreinamentoId) return [];

  // Busca todos os registros vinculados ao processo selecionado,
  // agrupando apenas pelo nome/opção do subprocesso (tipo_treinamento)
  const { data, error } = await supabase
    .from("execucao_treinamentos")
    .select("tipo_treinamento, horas_totais")
    .eq("processo_treinamento_id", processoTreinamentoId);

  if (error) {
    console.error("Erro ao buscar subprocessos:", error);
    return [];
  }

  // Agrupa e soma as horas por tipo_treinamento (subprocesso)
  const aggregate: Record<string, number> = {};
  let totalHoras = 0;
  (data || []).forEach(entry => {
    const key = entry.tipo_treinamento || "Desconhecido";
    const horas = Number(entry.horas_totais || 0);
    aggregate[key] = (aggregate[key] || 0) + horas;
    totalHoras += horas;
  });

  // Para mostrar opções em relação ao total, precisamos calcular o valor relativo ao total geral de subprocessos
  return Object.keys(aggregate).map(name => ({
    name,
    value: aggregate[name],
    percent: totalHoras > 0 ? aggregate[name] / totalHoras : 0,
  }));
}
