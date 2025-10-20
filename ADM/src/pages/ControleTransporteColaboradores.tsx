import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  TrendingUp, 
  AlertTriangle, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Upload,
  Download,
  Calculator,
  Send,
  Eye,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

// Mock data
const mockDashboardData = {
  obraslancadas: 85,
  obrassemlancamento: 15,
  alertasabertos: 8,
  custototalmes: 245830
};

const mockAlertas = [
  {
    id: 1,
    tipo: "Competência sem lançamento",
    obra: "Obra Alpha - CCA001",
    competencia: "2024-02",
    severidade: "Alta",
    descricao: "Obra sem lançamento até D+2"
  },
  {
    id: 2,
    tipo: "Divergência > tolerância",
    obra: "Obra Beta - CCA002", 
    competencia: "2024-03",
    severidade: "Média",
    descricao: "Valor NF 15% acima da meta"
  }
];

const mockMedicoes = [
  {
    id: 1,
    obra: "Obra Alpha - CCA001",
    fornecedor: "Transportes Rápido Ltda",
    competencia: "2024-03",
    valormeta: 12500,
    valornf: 13750,
    divergencia: -1250,
    status: "Validada",
    modal: "Ônibus"
  },
  {
    id: 2,
    obra: "Obra Beta - CCA002",
    fornecedor: "Van Express S/A",
    competencia: "2024-03", 
    valormeta: 8200,
    valornf: 8200,
    divergencia: 0,
    status: "Lançada",
    modal: "Van"
  }
];

const mockMetas = [
  {
    id: 1,
    obra: "Obra Alpha - CCA001",
    modal: "Ônibus",
    modelocobranca: "Mensal",
    valorunitario: 12500,
    tolerancia: 10,
    vigenciainicio: "2024-01-01",
    vigenciafim: "2024-12-31"
  },
  {
    id: 2,
    obra: "Obra Beta - CCA002", 
    modal: "Van",
    modelocobranca: "Por dia",
    valorunitario: 280,
    tolerancia: 15,
    vigenciainicio: "2024-01-01",
    vigenciafim: "2024-12-31"
  }
];

const mockNotasFiscais = [
  {
    id: 1,
    numero: "001234",
    serie: "1",
    fornecedor: "Transportes Rápido Ltda",
    obra: "Obra Alpha - CCA001",
    competencia: "2024-03",
    valor: 13750,
    dataemissao: "2024-03-05",
    status: "Aprovada",
    modal: "Ônibus"
  },
  {
    id: 2,
    numero: "005678", 
    serie: "2",
    fornecedor: "Van Express S/A",
    obra: "Obra Beta - CCA002",
    competencia: "2024-03",
    valor: 8200,
    dataemissao: "2024-03-08",
    status: "Pendente",
    modal: "Van"
  }
];

