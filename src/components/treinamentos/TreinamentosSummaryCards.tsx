
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Clock,
  Target, 
  TrendingUp, 
  Users
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchTreinamentosStats } from "@/services/treinamentos/treinamentosStatsService";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

interface TreinamentosSummaryCardsProps {
  filters?: {
    year: string;
    month: string;
    ccaId: string;
  };
}

export const TreinamentosSummaryCards: React.FC<TreinamentosSummaryCardsProps> = ({ filters }) => {
  const { data: userCCAs = [] } = useUserCCAs();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['treinamentos-stats', userCCAs, filters],
    queryFn: async () => {
      const userCCAIds = userCCAs.map(cca => cca.id);
      return await fetchTreinamentosStats(userCCAIds, filters);
    },
    enabled: userCCAs.length > 0,
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
    refetchOnWindowFocus: false,
  });

  const defaultStats = {
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
  };

  const currentStats = stats || defaultStats;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="animate-pulse">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mt-2"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              {currentStats.percentualHorasInvestidas.toFixed(2)}%
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
              {currentStats.totalHHT.toLocaleString('pt-BR')}
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
              {currentStats.metaHoras.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
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
              {currentStats.totalHorasTreinamento.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Realizadas no período
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Indicador de Status da Meta */}
      <Card className={`border-l-4 ${currentStats.metaAtingida ? 'border-l-green-500 bg-green-50' : 'border-l-red-500 bg-red-50'}`}>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${currentStats.metaAtingida ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`font-semibold ${currentStats.metaAtingida ? 'text-green-700' : 'text-red-700'}`}>
              {currentStats.metaAtingida ? "Meta Satisfatória" : "Meta Não Satisfatória"}
            </span>
          </div>
          <p className={`text-sm mt-2 ${currentStats.metaAtingida ? 'text-green-600' : 'text-red-600'}`}>
            {currentStats.metaAtingida 
              ? `A meta de 2,5% foi atingida com ${currentStats.percentualHorasInvestidas.toFixed(2)}% de horas investidas em treinamentos.`
              : `A meta de 2,5% não foi atingida. Atual: ${currentStats.percentualHorasInvestidas.toFixed(2)}% de horas investidas em treinamentos.`
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
