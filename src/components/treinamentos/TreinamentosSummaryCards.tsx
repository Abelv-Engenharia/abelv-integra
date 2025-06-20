
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Target, Clock } from "lucide-react";
import { fetchTreinamentosStats } from "@/services/treinamentos/treinamentosStatsService";
import { useUserCCAs } from "@/hooks/useUserCCAs";

export const TreinamentosSummaryCards = () => {
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
        const userCCAIds = userCCAs.map(cca => cca.id);
        const data = await fetchTreinamentosStats(userCCAIds);
        setStats(data);
      } catch (error) {
        console.error("Erro ao carregar estatísticas de treinamentos:", error);
      }
    };

    loadStats();
  }, [userCCAs]);

  const funcionariosComTreinamentosPercentual = stats.totalFuncionarios > 0 
    ? ((stats.funcionariosComTreinamentos / stats.totalFuncionarios) * 100).toFixed(1)
    : "0";

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Funcionários
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalFuncionarios}</div>
          <p className="text-xs text-muted-foreground">
            {stats.funcionariosComTreinamentos} com treinamentos válidos ({funcionariosComTreinamentosPercentual}%)
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Treinamentos Executados
          </CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTreinamentosExecutados}</div>
          <p className="text-xs text-muted-foreground">
            Total de registros de execução
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Treinamentos Válidos
          </CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.treinamentosValidos}</div>
          <p className="text-xs text-muted-foreground">
            {stats.treinamentosVencendo} próximos ao vencimento
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Meta Horas Treinamento
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${stats.metaAtingida ? 'text-green-600' : 'text-red-600'}`}>
            {stats.percentualHorasInvestidas.toFixed(2)}%
          </div>
          <p className="text-xs text-muted-foreground">
            Meta: 2.5% | {stats.totalHorasTreinamento}h de {stats.metaHoras.toFixed(0)}h
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
