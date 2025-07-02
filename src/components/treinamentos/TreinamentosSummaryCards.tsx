
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, CheckCircle, AlertTriangle, Clock, TrendingUp } from "lucide-react";
import { fetchTreinamentosStats } from "@/services/treinamentos/treinamentosStatsService";
import { fetchTreinamentoInvestmentPercentage } from "@/services/dashboard/treinamentoStatsService";
import { useUserCCAs } from "@/hooks/useUserCCAs";

interface TreinamentosSummaryCardsProps {
  filters?: {
    year?: number;
    month?: number;
    ccaId?: number;
  };
}

const TreinamentosSummaryCards = ({ filters }: TreinamentosSummaryCardsProps) => {
  const { data: userCCAs = [] } = useUserCCAs();
  
  console.log('Loading training stats for CCAs:', userCCAs);
  
  const userCCAIds = userCCAs.map(cca => cca.id);
  
  // Aplicar filtros de CCA se especificado
  const filteredCCAIds = filters?.ccaId ? [filters.ccaId] : userCCAIds;

  const { data: stats = {
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
  } } = useQuery({
    queryKey: ['treinamentos-stats', filteredCCAIds, filters],
    queryFn: () => fetchTreinamentosStats(filteredCCAIds),
    enabled: filteredCCAIds.length > 0,
  });

  const { data: investmentPercentage = 0 } = useQuery({
    queryKey: ['treinamento-investment-percentage', filteredCCAIds, filters],
    queryFn: () => fetchTreinamentoInvestmentPercentage(filteredCCAIds),
    enabled: filteredCCAIds.length > 0,
  });

  console.log('Loaded training stats:', stats);

  const cards = [
    {
      title: "Total de Funcionários",
      value: stats.totalFuncionarios.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Funcionários com Treinamentos",
      value: stats.funcionariosComTreinamentos.toLocaleString(),
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Treinamentos Executados",
      value: stats.totalTreinamentosExecutados.toLocaleString(),
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Treinamentos Válidos",
      value: stats.treinamentosValidos.toLocaleString(),
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Próximos ao Vencimento",
      value: stats.treinamentosVencendo.toLocaleString(),
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "% Investimento em Treinamento",
      value: `${investmentPercentage.toFixed(2)}%`,
      icon: TrendingUp,
      color: stats.metaAtingida ? "text-green-600" : "text-red-600",
      bgColor: stats.metaAtingida ? "bg-green-50" : "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={`p-2 rounded-md ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TreinamentosSummaryCards;
