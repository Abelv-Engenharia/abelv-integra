
import { useQuery } from "@tanstack/react-query";
import { fetchTreinamentosNormativosData } from "@/services/treinamentos/treinamentosNormativosDataService";
export function useFilteredNormativosData({ year, month, ccaId }:{year:string,month:string,ccaId:string}) {
  return useQuery({
    queryKey: ['treinamentos-normativos', year, month, ccaId],
    queryFn: async () => fetchTreinamentosNormativosData({ year, month, ccaId }),
    keepPreviousData: true,
  });
}
