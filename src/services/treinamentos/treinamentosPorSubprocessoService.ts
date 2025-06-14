
import { supabase } from "@/integrations/supabase/client";

export const fetchTreinamentosPorSubprocesso = async ({
  processoId,
  year,
  month,
  ccaId,
}: {
  processoId: string;
  year: string;
  month: string;
  ccaId: string;
}) => {
  // Monta query condicional
  let query = supabase
    .from("execucao_treinamentos")
    .select("tipo_treinamento, carga_horaria, efetivo_mod, efetivo_moi, processo_treinamento_id, ano, mes, cca_id");

  if (processoId && processoId !== "todos") {
    query = query.eq("processo_treinamento_id", processoId);
  }
  if (year && year !== "todos") {
    query = query.eq("ano", Number(year));
  }
  if (month && month !== "todos") {
    query = query.eq("mes", Number(month));
  }
  if (ccaId && ccaId !== "todos") {
    query = query.eq("cca_id", Number(ccaId));
  }

  const { data, error } = await query;

  if (error) throw new Error("Erro ao buscar execucao_treinamentos: " + error.message);

  // Agrupa por tipo_treinamento e soma as horas totais
  const agrupados: Record<string, number> = {};

  (data || []).forEach((linha) => {
    const tipo = linha.tipo_treinamento || "Não informado";
    const cargaHoraria = Number(linha.carga_horaria) || 0;
    const mod = Number(linha.efetivo_mod) || 0;
    const moi = Number(linha.efetivo_moi) || 0;
    const totalHoras = cargaHoraria * (mod + moi);

    if (!agrupados[tipo]) agrupados[tipo] = 0;
    agrupados[tipo] += totalHoras;
  });

  const totalGeral = Object.values(agrupados).reduce((s, v) => s + v, 0);
  if (!totalGeral) return [];

  return Object.entries(agrupados).map(([name, horasTotais]) => ({
    name,
    value: horasTotais,
    horasTotais,
    percentual: totalGeral ? (horasTotais / totalGeral) * 100 : 0,
  }));
};
