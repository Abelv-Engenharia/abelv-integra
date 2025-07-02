
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserCCAs } from "@/hooks/useUserCCAs";

export interface ProcessoGeralChartData {
  name: string;
  value: number; // soma total MOD + MOI em horas para o tipo_treinamento
  percentual: number;
  horasTotais: number; // alias pra value para facilitar nas labels
}

interface Filters {
  year?: number;
  month?: number;
  ccaId?: number;
}

// Hook para buscar e agregar os dados para o gráfico de processo geral
export function useTreinamentosPorTipoProcesso(filters?: Filters) {
  const { data: userCCAs = [] } = useUserCCAs();

  return useQuery<ProcessoGeralChartData[]>({
    queryKey: ["treinamentos-por-processo-tipo-treinamento-grafico", userCCAs, filters],
    async queryFn() {
      if (userCCAs.length === 0) {
        return [];
      }

      // Aplicar filtros de CCA se especificado
      const allowedCcaIds = filters?.ccaId ? [filters.ccaId] : userCCAs.map(cca => cca.id);

      let query = supabase
        .from("execucao_treinamentos")
        .select("tipo_treinamento, carga_horaria, efetivo_mod, efetivo_moi, cca_id, ano, mes")
        .in('cca_id', allowedCcaIds);

      // Aplicar filtros de ano e mês se especificados
      if (filters?.year) {
        query = query.eq('ano', filters.year);
      }
      if (filters?.month) {
        query = query.eq('mes', filters.month);
      }

      const { data, error } = await query;

      if (error) throw new Error("Erro ao buscar execucao_treinamentos: " + error.message);

      // Agrupa por tipo de treinamento e soma as horas total MOD + MOI
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

      return Object.entries(agrupados).map(([name, horasTotais]) => ({
        name,
        value: horasTotais,
        horasTotais,
        percentual: totalGeral ? (horasTotais / totalGeral) * 100 : 0,
      }));
    },
    enabled: userCCAs.length > 0
  });
}
