
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchDashboardStats, fetchFilteredDashboardStats, DashboardStats, FilterParams } from "@/services/desvios/dashboardStatsService";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import DesviosDashboardHeader from "@/components/desvios/DesviosDashboardHeader";
import DesviosDashboardFilters from "@/components/desvios/DesviosDashboardFilters";
import DesviosDashboardStats from "@/components/desvios/DesviosDashboardStats";
import DesviosChartRows from "@/components/desvios/DesviosChartRows";
import { DesviosFiltersProvider } from "@/components/desvios/DesviosFiltersProvider";

const DesviosDashboard = () => {
  const { toast } = useToast();
  const { data: userCCAs = [] } = useUserCCAs();
  const [year, setYear] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [ccaId, setCcaId] = useState<string>("");
  const [disciplinaId, setDisciplinaId] = useState<string>("");
  const [empresaId, setEmpresaId] = useState<string>("");
  const [filtersApplied, setFiltersApplied] = useState<boolean>(false);
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

  // Buscar estatísticas do dashboard filtrando pelos CCAs permitidos
  useEffect(() => {
    const loadDashboardStats = async () => {
      setLoading(true);
      try {
        console.log('Carregando estatísticas do dashboard para CCAs permitidos...');
        
        // Se o usuário não tem CCAs permitidos, não buscar dados
        if (userCCAs.length === 0) {
          setDashboardStats({
            totalDesvios: 0,
            acoesCompletas: 0,
            acoesAndamento: 0,
            acoesPendentes: 0,
            percentualCompletas: 0,
            percentualAndamento: 0,
            percentualPendentes: 0,
            riskLevel: "Baixo",
          });
          return;
        }

        // Filtrar pelos CCAs permitidos
        const allowedCcaIds = userCCAs.map(cca => cca.id.toString());
        const filters: FilterParams = {
          ccaIds: allowedCcaIds
        };
        
        const stats = await fetchFilteredDashboardStats(filters);
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
  }, [toast, userCCAs]);

  const handleFilterChange = async () => {
    setLoading(true);
    try {
      console.log('Iniciando aplicação de filtros...');
      console.log('Filtros atuais:', { year, month, ccaId, disciplinaId, empresaId });
      
      // Sempre aplicar filtro por CCAs permitidos
      const allowedCcaIds = userCCAs.map(cca => cca.id.toString());
      const filters: FilterParams = {
        ccaIds: allowedCcaIds
      };
      
      if (year && year !== "todos") filters.year = year;
      if (month && month !== "todos") filters.month = month;
      if (ccaId && ccaId !== "todos") {
        // Verificar se o CCA selecionado está nos permitidos
        if (allowedCcaIds.includes(ccaId)) {
          filters.ccaId = ccaId;
        }
      }
      if (disciplinaId && disciplinaId !== "todos") filters.disciplinaId = disciplinaId;
      if (empresaId && empresaId !== "todos") filters.empresaId = empresaId;

      console.log('Aplicando filtros aos cards:', filters);
      
      const filteredStats = await fetchFilteredDashboardStats(filters);
      console.log('Estatísticas filtradas recebidas:', filteredStats);
      setDashboardStats(filteredStats);
      setFiltersApplied(true);
      
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

  // Função para limpar filtros e recarregar dados originais
  const handleClearFilters = async () => {
    setYear("");
    setMonth("");
    setCcaId("");
    setDisciplinaId("");
    setEmpresaId("");
    setFiltersApplied(false);
    
    setLoading(true);
    try {
      // Recarregar dados originais apenas com filtro de CCA
      const allowedCcaIds = userCCAs.map(cca => cca.id.toString());
      const filters: FilterParams = {
        ccaIds: allowedCcaIds
      };
      
      const stats = await fetchFilteredDashboardStats(filters);
      setDashboardStats(stats);
      
      toast({
        title: "Filtros limpos",
        description: "Os dados foram restaurados para o estado original.",
      });
    } catch (error) {
      console.error('Erro ao limpar filtros:', error);
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
      <DesviosFiltersProvider
        year={year}
        month={month}
        ccaId={ccaId}
        disciplinaId={disciplinaId}
        empresaId={empresaId}
        userCCAs={userCCAs}
        filtersApplied={filtersApplied}
      >
        <DesviosChartRows />
      </DesviosFiltersProvider>
    </div>
  );
};

export default DesviosDashboard;
