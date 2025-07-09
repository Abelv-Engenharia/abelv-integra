
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserCCAs } from "@/hooks/useUserCCAs";

export interface ProcessoGeralChartData {
  name: string;
  value: number; // soma total MOD + MOI em horas para o tipo_treinamento
  percentual: number;
  horasTotais: number; // alias pra value para facilitar nas labels
}

// Hook para buscar e agregar os dados para o gráfico de processo geral
export function useTreinamentosPorTipoProcesso(filters?: { year?: string; month?: string; ccaId?: string }) {
  const { data: userCCAs = [] } = useUserCCAs();

  return useQuery<ProcessoGeralChartData[]>({
    queryKey: ["treinamentos-por-processo-tipo-treinamento-grafico", userCCAs, filters],
    async queryFn() {
      if (userCCAs.length === 0) {
        return [];
      }

      // Definir período baseado nos filtros ou ano atual
      const currentYear = new Date().getFullYear();
      const targetYear = filters?.year && filters.year !== "todos" ? parseInt(filters.year) : currentYear;

      // Filtrar CCAs se especificado
      let allowedCcaIds = userCCAs.map(cca => cca.id);
      if (filters?.ccaId && filters.ccaId !== "todos") {
        allowedCcaIds = [parseInt(filters.ccaId)];
      }

      let query = supabase
        .from("execucao_treinamentos")
        .select("tipo_treinamento, carga_horaria, efetivo_mod, efetivo_moi, cca_id")
        .in('cca_id', allowedCcaIds)
        .eq('ano', targetYear);

      // Aplicar filtro de mês se especificado
      if (filters?.month && filters.month !== "todos") {
        query = query.eq('mes', parseInt(filters.month));
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
