
import { useQuery } from "@tanstack/react-query";
import { idsmsService } from "@/services/idsms/idsmsService";

export const useIDSMSDashboard = () => {
  return useQuery({
    queryKey: ['idsms-dashboard-data'],
    queryFn: () => idsmsService.getDashboardData({
      cca_id: "all",
      ano: "all", 
      mes: "all"
    }),
    refetchOnWindowFocus: false,
  });
};