export default function ControleTransporteColaboradores() {
  const [competenciaselecionada, setCompetenciaSelecionada] = useState("2024-03");
  const [obraselecionada, setObraSelecionada] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleValidarMedicao = (id: number) => {
    toast.success("Medição validada com sucesso");
  };

  const handleLancarSienge = (id: number) => {
    toast.success("Lançamento enviado ao Sienge");
  };

  const handleExportar = () => {
    toast.success("Relatório exportado com sucesso");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Controle de transporte de colaboradores</h1>
          <p className="text-muted-foreground">
            Gerenciamento de notas fiscais e custos de transporte por obra
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={competenciaselecionada} onValueChange={setCompetenciaSelecionada}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Competência" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-01">Jan/2024</SelectItem>
              <SelectItem value="2024-02">Fev/2024</SelectItem>
              <SelectItem value="2024-03">Mar/2024</SelectItem>
            </SelectContent>
          </Select>

          <Select value={obraselecionada} onValueChange={setObraSelecionada}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por obra" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as obras</SelectItem>
              <SelectItem value="cca001">Obra Alpha - CCA001</SelectItem>
              <SelectItem value="cca002">Obra Beta - CCA002</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="medicoes">Medições</TabsTrigger>
          <TabsTrigger value="metas">Metas</TabsTrigger>
          <TabsTrigger value="notas">Notas fiscais</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Obras com nf lançada</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {mockDashboardData.obraslancadas}
                </div>
                <p className="text-xs text-muted-foreground">No mês atual</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Obras sem lançamento</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {mockDashboardData.obrassemlancamento}
                </div>
                <p className="text-xs text-muted-foreground">Pendentes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Alertas abertos</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {mockDashboardData.alertasabertos}
                </div>
                <p className="text-xs text-muted-foreground">Requerem atenção</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Custo total do mês</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  R$ {mockDashboardData.custototalmes.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Todas as obras</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resumo por obra</CardTitle>
              <CardDescription>Status das medições e lançamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Obra</TableHead>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead>Modal</TableHead>
                      <TableHead>Valor meta</TableHead>
                      <TableHead>Valor nf</TableHead>
                      <TableHead>Divergência</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockMedicoes.map((medicao) => (
                      <TableRow key={medicao.id}>
                        <TableCell className="font-medium">{medicao.obra}</TableCell>
                        <TableCell>{medicao.fornecedor}</TableCell>
                        <TableCell>{medicao.modal}</TableCell>
                        <TableCell>R$ {medicao.valormeta.toLocaleString()}</TableCell>
                        <TableCell>R$ {medicao.valornf.toLocaleString()}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            medicao.divergencia === 0 ? 'text-green-600' :
                            medicao.divergencia < 0 ? 'text-red-600' : 'text-blue-600'
                          }`}>
                            {medicao.divergencia === 0 ? 'R$ 0' : 
                             medicao.divergencia < 0 ? `-R$ ${Math.abs(medicao.divergencia).toLocaleString()}` :
                             `R$ ${medicao.divergencia.toLocaleString()}`}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            medicao.status === 'Lançada' ? 'default' : 
                            medicao.status === 'Validada' ? 'secondary' : 'destructive'
                          }>
                            {medicao.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {medicao.status !== 'Lançada' && (
                              <Button size="sm" variant="outline" onClick={() => handleValidarMedicao(medicao.id)}>
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medicoes" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Medições de transporte</CardTitle>
                <CardDescription>Validação e lançamento de medições</CardDescription>
              </div>
              <Button>
                <Calculator className="mr-2 h-4 w-4" />
                Montar medição
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Competência</TableHead>
                      <TableHead>Obra</TableHead>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead>Valor esperado</TableHead>
                      <TableHead>Valor nf</TableHead>
                      <TableHead>Divergência</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockMedicoes.map((medicao) => (
                      <TableRow key={medicao.id}>
                        <TableCell>{medicao.competencia}</TableCell>
                        <TableCell className="font-medium">{medicao.obra}</TableCell>
                        <TableCell>{medicao.fornecedor}</TableCell>
                        <TableCell>R$ {medicao.valormeta.toLocaleString()}</TableCell>
                        <TableCell>R$ {medicao.valornf.toLocaleString()}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            medicao.divergencia === 0 ? 'text-green-600' :
                            medicao.divergencia < 0 ? 'text-red-600' : 'text-blue-600'
                          }`}>
                            {medicao.divergencia === 0 ? 'R$ 0' : 
                             medicao.divergencia < 0 ? `-R$ ${Math.abs(medicao.divergencia).toLocaleString()}` :
                             `R$ ${medicao.divergencia.toLocaleString()}`}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            medicao.status === 'Lançada' ? 'default' : 
                            medicao.status === 'Validada' ? 'secondary' : 'destructive'
                          }>
                            {medicao.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            {medicao.status === 'Validada' && (
                              <Button size="sm" onClick={() => handleLancarSienge(medicao.id)}>
                                <Send className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metas" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Metas de custo por transporte</CardTitle>
                <CardDescription>Configuração de valores de referência</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova meta
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Obra</TableHead>
                      <TableHead>Modal</TableHead>
                      <TableHead>Modelo cobrança</TableHead>
                      <TableHead>Valor unitário</TableHead>
                      <TableHead>Tolerância (%)</TableHead>
                      <TableHead>Vigência</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockMetas.map((meta) => (
                      <TableRow key={meta.id}>
                        <TableCell className="font-medium">{meta.obra}</TableCell>
                        <TableCell>{meta.modal}</TableCell>
                        <TableCell>{meta.modelocobranca}</TableCell>
                        <TableCell>R$ {meta.valorunitario.toLocaleString()}</TableCell>
                        <TableCell>{meta.tolerancia}%</TableCell>
                        <TableCell>{meta.vigenciainicio} a {meta.vigenciafim}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notas" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Notas fiscais</CardTitle>
                <CardDescription>Upload e gerenciamento de nfs</CardDescription>
              </div>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload nf
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Série</TableHead>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead>Obra</TableHead>
                      <TableHead>Competência</TableHead>
                      <TableHead>Modal</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockNotasFiscais.map((nf) => (
                      <TableRow key={nf.id}>
                        <TableCell className="font-medium">{nf.numero}</TableCell>
                        <TableCell>{nf.serie}</TableCell>
                        <TableCell>{nf.fornecedor}</TableCell>
                        <TableCell>{nf.obra}</TableCell>
                        <TableCell>{nf.competencia}</TableCell>
                        <TableCell>{nf.modal}</TableCell>
                        <TableCell>R$ {nf.valor.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={
                            nf.status === 'Aprovada' ? 'default' : 
                            nf.status === 'Pendente' ? 'secondary' : 'destructive'
                          }>
                            {nf.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alertas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alertas automáticos</CardTitle>
              <CardDescription>Monitoramento de divergências e ausências</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockAlertas.map((alerta) => (
                <Alert key={alerta.id} className={
                  alerta.severidade === 'Alta' ? 'border-red-500 bg-red-50' :
                  alerta.severidade === 'Média' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                }>
                  <AlertTriangle className={`h-4 w-4 ${
                    alerta.severidade === 'Alta' ? 'text-red-600' :
                    alerta.severidade === 'Média' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`} />
                  <AlertDescription className="flex justify-between items-center">
                    <div>
                      <strong>{alerta.tipo}</strong> - {alerta.obra}
                      <br />
                      <span className="text-sm text-muted-foreground">
                        Competência: {alerta.competencia} | {alerta.descricao}
                      </span>
                    </div>
                    <Badge variant={
                      alerta.severidade === 'Alta' ? 'destructive' :
                      alerta.severidade === 'Média' ? 'secondary' : 'default'
                    }>
                      {alerta.severidade}
                    </Badge>
                  </AlertDescription>
                </Alert>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios e exportações</CardTitle>
              <CardDescription>Geração de relatórios consolidados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Consolidado por obra</h4>
                    <p className="text-sm text-muted-foreground">
                      Resumo mensal de todas as obras
                    </p>
                    <Button className="w-full" onClick={handleExportar}>
                      <Download className="mr-2 h-4 w-4" />
                      Exportar pdf
                    </Button>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Custo por fornecedor</h4>
                    <p className="text-sm text-muted-foreground">
                      Análise de custos por prestador
                    </p>
                    <Button className="w-full" variant="outline" onClick={handleExportar}>
                      <Download className="mr-2 h-4 w-4" />
                      Exportar excel
                    </Button>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Histórico 12 meses</h4>
                    <p className="text-sm text-muted-foreground">
                      Evolução por obra e modal
                    </p>
                    <Button className="w-full" variant="outline" onClick={handleExportar}>
                      <Download className="mr-2 h-4 w-4" />
                      Exportar pdf
                    </Button>
                  </div>
                </Card>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="periodo">Período</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o período" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mes-atual">Mês atual</SelectItem>
                        <SelectItem value="trimestre">Último trimestre</SelectItem>
                        <SelectItem value="semestre">Último semestre</SelectItem>
                        <SelectItem value="ano">Último ano</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1">
                    <Label htmlFor="formato">Formato</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Formato do arquivo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleExportar} className="w-full sm:w-auto">
                  <FileText className="mr-2 h-4 w-4" />
                  Gerar relatório personalizado
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}