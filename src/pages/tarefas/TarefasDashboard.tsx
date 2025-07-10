
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Tarefas Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tarefas em Andamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-muted-foreground">Atualizadas recentemente</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tarefas Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-muted-foreground">Necessitando atenção</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tarefas Programadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-muted-foreground">Para os próximos 30 dias</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">✅ Dashboard carregado com sucesso</p>
            <p className="text-sm">✅ Usuário autenticado: {user.email}</p>
            <p className="text-sm">✅ Componentes básicos funcionando</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TarefasDashboard;
