
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";
import { fetchDashboardStats } from "@/services/ocorrenciasDashboardService";

const OcorrenciasSummaryCards = () => {
  const [stats, setStats] = useState({
    totalOcorrencias: 0,
    ocorrenciasThisMonth: 0,
    pendingActions: 0,
    riskLevel: 'Baixo'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Alto':
        return 'text-red-600';
      case 'Médio':
        return 'text-yellow-600';
      default:
        return 'text-green-600';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'Alto':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'Médio':
        return <TrendingUp className="h-4 w-4 text-yellow-600" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse bg-gray-200 h-8 w-16 rounded mb-2"></div>
              <div className="animate-pulse bg-gray-200 h-3 w-32 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Ocorrências</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalOcorrencias}</div>
          <p className="text-xs text-muted-foreground">
            Registradas no sistema
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.ocorrenciasThisMonth}</div>
          <p className="text-xs text-muted-foreground">
            Ocorrências registradas
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ações Pendentes</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingActions}</div>
          <p className="text-xs text-muted-foreground">
            Aguardando tratativa
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nível de Risco</CardTitle>
          {getRiskIcon(stats.riskLevel)}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getRiskColor(stats.riskLevel)}`}>
            {stats.riskLevel}
          </div>
          <p className="text-xs text-muted-foreground">
            Avaliação geral
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OcorrenciasSummaryCards;
