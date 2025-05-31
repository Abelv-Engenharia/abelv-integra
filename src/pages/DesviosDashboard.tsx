
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchDashboardStats, fetchFilteredDashboardStats, DashboardStats } from "@/services/desvios/dashboardStatsService";
import DesviosDashboardHeader from "@/components/desvios/DesviosDashboardHeader";
import DesviosDashboardFilters from "@/components/desvios/DesviosDashboardFilters";
import DesviosDashboardStats from "@/components/desvios/DesviosDashboardStats";
import DesviosChartRows from "@/components/desvios/DesviosChartRows";

const DesviosDashboard = () => {
  const { toast } = useToast();
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [month, setMonth] = useState<string>((new Date().getMonth() + 1).toString());
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalDesvios: 0,
    acoesCompletas: 0,
    acoesAndamento: 0,
    acoesPendentes: 0,
    percentualCompletas: 0,
    percentualAndamento: 0,
    percentualPendentes: 0,
    riskLevel: "Baixo",
  });
  const [loading, setLoading] = useState(true);

  // Buscar estatísticas do dashboard
  useEffect(() => {
    const loadDashboardStats = async () => {
      setLoading(true);
      try {
        console.log('Carregando estatísticas do dashboard...');
        const stats = await fetchDashboardStats();
        console.log('Estatísticas carregadas:', stats);
        setDashboardStats(stats);
      } catch (error) {
        console.error('Erro ao buscar estatísticas do dashboard:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Ocorreu um erro ao buscar as estatísticas do dashboard.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardStats();
  }, [toast]);

  const handleFilterChange = async () => {
    setLoading(true);
    try {
      console.log('Aplicando filtros:', { year, month });
      const filteredStats = await fetchFilteredDashboardStats(year, month);
      console.log('Estatísticas filtradas:', filteredStats);
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
    </div>
  );
};

export default DesviosDashboard;
