
import { useQuery } from "@tanstack/react-query";
import { idsmsService } from "@/services/idsms/idsmsService";

interface IDSMSFilters {
  cca_id?: string;
  ano?: string;
  mes?: string;
}

export const useIDSMSDashboard = (filters?: IDSMSFilters) => {
  return useQuery({
    queryKey: ['idsms-dashboard-data', filters],
    queryFn: () => idsmsService.getDashboardData({
      cca_id: filters?.cca_id || "all",
      ano: filters?.ano || "all", 
      mes: filters?.mes || "all"
    }),
    refetchOnWindowFocus: false,
  });
};
