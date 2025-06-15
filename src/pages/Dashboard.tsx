import React, { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle,
  ClipboardList,
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import AreaChart from "@/components/dashboard/AreaChart";
import BarChart from "@/components/dashboard/BarChart";
import RecentActivitiesList from "@/components/dashboard/RecentActivitiesList";
import PendingTasksList from "@/components/dashboard/PendingTasksList";
import SystemLogo from "@/components/common/SystemLogo";
import { supabase } from "@/integrations/supabase/client";

// Hook para buscar contagem de desvios
function useTotalDesvios() {
  const [total, setTotal] = useState<number | null>(null);
  useEffect(() => {
    supabase
      .from("desvios_completos")
      .select("*", { count: "exact", head: true })
      .then(({ count }) => setTotal(count || 0));
  }, []);
  return total;
}

// Hook para buscar contagem de treinamentos do mês atual
function useTotalTreinamentosMes() {
  const [total, setTotal] = useState<number | null>(null);
  useEffect(() => {
    const dt = new Date();
    const mes = dt.getMonth() + 1;
    const ano = dt.getFullYear();
    supabase
      .from("execucao_treinamentos")
      .select("*", { count: "exact", head: true })
      .eq("mes", mes)
      .eq("ano", ano)
      .then(({ count }) => setTotal(count || 0));
  }, []);
  return total;
}

// Hook para buscar número de ocorrências do mês atual
function useTotalOcorrenciasMes() {
  const [total, setTotal] = useState<number | null>(null);
  useEffect(() => {
    const dt = new Date();
    const mes = dt.getMonth() + 1;
    const ano = dt.getFullYear();
    supabase
      .from("ocorrencias")
      .select("id", { count: "exact", head: true })
      .eq("mes", mes)
      .eq("ano", ano)
      .then(({ count }) => setTotal(count || 0));
  }, []);
  return total;
}

// Hook para buscar número de tarefas pendentes
function useTotalTarefasPendentes() {
  const [total, setTotal] = useState<number | null>(null);
  useEffect(() => {
    supabase
      .from("tarefas")
      .select("id", { count: "exact", head: true })
      .in("status", ["pendente", "em_andamento"])
      .then(({ count }) => setTotal(count || 0));
  }, []);
  return total;
}

// Mock data for charts
const areaChartData = [
  { name: "Jan", value: 12 },
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

// Mock data for recent activities
const recentActivities = [
  {
    id: "1",
    title: "Novo desvio registrado",
    description: "Desvio de segurança reportado na área de operações",
    timestamp: "Hoje, 10:45",
    status: "warning" as const,
  },
  {
    id: "2",
    title: "Treinamento programado",
    description: "Treinamento normativo para equipe de manutenção",
    timestamp: "Hoje, 09:30",
    status: "info" as const,
  },
  {
    id: "3",
    title: "Inspeção concluída",
    description: "Inspeção de segurança concluída no setor administrativo",
    timestamp: "Ontem, 15:20",
    status: "success" as const,
  },
  {
    id: "4",
    title: "Ocorrência reportada",
    description: "Ocorrência de incidente leve relatada no almoxarifado",
    timestamp: "Ontem, 11:15",
    status: "error" as const,
  },
];

// Mock data for pending tasks
const pendingTasks = [
  {
    id: "1",
    title: "Revisão de procedimentos de segurança",
    dueDate: "Hoje, 17:00",
    priority: "high" as const,
    status: "pending" as const,
  },
  {
    id: "2",
    title: "Validar registro de treinamentos do mês",
    dueDate: "Amanhã, 12:00",
    priority: "medium" as const,
    status: "in-progress" as const,
  },
  {
    id: "3",
    title: "Atualizar documentação de EPIs",
    dueDate: "28/04/2025",
    priority: "medium" as const,
    status: "pending" as const,
  },
  {
    id: "4",
    title: "Programar hora da segurança semanal",
    dueDate: "30/04/2025",
    priority: "low" as const,
    status: "pending" as const,
  },
];

const Dashboard = () => {
  const totalDesvios = useTotalDesvios();
  const totalTreinamentos = useTotalTreinamentosMes();
  const totalOcorrencias = useTotalOcorrenciasMes();
  const totalTarefas = useTotalTarefasPendentes();

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
        <StatCard
          title="Desvios"
          value={totalDesvios === null ? "..." : totalDesvios.toString()}
          icon={<AlertTriangle className="h-4 w-4" />}
          description="Total de desvios no mês atual"
          trend="up"
          trendValue="12%"
          loading={totalDesvios === null}
        />
        <StatCard
          title="Treinamentos"
          value={totalTreinamentos === null ? "..." : totalTreinamentos.toString()}
          icon={<Calendar className="h-4 w-4" />}
          description="Treinamentos realizados no mês"
          trend="up"
          trendValue="8%"
          loading={totalTreinamentos === null}
        />
        <StatCard
          title="Ocorrências"
          value={totalOcorrencias === null ? "..." : totalOcorrencias.toString()}
          icon={<Activity className="h-4 w-4" />}
          description="Ocorrências registradas no mês"
          trend="down"
          trendValue="5%"
          loading={totalOcorrencias === null}
        />
        <StatCard
          title="Tarefas"
          value={totalTarefas === null ? "..." : totalTarefas.toString()}
          icon={<ClipboardList className="h-4 w-4" />}
          description="Tarefas pendentes no sistema"
          trend="neutral"
          trendValue="2%"
          loading={totalTarefas === null}
        />
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
        <RecentActivitiesList 
          title="Atividades Recentes" 
          activities={recentActivities} 
        />
        <PendingTasksList 
          title="Tarefas Pendentes" 
          tasks={pendingTasks} 
          onMarkComplete={(taskId) => console.log(`Marcar tarefa ${taskId} como concluída`)}
        />
      </div>
    </div>
  );
};

export default Dashboard;
