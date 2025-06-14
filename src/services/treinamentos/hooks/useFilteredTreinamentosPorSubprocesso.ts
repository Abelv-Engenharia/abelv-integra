
import { useQuery } from "@tanstack/react-query";
import { fetchTreinamentosPorSubprocesso } from "@/services/treinamentos/treinamentosPorSubprocessoService";

export function useFilteredTreinamentosPorSubprocesso({
  processoId,
  year,
  month,
  ccaId
}: { processoId: string, year: string, month: string, ccaId: string }) {
  return useQuery({
    queryKey: ['treinamentos-por-subprocesso', processoId, year, month, ccaId],
    queryFn: () => fetchTreinamentosPorSubprocesso({ processoId, year, month, ccaId }),
  });
}
