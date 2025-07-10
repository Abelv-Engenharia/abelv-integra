
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TarefasSummaryCards from "@/components/tarefas/TarefasSummaryCards";
import TarefasBarChart from "@/components/tarefas/TarefasBarChart";
import TarefasPieChart from "@/components/tarefas/TarefasPieChart";
import TarefasCriticidadeChart from "@/components/tarefas/TarefasCriticidadeChart";
import TarefasRecentTable from "@/components/tarefas/TarefasRecentTable";
import { useAuth } from "@/contexts/AuthContext";

const TarefasDashboard = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log("TarefasDashboard - Component mounted");
    console.log("TarefasDashboard - User:", user?.id);
    console.log("TarefasDashboard - Loading:", loading);
  }, [user, loading]);

  if (loading) {
    console.log("TarefasDashboard - Showing loading state");
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log("TarefasDashboard - No user found");
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p>Usuário não encontrado</p>
        </div>
      </div>
    );
  }

  console.log("TarefasDashboard - Rendering main content");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Dashboard de Tarefas</h1>
        <p className="text-muted-foreground">
          Visão geral das tarefas e indicadores de desempenho
        </p>
        <p className="text-xs text-gray-500">Debug: Usuário {user.id} logado</p>
      </div>

      <TarefasSummaryCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tarefas por Período</CardTitle>
          </CardHeader>
          <CardContent>
            <TarefasBarChart />
          </CardContent>
        </Card>

        <Tabs defaultValue="status">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <CardTitle>Distribuição de Tarefas</CardTitle>
              <TabsList className="ml-auto">
                <TabsTrigger value="status">Por Status</TabsTrigger>
                <TabsTrigger value="criticidade">Por Criticidade</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="status">
                <TarefasPieChart />
              </TabsContent>
              <TabsContent value="criticidade">
                <TarefasCriticidadeChart />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tarefas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <TarefasRecentTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default TarefasDashboard;
