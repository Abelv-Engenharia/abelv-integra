
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchFilteredDashboardStats, DashboardStats, FilterParams } from "@/services/desvios/dashboardStatsService";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import DesviosDashboardHeader from "@/components/desvios/DesviosDashboardHeader";
import DesviosDashboardFilters from "@/components/desvios/DesviosDashboardFilters";
import DesviosDashboardStats from "@/components/desvios/DesviosDashboardStats";
import DesviosChartRows from "@/components/desvios/DesviosChartRows";
import { DesviosFiltersProvider } from "@/components/desvios/DesviosFiltersProvider";
import { normalizeFilters } from "@/utils/dateFilters";

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

  // Busca dos cards com filtros (sempre aplica CCAs permitidos)
  const updateDashboardStats = async (filters?: FilterParams) => {
    setLoading(true);
    try {
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
      const allowedCcaIds = userCCAs.map(cca => cca.id.toString());
      const finalFilters: FilterParams = { ccaIds: allowedCcaIds, ...filters };
      const stats = await fetchFilteredDashboardStats(finalFilters);
      setDashboardStats(stats);
    } catch (error) {
      console.error("Erro ao buscar estatísticas do dashboard:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Ocorreu um erro ao buscar as estatísticas do dashboard.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Estatísticas iniciais quando CCAs disponíveis
  useEffect(() => {
    if (userCCAs.length === 0) return;
    updateDashboardStats({ ccaIds: userCCAs.map(cca => cca.id.toString()) });
  }, [userCCAs]);

  // Reaplicar sempre que filtros mudarem
  useEffect(() => {
    if (userCCAs.length === 0) return;

    const apply = async () => {
      const allowedCcaIds = userCCAs.map(cca => cca.id.toString());
      const normalized = normalizeFilters({
        year, month, ccaId, disciplinaId, empresaId, userCcaIds: allowedCcaIds
      });

      await updateDashboardStats(normalized);

      const hasFilters =
        !!normalized.year ||
        !!normalized.month ||
        (normalized.ccaIds && normalized.ccaIds.length === 1) ||
        !!disciplinaId || !!empresaId;

      setFiltersApplied(hasFilters);
    };

    apply();
  }, [year, month, ccaId, disciplinaId, empresaId, userCCAs]);

  const handleClearFilters = async () => {
    setYear("");
    setMonth("");
    setCcaId("");
    setDisciplinaId("");
    setEmpresaId("");
    setFiltersApplied(false);
    await updateDashboardStats({ ccaIds: userCCAs.map(cca => cca.id.toString()) });
  };

  const allowedCcaIds = userCCAs.map(cca => cca.id.toString());
  const normalizedForCharts = normalizeFilters({
    year, month, ccaId, disciplinaId, empresaId, userCcaIds: allowedCcaIds
  });

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
        year={normalizedForCharts.year || ""}
        month={normalizedForCharts.month || ""}
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
