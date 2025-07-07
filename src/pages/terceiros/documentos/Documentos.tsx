
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, AlertTriangle } from "lucide-react";

const Documentos = () => {
  const documentos = [
    {
      id: 1,
      nome: "ASO - João Silva",
      tipo: "ASO",
      funcionario: "João Silva Santos",
      empresa: "Empresa Terceirizada Ltda",
      dataVencimento: "2024-06-15",
      status: "vencido"
    },
    {
      id: 2,
      nome: "Integração - Maria Santos",
      tipo: "Integração",
      funcionario: "Maria Santos Oliveira",
      empresa: "Empresa Terceirizada Ltda",
      dataVencimento: "2024-12-30",
      status: "ativo"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativo":
        return <Badge variant="default">Em dia</Badge>;
      case "vencido":
        return <Badge variant="destructive">Vencido</Badge>;
      case "vencendo":
        return <Badge variant="secondary">Vencendo</Badge>;
      default:
        return <Badge variant="outline">Indefinido</Badge>;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documentos</h1>
          <p className="text-muted-foreground">
            Gerencie a documentação dos funcionários terceirizados
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Documentos
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documentos.length}</div>
            <p className="text-xs text-muted-foreground">
              documentos cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Documentos Vencidos
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {documentos.filter(d => d.status === 'vencido').length}
            </div>
            <p className="text-xs text-muted-foreground">
              requerem atenção
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Em Conformidade
            </CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {documentos.filter(d => d.status === 'ativo').length}
            </div>
            <p className="text-xs text-muted-foreground">
              documentos válidos
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Documentos</CardTitle>
          <CardDescription>
            Todos os documentos dos funcionários terceirizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documentos.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">{doc.nome}</h4>
                    <p className="text-sm text-muted-foreground">
                      {doc.funcionario} - {doc.empresa}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Vencimento: {new Date(doc.dataVencimento).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(doc.status)}
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Documentos;
