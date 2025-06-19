
import { supabase } from "@/integrations/supabase/client";

// Busca dados agregados dos subprocessos, total geral se processoTreinamentoId for nulo
export async function fetchDonutSubprocessoData(processoTreinamentoId: string | null, userCCAIds: number[] = []) {
  // Se não tem CCAs permitidos, retorna vazio
  if (userCCAIds.length === 0) {
    return [];
  }

  let query = supabase
    .from("execucao_treinamentos")
    .select("tipo_treinamento, horas_totais, cca_id")
    .in('cca_id', userCCAIds);

  if (processoTreinamentoId) {
    query = query.eq("processo_treinamento_id", processoTreinamentoId);
  }

  const { data, error } = await query;

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

  // Calcula o percentual
  return Object.keys(aggregate).map(name => ({
    name,
    value: aggregate[name],
    percent: totalHoras > 0 ? aggregate[name] / totalHoras : 0,
  }));
}
