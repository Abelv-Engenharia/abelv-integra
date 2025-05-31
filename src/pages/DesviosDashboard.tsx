
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchDashboardStats, fetchFilteredDashboardStats, DashboardStats, FilterParams } from "@/services/desvios/dashboardStatsService";
import DesviosDashboardHeader from "@/components/desvios/DesviosDashboardHeader";
import DesviosDashboardFilters from "@/components/desvios/DesviosDashboardFilters";
import DesviosDashboardStats from "@/components/desvios/DesviosDashboardStats";
import DesviosChartRows from "@/components/desvios/DesviosChartRows";

const DesviosDashboard = () => {
  const { toast } = useToast();
  const [year, setYear] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [ccaId, setCcaId] = useState<string>("");
  const [disciplinaId, setDisciplinaId] = useState<string>("");
  const [empresaId, setEmpresaId] = useState<string>("");
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
      const filters: FilterParams = {};
      
      if (year && year !== "todos") filters.year = year;
      if (month && month !== "todos") filters.month = month;
      if (ccaId && ccaId !== "todos") filters.ccaId = ccaId;
      if (disciplinaId && disciplinaId !== "todos") filters.disciplinaId = disciplinaId;
      if (empresaId && empresaId !== "todos") filters.empresaId = empresaId;

      console.log('Aplicando filtros:', filters);
      
      // Se não há filtros, buscar dados sem filtros
      if (Object.keys(filters).length === 0) {
        const stats = await fetchDashboardStats();
        setDashboardStats(stats);
      } else {
        const filteredStats = await fetchFilteredDashboardStats(filters);
        console.log('Estatísticas filtradas:', filteredStats);
        setDashboardStats(filteredStats);
      }
      
      toast({
        title: "Filtros aplicados",
        description: "Os dados foram atualizados com os filtros selecionados.",
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
        ccaId={ccaId}
        disciplinaId={disciplinaId}
        empresaId={empresaId}
        setYear={setYear} 
        setMonth={setMonth} 
        setCcaId={setCcaId}
        setDisciplinaId={setDisciplinaId}
        setEmpresaId={setEmpresaId}
        onFilterChange={handleFilterChange}
      />
      <DesviosDashboardStats loading={loading} stats={dashboardStats} />
      <DesviosChartRows />
    </div>
  );
};

export default DesviosDashboard;
