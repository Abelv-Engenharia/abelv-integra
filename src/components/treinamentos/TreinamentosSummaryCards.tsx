
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar,
  FileCheck, 
  FileText, 
  Users
} from "lucide-react";
import { fetchTreinamentosStats } from "@/services/treinamentosDashboardService";

export const TreinamentosSummaryCards = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalFuncionarios: 0,
    funcionariosComTreinamentos: 0,
    totalTreinamentosExecutados: 0,
    treinamentosValidos: 0,
    treinamentosVencendo: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await fetchTreinamentosStats();
        setStats(data);
      } catch (error) {
        console.error("Error loading training stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Funcionários</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? "..." : stats.totalFuncionarios}</div>
          <p className="text-xs text-muted-foreground">
            Funcionários com treinamentos: {loading ? "..." : stats.funcionariosComTreinamentos}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Treinamentos Executados</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? "..." : stats.totalTreinamentosExecutados}</div>
          <p className="text-xs text-muted-foreground">
            Total de eventos de treinamento
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Treinamentos Válidos</CardTitle>
          <FileCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? "..." : stats.treinamentosValidos}</div>
          <p className="text-xs text-muted-foreground">
            Certificações dentro da validade
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Próximos ao Vencimento</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? "..." : stats.treinamentosVencendo}</div>
          <p className="text-xs text-muted-foreground">
            Vencimento nos próximos 30 dias
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
