
import { useQuery } from "@tanstack/react-query";
import { fetchTreinamentosExecucaoData } from "@/services/treinamentos/treinamentosExecucaoDataService";

export function useFilteredTreinamentosExecucaoData({ year, month, ccaId }: {year:string, month:string, ccaId:string}) {
  return useQuery({
    queryKey: ['treinamentos-execucao', year, month, ccaId],
    queryFn: () => fetchTreinamentosExecucaoData({ year, month, ccaId }),
  });
}
