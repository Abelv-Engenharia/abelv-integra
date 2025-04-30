
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchDashboardStats, fetchFilteredDashboardStats, DashboardStats } from "@/services/desviosDashboardService";
import DesviosDashboardHeader from "@/components/desvios/DesviosDashboardHeader";
import DesviosDashboardFilters from "@/components/desvios/DesviosDashboardFilters";
import DesviosDashboardStats from "@/components/desvios/DesviosDashboardStats";
import DesviosChartRows from "@/components/desvios/DesviosChartRows";
import LatestDesvios from "@/components/desvios/LatestDesvios";

const DesviosDashboard = () => {
  const { toast } = useToast();
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [month, setMonth] = useState<string>((new Date().getMonth() + 1).toString());
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalDesvios: 0,
    desviosThisMonth: 0,
    pendingActions: 0,
    riskLevel: "Baixo",
  });
  const [loading, setLoading] = useState(true);

  // Buscar estatísticas do dashboard
  useEffect(() => {
    const loadDashboardStats = async () => {
      setLoading(true);
      try {
        const stats = await fetchDashboardStats();
        setDashboardStats(stats);
      } catch (error) {
        console.error('Erro ao buscar estatísticas do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardStats();
  }, []);

  const handleFilterChange = async () => {
    setLoading(true);
    try {
      const filteredStats = await fetchFilteredDashboardStats(year, month);
      setDashboardStats(filteredStats);
      
      toast({
        title: "Filtros aplicados",
        description: `Mostrando dados para: ${month}/${year}`,
      });
    } catch (error) {
      console.error('Erro ao aplicar filtros:', error);
      toast({
        title: "Erro ao aplicar filtros",
        description: "Ocorreu um erro ao buscar os dados filtrados.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <DesviosDashboardHeader />
      <DesviosDashboardFilters 
        year={year} 
        month={month} 
        setYear={setYear} 
        setMonth={setMonth} 
        onFilterChange={handleFilterChange}
      />
      <DesviosDashboardStats loading={loading} stats={dashboardStats} />
      <DesviosChartRows />
      <LatestDesvios />
    </div>
  );
};

export default DesviosDashboard;
