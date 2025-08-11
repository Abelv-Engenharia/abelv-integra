
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

  // Função para atualizar os cards de estatísticas
  const updateDashboardStats = async (filters?: FilterParams) => {
    setLoading(true);
    try {
      console.log('Atualizando estatísticas dos cards com filtros:', filters);
      
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

      // Sempre aplicar filtro por CCAs permitidos
      const allowedCcaIds = userCCAs.map(cca => cca.id.toString());
      const finalFilters: FilterParams = {
        ccaIds: allowedCcaIds,
        ...filters
      };
      
      const stats = await fetchFilteredDashboardStats(finalFilters);
      console.log('Estatísticas dos cards atualizadas:', stats);
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

  // Buscar estatísticas iniciais do dashboard filtrando pelos CCAs permitidos
  useEffect(() => {
    updateDashboardStats();
  }, [userCCAs]);

  // Atualizar automaticamente quando os filtros mudarem
  useEffect(() => {
    const applyFiltersAutomatically = async () => {
      try {
        console.log('Aplicando filtros automaticamente...');
        console.log('Filtros atuais:', { year, month, ccaId, disciplinaId, empresaId });
        
        // Preparar filtros para os cards
        const filters: FilterParams = {};
        
        if (year && year !== "todos") filters.year = year;
        if (month && month !== "todos") filters.month = month;
        if (ccaId && ccaId !== "todos") {
          // Verificar se o CCA selecionado está nos permitidos
          const allowedCcaIds = userCCAs.map(cca => cca.id.toString());
          if (allowedCcaIds.includes(ccaId)) {
            // Quando um CCA específico é selecionado, substituir a lista de CCAs permitidos
            filters.ccaIds = [ccaId];
          }
        }
        if (disciplinaId && disciplinaId !== "todos") filters.disciplinaId = disciplinaId;
        if (empresaId && empresaId !== "todos") filters.empresaId = empresaId;

        console.log('Aplicando filtros aos cards:', filters);
        
        // Atualizar os cards de estatísticas com os filtros aplicados
        await updateDashboardStats(filters);
        
        // Marcar que filtros estão aplicados se algum filtro foi definido
        const hasFilters = year !== "" || month !== "" || ccaId !== "" || disciplinaId !== "" || empresaId !== "";
        setFiltersApplied(hasFilters);
      } catch (error) {
        console.error('Erro ao aplicar filtros automaticamente:', error);
      }
    };

    // Só aplicar se já temos dados dos CCAs
    if (userCCAs.length > 0) {
      applyFiltersAutomatically();
    }
  }, [year, month, ccaId, disciplinaId, empresaId, userCCAs]);

  // Função para limpar filtros e recarregar dados originais
  const handleClearFilters = async () => {
    setYear("");
    setMonth("");
    setCcaId("");
    setDisciplinaId("");
    setEmpresaId("");
    setFiltersApplied(false);
    
    try {
      // Recarregar dados originais apenas com filtro de CCA
      await updateDashboardStats();
      
      toast({
        title: "Filtros limpos",
        description: "Os dados foram restaurados para o estado original.",
      });
    } catch (error) {
      console.error('Erro ao limpar filtros:', error);
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
        onClearFilters={handleClearFilters}
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
