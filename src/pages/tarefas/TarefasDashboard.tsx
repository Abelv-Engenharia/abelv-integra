
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TarefasSummaryCards from "@/components/tarefas/TarefasSummaryCards";
import TarefasBarChart from "@/components/tarefas/TarefasBarChart";
import TarefasPieChart from "@/components/tarefas/TarefasPieChart";
import TarefasCriticidadeChart from "@/components/tarefas/TarefasCriticidadeChart";
import TarefasStatusPorUsuarioChart from "@/components/tarefas/TarefasStatusPorUsuarioChart";

const TarefasDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Dashboard de Tarefas</h1>
        <p className="text-muted-foreground">
          Visão geral das tarefas e indicadores de desempenho
        </p>
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
          <CardTitle>Status de Tarefas por Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <TarefasStatusPorUsuarioChart />
        </CardContent>
      </Card>
    </div>
  );
};

export default TarefasDashboard;
