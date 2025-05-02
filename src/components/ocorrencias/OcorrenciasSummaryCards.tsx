
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, AlertTriangle, ArrowDown, FileBarChart, FileCheck, FileClock } from "lucide-react";
import { fetchOcorrenciasStats, OcorrenciasStats } from "@/services/ocorrenciasDashboardService";

const OcorrenciasSummaryCards = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<OcorrenciasStats>({
    totalOcorrencias: 0,
    ocorrenciasMes: 0,
    ocorrenciasPendentes: 0,
    riscoPercentage: 0,
  });

  // Mock data for the metrics that aren't in the API yet
  const diasPerdidos = 126;
  const diasDebitados = 75;
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchOcorrenciasStats();
        setStats(data);
      } catch (err) {
        console.error("Error loading ocorrencias stats:", err);
        setError("Erro ao carregar estatísticas de ocorrências");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Carregando...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-2 bg-slate-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 border border-red-200">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  // Calculate percentages for the card displays
  const comAfastamentoPercent = stats.totalOcorrencias ? Math.round((stats.ocorrenciasPendentes / stats.totalOcorrencias) * 100) : 0;
  const semAfastamentoPercent = stats.totalOcorrencias ? Math.round(((stats.totalOcorrencias - stats.ocorrenciasPendentes) / stats.totalOcorrencias) * 100) : 0;
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Ocorrências</CardTitle>
          <FileBarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalOcorrencias}</div>
          <p className="text-xs text-muted-foreground">
            Últimos 12 meses
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Com Afastamento</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.ocorrenciasPendentes}</div>
          <p className="text-xs text-muted-foreground">
            {comAfastamentoPercent}% do total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sem Afastamento</CardTitle>
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalOcorrencias - stats.ocorrenciasPendentes}</div>
          <p className="text-xs text-muted-foreground">
            {semAfastamentoPercent}% do total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ocorrências do Mês</CardTitle>
          <FileCheck className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.ocorrenciasMes}</div>
          <p className="text-xs text-muted-foreground">
            Mês atual
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dias Perdidos</CardTitle>
          <ArrowDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{diasPerdidos}</div>
          <p className="text-xs text-muted-foreground">
            {stats.ocorrenciasPendentes ? Math.round(diasPerdidos / stats.ocorrenciasPendentes) : 0} dias/ocorrência
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dias Debitados</CardTitle>
          <FileClock className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{diasDebitados}</div>
          <p className="text-xs text-muted-foreground">
            Por incapacidade permanente
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OcorrenciasSummaryCards;
