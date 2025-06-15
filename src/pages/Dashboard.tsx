import React, { useCallback, useEffect, useState } from "react";
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
import { toast } from "@/hooks/use-toast";

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

// Hook para buscar atividades recentes usando "desvios_completos"
function useRecentActivitiesFromDesvios() {
  const [activities, setActivities] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Busca os desvios mais recentes e formata para o componente
    async function fetchActivities() {
      setLoading(true);
      const { data, error } = await supabase
        .from("desvios_completos")
        .select("id, descricao_desvio, data_desvio, status")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        setActivities([]);
        setLoading(false);
        return;
      }

      // Mapear status para tipos de atividades
      const statusMap: Record<string, any> = {
        "Aberto": "warning",
        "Fechado": "success",
        "Concluido": "success",
        "Concluída": "success",
        "Em Andamento": "info",
        "Pendente": "warning",
        "Intolerável": "error",
        "Intoleravel": "error",
      };

      setActivities(
        (data || []).map((desvio) => ({
          id: desvio.id,
          title: "Novo desvio registrado",
          description: desvio.descricao_desvio?.slice(0, 60) ?? "",
          timestamp: desvio.data_desvio
            ? new Date(desvio.data_desvio).toLocaleDateString("pt-BR")
            : "",
          status: statusMap[desvio.status || ""] || "info",
        }))
      );
      setLoading(false);
    }
    fetchActivities();
  }, []);
  return { activities, loading };
}

// Hook para buscar tarefas pendentes do Supabase
function usePendingTasksFromSupabase() {
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      const { data, error } = await supabase
        .from("tarefas")
        .select(
          `
            id,
            titulo,
            descricao,
            data_conclusao,
            status,
            configuracao,
            responsavel_id,
            profiles!inner(id, nome)
          `
        )
        .in("status", ["pendente", "em_andamento"])
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        setTasks([]);
        setLoading(false);
        return;
      }

      setTasks(
        (data || []).map((t: any) => ({
          id: t.id,
          title: t.titulo || t.descricao?.slice(0, 40) || "Tarefa sem título",
          dueDate: t.data_conclusao
            ? new Date(t.data_conclusao).toLocaleDateString("pt-BR")
            : "",
          priority:
            t?.configuracao?.criticidade ||
            (t?.configuracao && t.configuracao["criticidade"]) ||
            "media",
          status:
            t.status === "em_andamento"
              ? "in-progress"
              : t.status === "pendente"
              ? "pending"
              : t.status === "concluida"
              ? "completed"
              : t.status || "pending",
          responsavel:
            t.profiles?.nome || "Não atribuído",
        }))
      );
      setLoading(false);
    }
    fetchTasks();
  }, []);

  return { tasks, loading, setTasks };
}

const Dashboard = () => {
  const totalDesvios = useTotalDesvios();
  const totalTreinamentos = useTotalTreinamentosMes();
  const totalOcorrencias = useTotalOcorrenciasMes();
  const totalTarefas = useTotalTarefasPendentes();

  const { activities, loading: loadingActivities } = useRecentActivitiesFromDesvios();
  const { tasks, loading: loadingTasks, setTasks } = usePendingTasksFromSupabase();

  // Função para concluir tarefa via Supabase
  const handleMarkTaskComplete = useCallback(
    async (taskId: string) => {
      const { error } = await supabase
        .from("tarefas")
        .update({ status: "concluida", data_real_conclusao: new Date().toISOString() })
        .eq("id", taskId);
      if (error) {
        toast({
          title: "Erro ao concluir tarefa",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      // Remover do state para um refresh rápido, sem recarregar tudo
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      toast({
        title: "Tarefa concluída",
        description: "Tarefa marcada como concluída com sucesso",
      });
    },
    [setTasks]
  );

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
        <RecentActivitiesList
          title="Atividades Recentes"
          activities={loadingActivities ? [] : activities}
        />
        <PendingTasksList
          title="Tarefas Pendentes"
          tasks={loadingTasks ? [] : tasks}
          onMarkComplete={handleMarkTaskComplete}
        />
      </div>
    </div>
  );
};

export default Dashboard;
