import { useQuery } from "@tanstack/react-query";
import { almoxarifadoService, Almoxarifado } from "@/services/almoxarifadoService";

export const useAlmoxarifados = (ccaId: number | undefined) => {
  return useQuery({
    queryKey: ["almoxarifados", ccaId],
    queryFn: async () => {
      if (!ccaId) return [];
      return await almoxarifadoService.getByCCA(ccaId);
    },
    enabled: !!ccaId,
  });
};

export type { Almoxarifado };