
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Download, FileText, Users, AlertTriangle } from "lucide-react";

const Relatorios = () => {
  const relatorios = [
    {
      id: "funcionarios-ativos",
      nome: "Funcionários Ativos",
      descricao: "Lista de todos os funcionários terceirizados ativos",
      icon: Users
    },
    {
      id: "documentos-vencidos",
      nome: "Documentos Vencidos",
      descricao: "Relatório de documentos com validade vencida",
      icon: AlertTriangle
    },
    {
      id: "documentos-vencendo",
      nome: "Documentos Vencendo",
      descricao: "Documentos que vencem nos próximos 30 dias",
      icon: FileText
    },
    {
      id: "conformidade-empresa",
      nome: "Conformidade por Empresa",
      descricao: "Status de conformidade documental por empresa",
      icon: FileText
    }
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios - Terceiros</h1>
          <p className="text-muted-foreground">
            Gere relatórios sobre funcionários e documentação
          </p>
        </div>
      </div>

      <div className="grid gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Filtros de Relatório</CardTitle>
            <CardDescription>
              Configure os filtros para gerar relatórios personalizados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Empresa</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as empresas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as empresas</SelectItem>
                    <SelectItem value="empresa1">Empresa Terceirizada Ltda</SelectItem>
                    <SelectItem value="empresa2">Prestadora de Serviços SA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Período</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Último mês" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mes">Último mês</SelectItem>
                    <SelectItem value="trimestre">Último trimestre</SelectItem>
                    <SelectItem value="semestre">Último semestre</SelectItem>
                    <SelectItem value="ano">Último ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os status</SelectItem>
                    <SelectItem value="ativo">Ativos</SelectItem>
                    <SelectItem value="inativo">Inativos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {relatorios.map((relatorio) => {
          const IconComponent = relatorio.icon;
          return (
            <Card key={relatorio.id}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <IconComponent className="h-5 w-5 mr-2" />
                  {relatorio.nome}
                </CardTitle>
                <CardDescription>
                  {relatorio.descricao}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Button className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Gerar PDF
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Gerar Excel
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Estatísticas Rápidas</CardTitle>
          <CardDescription>
            Visão geral dos dados de terceiros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">0</div>
              <p className="text-sm text-muted-foreground">Funcionários Ativos</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">0</div>
              <p className="text-sm text-muted-foreground">Documentos Vencidos</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">0</div>
              <p className="text-sm text-muted-foreground">Documentos Vencendo</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">100%</div>
              <p className="text-sm text-muted-foreground">Taxa de Conformidade</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Relatorios;
