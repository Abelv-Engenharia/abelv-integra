
import { useQuery } from "@tanstack/react-query";
import { fetchTreinamentosStats } from "@/services/treinamentos/treinamentosStatsService";
export function useFilteredTreinamentosStats({ year, month, ccaId }: { year: string; month: string; ccaId: string }) {
  return useQuery({
    queryKey: ['treinamentos-stats', year, month, ccaId],
    queryFn: async () => fetchTreinamentosStats({ year, month, ccaId }),
    keepPreviousData: true,
  });
}
