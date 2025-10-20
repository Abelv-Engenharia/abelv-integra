import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KanbanSquare, Users, FileText, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const RequisicoesServicos = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">Sistema de Requisições de Serviços</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Administrador</span>
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                A
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Painel de Requisições
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Gerencie e acompanhe todas as requisições de serviços de forma eficiente
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <KanbanSquare className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Acompanhamento</CardTitle>
              <CardDescription>
                Visualize todas as requisições em formato Kanban
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/acompanhamento-requisicoes">
                <Button className="w-full">Acessar</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <CardTitle className="text-lg">Usuários</CardTitle>
              <CardDescription>
                Gerencie usuários e permissões do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Em breve
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <CardTitle className="text-lg">Relatórios</CardTitle>
              <CardDescription>
                Gere relatórios detalhados das requisições
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Em breve
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <CardTitle className="text-lg">Analytics</CardTitle>
              <CardDescription>
                Acompanhe métricas e indicadores de performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Em breve
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">12</div>
              <div className="text-sm text-muted-foreground">Pendentes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">8</div>
              <div className="text-sm text-muted-foreground">Em análise</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">5</div>
              <div className="text-sm text-muted-foreground">Aguardando</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">23</div>
              <div className="text-sm text-muted-foreground">Resolvidos</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default RequisicoesServicos;