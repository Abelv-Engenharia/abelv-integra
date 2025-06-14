
import { useQuery } from "@tanstack/react-query";
import { fetchTreinamentosPorProcesso } from "@/services/treinamentos/treinamentosPorProcessoService";
export function useFilteredTreinamentosPorProcesso({ year, month, ccaId }:{year:string,month:string,ccaId:string}) {
  return useQuery({
    queryKey: ['treinamentos-por-processo', year, month, ccaId],
    queryFn: async () => fetchTreinamentosPorProcesso({ year, month, ccaId }),
    keepPreviousData: true,
  });
}
