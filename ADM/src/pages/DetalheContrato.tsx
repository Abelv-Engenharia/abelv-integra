import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, FileText, History, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Dados mockados do contrato
const getContratoById = (id: string) => {
  const contratos = {
    "1": {
      id: 1,
      fornecedor: "Pousada Boa Vista Ltda",
      fornecedorId: 1,
      projeto: "Obra Norte",
      numeroContrato: "CT-2024-001",
      dataInicio: "2024-01-01",
      dataTermino: "2024-12-31",
      valorDiario: 45.00,
      statusVigencia: "Vigente",
      versao: "1.0",
      ultimaAtualizacao: "2024-01-15",
      observacoes: "Contrato padrão para alojamento de colaboradores da Obra Norte. Inclui café da manhã e limpeza.",
      arquivoContrato: "CT-2024-001_v1.0.pdf",
      usuarioCriacao: "compras@empresa.com",
      dataCriacao: "2024-01-01"
    },
    "2": {
      id: 2,
      fornecedor: "Pousada Boa Vista Ltda",
      fornecedorId: 1,
      projeto: "Obra Sul",
      numeroContrato: "CT-2024-002",
      dataInicio: "2024-02-01",
      dataTermino: "2024-11-30",
      valorDiario: 50.00,
      statusVigencia: "Vigente",
      versao: "1.1",
      ultimaAtualizacao: "2024-02-01",
      observacoes: "Contrato com valor negociado superior devido à localização premium.",
      arquivoContrato: "CT-2024-002_v1.1.pdf",
      usuarioCriacao: "compras@empresa.com",
      dataCriacao: "2024-02-01"
    }
  };
  return contratos[id as keyof typeof contratos];
};

// Histórico de versões mockado
const historicoVersoes = [
  {
    id: 1,
    versao: "1.1",
    data: "2024-02-01",
    usuario: "compras@empresa.com",
    alteracao: "Atualização de valor diário de R$ 45,00 para R$ 50,00",
    arquivo: "CT-2024-002_v1.1.pdf"
  },
  {
    id: 2,
    versao: "1.0",
    data: "2024-01-01",
    usuario: "compras@empresa.com",
    alteracao: "Versão inicial do contrato",
    arquivo: "CT-2024-002_v1.0.pdf"
  }
];

export default function DetalheContrato() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const contrato = getContratoById(id || "");

  if (!contrato) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold">Contrato não encontrado</h2>
            <Button onClick={() => navigate(-1)} className="mt-4">
              Voltar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getVigenciaColor = (status: string) => {
    switch (status) {
      case "Vigente": return "bg-green-100 text-green-700";
      case "A vencer": return "bg-yellow-100 text-yellow-700";
      case "Vencido": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleDownloadContrato = () => {
    // Mock download - em um sistema real, seria um link para o arquivo
    console.log(`Downloading: ${contrato.arquivoContrato}`);
    alert(`Download iniciado: ${contrato.arquivoContrato}`);
  };

  const calcularDiasVigencia = () => {
    const inicio = new Date(contrato.dataInicio);
    const fim = new Date(contrato.dataTermino);
    const diffTime = fim.getTime() - inicio.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calcularValorTotal = () => {
    const dias = calcularDiasVigencia();
    return dias * contrato.valorDiario;
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(`/fornecedor/${contrato.fornecedorId}`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Fornecedor
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{contrato.numeroContrato}</h1>
              <p className="text-muted-foreground">{contrato.fornecedor} • {contrato.projeto}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDownloadContrato}>
              <Download className="h-4 w-4 mr-2" />
              Download Contrato
            </Button>
            <Button size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex gap-2">
          <Badge className={getVigenciaColor(contrato.statusVigencia)}>
            {contrato.statusVigencia}
          </Badge>
          <Badge variant="outline">
            Versão {contrato.versao}
          </Badge>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="detalhes" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="detalhes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Detalhes do Contrato
            </TabsTrigger>
            <TabsTrigger value="historico" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Histórico de Versões
            </TabsTrigger>
          </TabsList>

          {/* Aba Detalhes */}
          <TabsContent value="detalhes" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Contrato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Número do Contrato</label>
                    <p className="text-sm font-mono">{contrato.numeroContrato}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Projeto</label>
                    <p className="text-sm">{contrato.projeto}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Fornecedor</label>
                    <p className="text-sm">{contrato.fornecedor}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Versão</label>
                    <p className="text-sm">{contrato.versao}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vigência</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Data de Início</label>
                    <p className="text-sm">{new Date(contrato.dataInicio).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Data de Término</label>
                    <p className="text-sm">{new Date(contrato.dataTermino).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <Badge className={getVigenciaColor(contrato.statusVigencia)}>
                      {contrato.statusVigencia}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Duração</label>
                    <p className="text-sm">{calcularDiasVigencia()} dias</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Valores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Valor Diário Negociado</label>
                    <p className="text-sm text-lg font-semibold">R$ {contrato.valorDiario.toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Valor Total Estimado</label>
                    <p className="text-sm text-lg font-semibold text-primary">
                      R$ {calcularValorTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Arquivo e Sistema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Arquivo Anexado</label>
                    <div className="flex items-center gap-2 mt-1">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{contrato.arquivoContrato}</span>
                      <Button variant="ghost" size="sm" onClick={handleDownloadContrato}>
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Data de Criação</label>
                    <p className="text-sm">{new Date(contrato.dataCriacao).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Última Atualização</label>
                    <p className="text-sm">{new Date(contrato.ultimaAtualizacao).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Criado por</label>
                    <p className="text-sm">{contrato.usuarioCriacao}</p>
                  </div>
                </CardContent>
              </Card>

              {contrato.observacoes && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Observações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{contrato.observacoes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Aba Histórico de Versões */}
          <TabsContent value="historico" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Versões</CardTitle>
                <CardDescription>Todas as versões disponíveis para consulta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {historicoVersoes.map((versao) => (
                    <div key={versao.id} className="border-l-2 border-primary pl-4 pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">Versão {versao.versao}</h4>
                          {versao.versao === contrato.versao && (
                            <Badge variant="outline" className="text-xs">
                              Atual
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(versao.data).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{versao.alteracao}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <FileText className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{versao.arquivo}</span>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Por: {versao.usuario}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}