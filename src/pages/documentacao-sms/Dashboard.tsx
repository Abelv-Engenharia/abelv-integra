import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, File, ClipboardList, Users, Activity, TrendingUp } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Documentação SMS</h1>
          <p className="text-muted-foreground mt-1">
            Geração automatizada de documentos com dados do sistema
          </p>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentos Gerados</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Total de documentos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modelos Ativos</CardTitle>
            <File className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Templates disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turmas Ativas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Treinamentos em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Documentos gerados</p>
          </CardContent>
        </Card>
      </div>

      {/* Atalhos Rápidos */}
      <Card>
        <CardHeader>
          <CardTitle>Atalhos Rápidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <a
              href="/documentacao-sms/ordem-servico"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <ClipboardList className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Ordem de Serviço</p>
                <p className="text-sm text-muted-foreground">Emitir OS</p>
              </div>
            </a>

            <a
              href="/documentacao-sms/termo-altura"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Termo Altura</p>
                <p className="text-sm text-muted-foreground">Trabalho em altura</p>
              </div>
            </a>

            <a
              href="/documentacao-sms/lista-presenca"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Lista de Presença</p>
                <p className="text-sm text-muted-foreground">Treinamentos</p>
              </div>
            </a>

            <a
              href="/documentacao-sms/certificados"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <File className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Certificados</p>
                <p className="text-sm text-muted-foreground">Emitir certificados</p>
              </div>
            </a>

            <a
              href="/documentacao-sms/turmas"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Turmas</p>
                <p className="text-sm text-muted-foreground">Gerenciar turmas</p>
              </div>
            </a>

            <a
              href="/documentacao-sms/riscos-funcao"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Riscos por Função</p>
                <p className="text-sm text-muted-foreground">Cadastrar riscos</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Últimos Documentos Gerados */}
      <Card>
        <CardHeader>
          <CardTitle>Últimos Documentos Gerados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum documento gerado ainda</p>
            <p className="text-sm mt-1">Comece emitindo documentos pelos atalhos acima</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
