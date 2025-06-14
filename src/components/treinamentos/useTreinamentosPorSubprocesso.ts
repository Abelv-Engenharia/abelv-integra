
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Cada item representa um subprocesso (tipo de treinamento) para o processo filtrado.
export interface SubprocessoChartData {
  name: string;
  value: number; // total de horas para o tipo
  percentual: number; // percentual em relação ao total de horas desse processo
  horasTotais: number;
}

// processoId pode ser undefined ou string ("todos"), nesse caso traz todos
export function useTreinamentosPorSubprocesso(processoId: string | undefined) {
  return useQuery<SubprocessoChartData[]>({
    queryKey: ["treinamentos-por-subprocesso", processoId],
    async queryFn() {
      // Busca condicional
      let query = supabase
        .from("execucao_treinamentos")
        .select("processo_treinamento_id, tipo_treinamento, carga_horaria, efetivo_mod, efetivo_moi");

      if (processoId && processoId !== "todos") {
        query = query.eq("processo_treinamento_id", processoId);
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
    }
  });
}
