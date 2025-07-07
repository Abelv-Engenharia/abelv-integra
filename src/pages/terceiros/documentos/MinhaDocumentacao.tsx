
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Download, Eye } from "lucide-react";

const MinhaDocumentacao = () => {
  const meusDocumentos = [
    {
      id: 1,
      nome: "ASO Atual",
      tipo: "ASO",
      dataVencimento: "2024-06-15",
      status: "vencido",
      arquivo: "aso_2023.pdf"
    },
    {
      id: 2,
      nome: "Certificado de Integração",
      tipo: "Integração",
      dataVencimento: "2024-12-30",
      status: "ativo",
      arquivo: "integracao_2024.pdf"
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
          <h1 className="text-3xl font-bold tracking-tight">Minha Documentação</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie seus documentos pessoais
          </p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Enviar Documento
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Meus Documentos
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meusDocumentos.length}</div>
            <p className="text-xs text-muted-foreground">
              documentos cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Situação Geral
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">Atenção</div>
            <p className="text-xs text-muted-foreground">
              documentos pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Próximo Vencimento
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15 Jun</div>
            <p className="text-xs text-muted-foreground">
              ASO vencendo
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meus Documentos</CardTitle>
          <CardDescription>
            Lista de todos os seus documentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {meusDocumentos.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">{doc.nome}</h4>
                    <p className="text-sm text-muted-foreground">
                      Tipo: {doc.tipo}
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
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Atualizar
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

export default MinhaDocumentacao;
