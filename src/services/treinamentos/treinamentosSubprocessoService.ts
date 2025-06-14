
import { supabase } from "@/integrations/supabase/client";

// Busca dados agregados dos subprocessos para um processo específico
export async function fetchDonutSubprocessoData(processoTreinamentoId: string | null) {
  if (!processoTreinamentoId) return [];

  // Exemplo: busque dados de "execucao_treinamentos" agrupando por tipo_treinamento (subprocesso)
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
  (data || []).forEach(entry => {
    const key = entry.tipo_treinamento || "Desconhecido";
    aggregate[key] = (aggregate[key] || 0) + (entry.horas_totais || 0);
  });

  return Object.keys(aggregate).map(name => ({
    name,
    value: aggregate[name],
  }));
}
