import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Download, 
  Edit, 
  Eye, 
  FileText, 
  Plus, 
  RefreshCw, 
  Search, 
  Trash2, 
  Upload,
  Users,
  Calculator,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ResumoCCRObra from "@/components/ResumoCCRObra";

const ControleAlimentacao = () => {
  const [competenciaAtual, setCompetenciaAtual] = useState("2024-01");
  const [obraSelecionada, setObraSelecionada] = useState("todas");
  const { toast } = useToast();

  // Dados mock
  const resumoCards = {
    obrasComNF: 15,
    obrasSemLancamento: 3,
    alertasAbertos: 7,
    custoTotal: 125000
  };

  const alertas = [
    {
      id: 1,
      tipo: "Divergência",
      obra: "CCA-001",
      fornecedor: "Alimenta Bem Ltda",
      competencia: "2024-01",
      descricao: "Divergência de custo acima da tolerância (15%)",
      severidade: "Alta",
      status: "Aberto"
    },
    {
      id: 2,
      tipo: "Pendência Quinzenal",
      obra: "CCA-002",
      fornecedor: "Refeições Express",
      competencia: "2024-01",
      descricao: "NF da 2ª quinzena não lançada",
      severidade: "Média",
      status: "Aberto"
    }
  ];

  const fornecedores = [
    {
      id: 1,
      razaoSocial: "Alimenta Bem Ltda",
      cnpj: "12.345.678/0001-90",
      periodicidade: "Mensal",
      valorUnitario: 15.50,
      tolerancia: 10,
      vigencia: "2024-12-31",
      status: "Ativo"
    },
    {
      id: 2,
      razaoSocial: "Refeições Express",
      cnpj: "98.765.432/0001-10",
      periodicidade: "Quinzenal",
      valorUnitario: 14.80,
      tolerancia: 8,
      vigencia: "2024-12-31",
      status: "Ativo"
    }
  ];

  const efetivoObra = [
    {
      id: 1,
      obra: "CCA-001",
      competencia: "2024-01",
      qtdColaboradores: 85,
      fonte: "Nydhus",
      dataAtualizacao: "2024-01-15",
      editavel: true
    },
    {
      id: 2,
      obra: "CCA-002",
      competencia: "2024-01",
      qtdColaboradores: 120,
      fonte: "Manual",
      dataAtualizacao: "2024-01-10",
      editavel: true
    }
  ];

  const notasFiscais = [
    {
      id: 1,
      numeroNF: "0000123",
      fornecedor: "Alimenta Bem Ltda",
      obra: "CCA-001",
      competencia: "2024-01",
      valorNF: 35875.00,
      qtdRefeicoes: 2550,
      custoUnitario: 14.07,
      dataEmissao: "2024-01-31",
      status: "Aprovada",
      arquivo: "nf_123.pdf"
    },
    {
      id: 2,
      numeroNF: "0000124",
      fornecedor: "Refeições Express",
      obra: "CCA-002",
      competencia: "2024-01",
      valorNF: 51840.00,
      qtdRefeicoes: 3600,
      custoUnitario: 14.40,
      dataEmissao: "2024-01-15",
      status: "Pendente",
      arquivo: "nf_124.pdf"
    }
  ];

  const medicoes = [
    {
      id: 1,
      obra: "CCA-001",
      fornecedor: "Alimenta Bem Ltda",
      competencia: "2024-01",
      qtdRefeicoes: 2550,
      valorUnitarioMeta: 15.50,
      valorEsperado: 39525.00,
      valorNF: 35875.00,
      divergencia: -3650.00,
      divergenciaPerc: -9.2,
      status: "Validada",
      dataValidacao: "2024-02-01"
    },
    {
      id: 2,
      obra: "CCA-002",
      fornecedor: "Refeições Express",
      competencia: "2024-01",
      qtdRefeicoes: 3600,
      valorUnitarioMeta: 14.80,
      valorEsperado: 53280.00,
      valorNF: 51840.00,
      divergencia: -1440.00,
      divergenciaPerc: -2.7,
      status: "Montada",
      dataValidacao: null
    }
  ];

  const handleAction = (action: string, item?: any) => {
    toast({
      title: `Ação: ${action}`,
      description: `${action} ${item ? `para ${item}` : ''} executada com sucesso`,
    });
  };

  const getSeverityColor = (severidade: string) => {
    switch (severidade) {
      case "Alta": return "destructive";
      case "Média": return "default";
      case "Baixa": return "secondary";
      default: return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovada":
      case "Validada":
      case "Lançada": return "default";
      case "Pendente":
      case "Montada": return "secondary";
      case "Reprovada": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Controle de Alimentação</h1>
          <p className="text-muted-foreground">
            Controle centralizado de refeições por obra com integração Nydhus e Sienge
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="competencia">Competência</Label>
            <Select value={competenciaAtual} onValueChange={setCompetenciaAtual}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Selecionar mês" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-01">Janeiro/2024</SelectItem>
                <SelectItem value="2024-02">Fevereiro/2024</SelectItem>
                <SelectItem value="2024-03">Março/2024</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="obra">CCA/Obra</Label>
            <Select value={obraSelecionada} onValueChange={setObraSelecionada}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Todas as obras" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as obras</SelectItem>
                <SelectItem value="CCA-001">CCA-001 - Obra Alpha</SelectItem>
                <SelectItem value="CCA-002">CCA-002 - Obra Beta</SelectItem>
                <SelectItem value="CCA-003">CCA-003 - Obra Gamma</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Obras com NF Lançada</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{resumoCards.obrasComNF}</div>
              <p className="text-xs text-muted-foreground">
                No mês atual
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Obras Sem Lançamento</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{resumoCards.obrasSemLancamento}</div>
              <p className="text-xs text-muted-foreground">
                Pendentes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas Abertos</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{resumoCards.alertasAbertos}</div>
              <p className="text-xs text-muted-foreground">
                Requerem atenção
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Custo Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {resumoCards.custoTotal.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-muted-foreground">
                Mês atual
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alertas */}
        {alertas.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Alertas Ativos ({alertas.length})</AlertTitle>
            <AlertDescription>
              Existem pendências que requerem atenção. Verifique a aba "Alertas" para mais detalhes.
            </AlertDescription>
          </Alert>
        )}

        {/* Abas Principais */}
        <Tabs defaultValue="medicoes" className="space-y-4">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="medicoes">Medições</TabsTrigger>
            <TabsTrigger value="fornecedores">Fornecedores</TabsTrigger>
            <TabsTrigger value="efetivo">Efetivo</TabsTrigger>
            <TabsTrigger value="notas-fiscais">Notas Fiscais</TabsTrigger>
            <TabsTrigger value="alertas">Alertas</TabsTrigger>
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
            <TabsTrigger value="resumo-ccr">Resumo CCR</TabsTrigger>
          </TabsList>

          {/* Aba Medições */}
          <TabsContent value="medicoes" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Medições de Alimentação</h2>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Montar Medição
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Montar Nova Medição</DialogTitle>
                      <DialogDescription>
                        Selecione a obra e competência para montar a medição
                      </DialogDescription>
                    </DialogHeader>
                    {/* Formulário de medição aqui */}
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" size="sm" onClick={() => handleAction("Exportar Medições")}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Obra</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Competência</TableHead>
                  <TableHead>Qtd Refeições</TableHead>
                  <TableHead>Valor Esperado</TableHead>
                  <TableHead>Valor NF</TableHead>
                  <TableHead>Divergência</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicoes.map((medicao) => (
                  <TableRow key={medicao.id}>
                    <TableCell className="font-medium">{medicao.obra}</TableCell>
                    <TableCell>{medicao.fornecedor}</TableCell>
                    <TableCell>{medicao.competencia}</TableCell>
                    <TableCell>{medicao.qtdRefeicoes.toLocaleString()}</TableCell>
                    <TableCell>R$ {medicao.valorEsperado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>R$ {medicao.valorNF.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>
                      <span className={`${medicao.divergencia < 0 ? 'text-green-600' : 'text-red-600'}`}>
                        R$ {medicao.divergencia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        ({medicao.divergenciaPerc}%)
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(medicao.status)}>
                        {medicao.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleAction("Visualizar", medicao.obra)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {medicao.status === "Montada" && (
                          <Button variant="ghost" size="sm" onClick={() => handleAction("Validar", medicao.obra)}>
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {medicao.status === "Validada" && (
                          <Button variant="ghost" size="sm" onClick={() => handleAction("Lançar Sienge", medicao.obra)}>
                            <Upload className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          {/* Aba Fornecedores */}
          <TabsContent value="fornecedores" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Fornecedores de Alimentação</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Fornecedor
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cadastrar Fornecedor</DialogTitle>
                    <DialogDescription>
                      Preencha os dados do fornecedor de alimentação
                    </DialogDescription>
                  </DialogHeader>
                  {/* Formulário de fornecedor aqui */}
                </DialogContent>
              </Dialog>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Razão Social</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Periodicidade</TableHead>
                  <TableHead>Valor Unitário</TableHead>
                  <TableHead>Tolerância</TableHead>
                  <TableHead>Vigência</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fornecedores.map((fornecedor) => (
                  <TableRow key={fornecedor.id}>
                    <TableCell className="font-medium">{fornecedor.razaoSocial}</TableCell>
                    <TableCell>{fornecedor.cnpj}</TableCell>
                    <TableCell>{fornecedor.periodicidade}</TableCell>
                    <TableCell>R$ {fornecedor.valorUnitario.toFixed(2)}</TableCell>
                    <TableCell>{fornecedor.tolerancia}%</TableCell>
                    <TableCell>{fornecedor.vigencia}</TableCell>
                    <TableCell>
                      <Badge variant={fornecedor.status === "Ativo" ? "default" : "secondary"}>
                        {fornecedor.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleAction("Editar", fornecedor.razaoSocial)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          {/* Aba Efetivo */}
          <TabsContent value="efetivo" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Efetivo da Obra</h2>
              <Button size="sm" onClick={() => handleAction("Sincronizar Nydhus")}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Sincronizar Nydhus
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Obra</TableHead>
                  <TableHead>Competência</TableHead>
                  <TableHead>Qtd Colaboradores</TableHead>
                  <TableHead>Fonte</TableHead>
                  <TableHead>Data Atualização</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {efetivoObra.map((efetivo) => (
                  <TableRow key={efetivo.id}>
                    <TableCell className="font-medium">{efetivo.obra}</TableCell>
                    <TableCell>{efetivo.competencia}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {efetivo.qtdColaboradores}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={efetivo.fonte === "Nydhus" ? "default" : "secondary"}>
                        {efetivo.fonte}
                      </Badge>
                    </TableCell>
                    <TableCell>{efetivo.dataAtualizacao}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleAction("Editar Efetivo", efetivo.obra)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          {/* Aba Notas Fiscais */}
          <TabsContent value="notas-fiscais" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Notas Fiscais</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload NF
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload de Nota Fiscal</DialogTitle>
                    <DialogDescription>
                      Faça o upload da nota fiscal e preencha os dados
                    </DialogDescription>
                  </DialogHeader>
                  {/* Formulário de upload aqui */}
                </DialogContent>
              </Dialog>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número NF</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Obra</TableHead>
                  <TableHead>Competência</TableHead>
                  <TableHead>Valor NF</TableHead>
                  <TableHead>Qtd Refeições</TableHead>
                  <TableHead>Custo Unitário</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notasFiscais.map((nf) => (
                  <TableRow key={nf.id}>
                    <TableCell className="font-medium">{nf.numeroNF}</TableCell>
                    <TableCell>{nf.fornecedor}</TableCell>
                    <TableCell>{nf.obra}</TableCell>
                    <TableCell>{nf.competencia}</TableCell>
                    <TableCell>R$ {nf.valorNF.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>{nf.qtdRefeicoes.toLocaleString()}</TableCell>
                    <TableCell>R$ {nf.custoUnitario.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(nf.status)}>
                        {nf.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleAction("Visualizar NF", nf.numeroNF)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleAction("Download", nf.arquivo)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          {/* Aba Alertas */}
          <TabsContent value="alertas" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Alertas do Sistema</h2>
              <Button variant="outline" size="sm" onClick={() => handleAction("Atualizar Alertas")}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Obra</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Competência</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Severidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alertas.map((alerta) => (
                  <TableRow key={alerta.id}>
                    <TableCell className="font-medium">{alerta.tipo}</TableCell>
                    <TableCell>{alerta.obra}</TableCell>
                    <TableCell>{alerta.fornecedor}</TableCell>
                    <TableCell>{alerta.competencia}</TableCell>
                    <TableCell>{alerta.descricao}</TableCell>
                    <TableCell>
                      <Badge variant={getSeverityColor(alerta.severidade)}>
                        {alerta.severidade}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{alerta.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleAction("Resolver Alerta", alerta.id)}>
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          {/* Aba Relatórios */}
          <TabsContent value="relatorios" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Relatórios</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleAction("Gerar Consolidado")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Consolidado Mensal
                  </CardTitle>
                  <CardDescription>
                    Relatório consolidado de todas as obras do mês
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleAction("Gerar Conformidade")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Conformidade
                  </CardTitle>
                  <CardDescription>
                    Relatório de quantidade × NF por fornecedor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleAction("Gerar Histórico")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Histórico 12 Meses
                  </CardTitle>
                  <CardDescription>
                    Evolução de custos e quantidades
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          {/* Aba Resumo CCR */}
          <TabsContent value="resumo-ccr" className="space-y-4">
            <ResumoCCRObra />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ControleAlimentacao;