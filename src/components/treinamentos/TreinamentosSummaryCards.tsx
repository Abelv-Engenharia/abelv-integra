
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Clock,
  Target, 
  TrendingUp, 
  Users
} from "lucide-react";
import { fetchTreinamentosStats } from "@/services/treinamentos/treinamentosStatsService";
import { useUserCCAs } from "@/hooks/useUserCCAs";

interface TreinamentosSummaryCardsProps {
  filters?: {
    year: string;
    month: string;
    ccaId: string;
  };
}

export const TreinamentosSummaryCards: React.FC<TreinamentosSummaryCardsProps> = ({ filters }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalFuncionarios: 0,
    funcionariosComTreinamentos: 0,
    totalTreinamentosExecutados: 0,
    treinamentosValidos: 0,
    treinamentosVencendo: 0,
    totalHHT: 0,
    totalHorasTreinamento: 0,
    metaHoras: 0,
    percentualHorasInvestidas: 0,
    metaAtingida: false
  });
  const { data: userCCAs = [] } = useUserCCAs();

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        console.log('Loading training stats for CCAs:', userCCAs, 'with filters:', filters);
        const userCCAIds = userCCAs.map(cca => cca.id);
        const data = await fetchTreinamentosStats(userCCAIds, filters);
        console.log('Loaded training stats:', data);
        setStats(data);
      } catch (error) {
        console.error("Error loading training stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [userCCAs, filters]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Percentual Investido em Treinamentos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : `${stats.percentualHorasInvestidas.toFixed(2)}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              Do total de horas trabalhadas (HHT)
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas Trabalhadas (HHT)</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.totalHHT.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              Total do período selecionado
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meta de Horas (2,5% HHT)</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.metaHoras.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Meta de treinamentos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas Totais de Treinamentos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.totalHorasTreinamento.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Realizadas no período
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Indicador de Status da Meta */}
      <Card className={`border-l-4 ${stats.metaAtingida ? 'border-l-green-500 bg-green-50' : 'border-l-red-500 bg-red-50'}`}>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${stats.metaAtingida ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`font-semibold ${stats.metaAtingida ? 'text-green-700' : 'text-red-700'}`}>
              {loading ? "Carregando..." : stats.metaAtingida ? "Meta Satisfatória" : "Meta Não Satisfatória"}
            </span>
          </div>
          <p className={`text-sm mt-2 ${stats.metaAtingida ? 'text-green-600' : 'text-red-600'}`}>
            {loading ? "" : stats.metaAtingida 
              ? `A meta de 2,5% foi atingida com ${stats.percentualHorasInvestidas.toFixed(2)}% de horas investidas em treinamentos.`
              : `A meta de 2,5% não foi atingida. Atual: ${stats.percentualHorasInvestidas.toFixed(2)}% de horas investidas em treinamentos.`
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
