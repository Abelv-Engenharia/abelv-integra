
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, FileText, User } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const VisualizarFuncionario = () => {
  const { id } = useParams();

  // Mock data - em uma aplicação real, isso viria de uma API
  const funcionario = {
    id: id,
    nome: "João Silva Santos",
    cpf: "123.456.789-00",
    rg: "12.345.678-9",
    email: "joao.silva@empresa.com",
    telefone: "(11) 99999-9999",
    empresa: "Empresa Terceirizada Ltda",
    funcao: "Técnico em Segurança",
    dataAdmissao: "2023-01-15",
    status: "Ativo",
    observacoes: "Funcionário experiente com certificações em segurança do trabalho."
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/terceiros/funcionarios">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Visualizar Funcionário</h1>
          </div>
          <p className="text-muted-foreground">
            Detalhes do funcionário terceirizado
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link to={`/terceiros/funcionarios/editar/${id}`}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Dados Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nome Completo</label>
                  <p className="font-medium">{funcionario.nome}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">CPF</label>
                  <p className="font-medium">{funcionario.cpf}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">RG</label>
                  <p className="font-medium">{funcionario.rg}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="font-medium">{funcionario.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Telefone</label>
                  <p className="font-medium">{funcionario.telefone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dados Profissionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Empresa</label>
                  <p className="font-medium">{funcionario.empresa}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Função</label>
                  <p className="font-medium">{funcionario.funcao}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data de Admissão</label>
                  <p className="font-medium">{new Date(funcionario.dataAdmissao).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge variant={funcionario.status === 'Ativo' ? 'default' : 'secondary'}>
                      {funcionario.status}
                    </Badge>
                  </div>
                </div>
              </div>
              {funcionario.observacoes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Observações</label>
                  <p className="font-medium mt-1">{funcionario.observacoes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Documentação
              </CardTitle>
              <CardDescription>
                Status dos documentos obrigatórios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">ASO</span>
                  <Badge variant="default">Em dia</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Integração</span>
                  <Badge variant="default">Em dia</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Certificações</span>
                  <Badge variant="secondary">Pendente</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Ver Documentos
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Edit className="h-4 w-4 mr-2" />
                Editar Dados
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VisualizarFuncionario;
