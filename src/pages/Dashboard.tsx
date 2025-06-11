
import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  Calendar,
  ClipboardList,
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import AreaChart from "@/components/dashboard/AreaChart";
import BarChart from "@/components/dashboard/BarChart";
import RecentActivitiesList from "@/components/dashboard/RecentActivitiesList";
import PendingTasksList from "@/components/dashboard/PendingTasksList";
import SystemLogo from "@/components/common/SystemLogo";
import { dashboardService } from "@/services/dashboardService";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getStats,
    refetchOnWindowFocus: false
  });

  const { data: recentActivities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: ['dashboard-activities'],
    queryFn: dashboardService.getRecentActivities,
    refetchOnWindowFocus: false
  });

  const { data: pendingTasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['dashboard-tasks'],
    queryFn: dashboardService.getPendingTasks,
    refetchOnWindowFocus: false
  });

  // Mock data para os gráficos (manter até termos dados suficientes)
  const areaChartData = [
    { name: "Jan", value: stats?.desviosThisMonth || 12 },
    { name: "Fev", value: 19 },
    { name: "Mar", value: 15 },
    { name: "Abr", value: 27 },
    { name: "Mai", value: 22 },
    { name: "Jun", value: 30 },
    { name: "Jul", value: 25 },
  ];

  const barChartData = [
    { name: "Jan", alta: 4, media: 5, baixa: 8 },
    { name: "Fev", alta: 6, media: 8, baixa: 10 },
    { name: "Mar", alta: 3, media: 7, baixa: 12 },
    { name: "Abr", alta: 5, media: 12, baixa: 15 },
    { name: "Mai", alta: 7, media: 10, baixa: 12 },
    { name: "Jun", alta: 6, media: 15, baixa: 17 },
  ];

  const barChartCategories = [
    { dataKey: "alta", name: "Alta Severidade", color: "#F97316" },
    { dataKey: "media", name: "Média Severidade", color: "#FB923C" },
    { dataKey: "baixa", name: "Baixa Severidade", color: "#FDBA74" },
  ];

  const calculateTrend = (current: number, total: number) => {
    if (total === 0) return { trend: "neutral" as const, value: "0%" };
    const percentage = ((current / total) * 100).toFixed(0);
    return { 
      trend: current > total * 0.1 ? "up" as const : "down" as const, 
      value: `${percentage}%` 
    };
  };

  const handleMarkTaskComplete = (taskId: string) => {
    console.log(`Marcar tarefa ${taskId} como concluída`);
    // TODO: Implementar a lógica para marcar tarefa como concluída
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center mb-8 mt-4">
        <SystemLogo className="h-16 mb-4" defaultTitle="Gestão de SMS Abelv" />
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral de indicadores e métricas do sistema de Gestão de SMS Abelv.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))
        ) : (
          <>
            <StatCard
              title="Desvios"
              value={stats?.desviosThisMonth.toString() || "0"}
              icon={<AlertTriangle className="h-4 w-4" />}
              description="Desvios registrados no mês atual"
              trend={calculateTrend(stats?.desviosThisMonth || 0, stats?.totalDesvios || 0).trend}
              trendValue={calculateTrend(stats?.desviosThisMonth || 0, stats?.totalDesvios || 0).value}
            />
            <StatCard
              title="Treinamentos"
              value={stats?.treinamentosThisMonth.toString() || "0"}
              icon={<Calendar className="h-4 w-4" />}
              description="Treinamentos realizados no mês"
              trend={calculateTrend(stats?.treinamentosThisMonth || 0, stats?.totalTreinamentos || 0).trend}
              trendValue={calculateTrend(stats?.treinamentosThisMonth || 0, stats?.totalTreinamentos || 0).value}
            />
            <StatCard
              title="Ocorrências"
              value={stats?.ocorrenciasThisMonth.toString() || "0"}
              icon={<Activity className="h-4 w-4" />}
              description="Ocorrências registradas no mês"
              trend={calculateTrend(stats?.ocorrenciasThisMonth || 0, stats?.totalOcorrencias || 0).trend}
              trendValue={calculateTrend(stats?.ocorrenciasThisMonth || 0, stats?.totalOcorrencias || 0).value}
            />
            <StatCard
              title="Tarefas"
              value={stats?.tarefasPendentes.toString() || "0"}
              icon={<ClipboardList className="h-4 w-4" />}
              description="Tarefas pendentes no sistema"
              trend="neutral"
              trendValue={`${stats?.totalTarefas || 0} total`}
            />
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AreaChart
          title="Tendência de Desvios de Segurança"
          data={areaChartData}
          dataKey="value"
        />
        <BarChart
          title="Desvios por Severidade"
          data={barChartData}
          categories={barChartCategories}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {activitiesLoading ? (
          <Skeleton className="h-80" />
        ) : (
          <RecentActivitiesList 
            title="Atividades Recentes" 
            activities={recentActivities} 
          />
        )}
        
        {tasksLoading ? (
          <Skeleton className="h-80" />
        ) : (
          <PendingTasksList 
            title="Tarefas Pendentes" 
            tasks={pendingTasks} 
            onMarkComplete={handleMarkTaskComplete}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
