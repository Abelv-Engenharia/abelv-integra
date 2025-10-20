import React, { useState } from 'react';
import { Calendar, Users, AlertTriangle, FileText, Plane, CheckCircle, Clock, TrendingUp, BarChart3, History, ExternalLink } from 'lucide-react';
import RelatoriosTab from '@/components/folga-campo/RelatoriosTab';
import FormularioSolicitacao from '@/components/folga-campo/FormularioSolicitacao';
import LinhaTempoFolgas from '@/components/folga-campo/LinhaTempoFolgas';
import IntegracaoPassagens from '@/components/folga-campo/IntegracaoPassagens';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockColaboradores = [
  {
    id: 1,
    matricula: "001234",
    nome: "João Silva Santos",
    cpf: "123.456.789-01",
    funcao: "Encarregado",
    obra: "Obra Alpha",
    cca: "CC001",
    data_admissao: "2024-01-15",
    roteiro_origem: "Fortaleza/CE",
    roteiro_destino: "São Paulo/SP",
    politica: 45,
    data_ultima_folga: "2024-11-01",
    status: "Ativo"
  },
  {
    id: 2,
    matricula: "001235",
    nome: "Maria Oliveira Costa",
    cpf: "987.654.321-02",
    funcao: "Operador",
    obra: "Obra Beta",
    cca: "CC002",
    data_admissao: "2024-02-10",
    roteiro_origem: "Recife/PE",
    roteiro_destino: "Rio de Janeiro/RJ",
    politica: 90,
    data_ultima_folga: "2024-10-15",
    status: "Ativo"
  },
  {
    id: 3,
    matricula: "001236",
    nome: "Carlos Eduardo Lima",
    cpf: "456.789.123-03",
    funcao: "Líder",
    obra: "Obra Gamma",
    cca: "CC003", 
    data_admissao: "2024-03-20",
    roteiro_origem: "Salvador/BA",
    roteiro_destino: "Brasília/DF",
    politica: 45,
    data_ultima_folga: "2024-12-01",
    status: "Ativo"
  }
];

const mockFolgas = [
  {
    id: 1,
    colaborador_id: 1,
    colaborador: "João Silva Santos",
    obra: "Obra Alpha",
    cca: "CC001",
    ciclo: 45,
    periodo_inicio: "2025-01-15",
    periodo_fim: "2025-01-17",
    composicao: "Sáb + Dom + Seg",
    status: "D-45 Enviado",
    supervisor_aprovacao: "Pendente",
    engenheiro_aprovacao: "-",
    formulario_assinado: "Não",
    passagem_comprada: "Não",
    voucher_enviado: "Não"
  },
  {
    id: 2,
    colaborador_id: 2,
    colaborador: "Maria Oliveira Costa",
    obra: "Obra Beta",
    cca: "CC002",
    ciclo: 90,
    periodo_inicio: "2025-02-01",
    periodo_fim: "2025-02-08",
    composicao: "Dom até Sáb (7 dias)",
    status: "Aprovado Supervisor",
    supervisor_aprovacao: "Aprovado",
    engenheiro_aprovacao: "Pendente",
    formulario_assinado: "Sim",
    passagem_comprada: "Não",
    voucher_enviado: "Não"
  },
  {
    id: 3,
    colaborador_id: 3,
    colaborador: "Carlos Eduardo Lima",
    obra: "Obra Gamma",
    cca: "CC003",
    ciclo: 45,
    periodo_inicio: "2025-01-20",
    periodo_fim: "2025-01-22",
    composicao: "Sáb + Dom + Seg",
    status: "D-30 Alerta",
    supervisor_aprovacao: "Aprovado",
    engenheiro_aprovacao: "Aprovado",
    formulario_assinado: "Sim",
    passagem_comprada: "Não",
    voucher_enviado: "Não"
  }
];

const mockComprasPassagens = [
  {
    id: 1,
    folga_id: 2,
    colaborador: "Maria Oliveira Costa",
    data_compra: "2024-12-15",
    cia: "TAM",
    localizador: "ABC123",
    origem: "Recife/PE",
    destino: "Rio de Janeiro/RJ",
    ida_data_hora: "2025-01-31 18:30",
    volta_data_hora: "2025-02-09 06:00",
    valor: "R$ 850,00",
    status: "Comprada"
  }
];

const mockAlertas = [
  {
    id: 1,
    tipo: "D-45",
    colaborador: "João Silva Santos",
    obra: "Obra Alpha",
    periodo: "15/01 a 17/01",
    data_envio: "2024-12-01",
    status: "Enviado"
  },
  {
    id: 2,
    tipo: "D-30",
    colaborador: "Carlos Eduardo Lima", 
    obra: "Obra Gamma",
    periodo: "20/01 a 22/01",
    data_envio: "2024-12-21",
    status: "Pendente Ação"
  }
];

const ControleFolgaCampo = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedObra, setSelectedObra] = useState('todas');
  const [selectedMes, setSelectedMes] = useState('2025-01');
  const [selectedColaborador, setSelectedColaborador] = useState(null);
  const [showAprovacaoDialog, setShowAprovacaoDialog] = useState(false);
  const [showCompraDialog, setShowCompraDialog] = useState(false);
  const [showFormularioDialog, setShowFormularioDialog] = useState(false);
  const [showLinhaTempoDialog, setShowLinhaTempoDialog] = useState(false);
  const [showIntegracaoDialog, setShowIntegracaoDialog] = useState(false);
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "D-45 Enviado": { variant: "secondary", color: "bg-blue-500" },
      "Aprovado Supervisor": { variant: "secondary", color: "bg-yellow-500" },
      "D-30 Alerta": { variant: "destructive", color: "bg-red-500" },
      "Concluído": { variant: "default", color: "bg-green-500" }
    };

    const config = statusConfig[status] || { variant: "secondary", color: "bg-gray-500" };
    return <Badge variant={config.variant}>{status}</Badge>;
  };

  const handleAprovarFolga = () => {
    toast({
      title: "Folga aprovada",
      description: "A folga foi aprovada com sucesso."
    });
    setShowAprovacaoDialog(false);
  };

  const handleDispararD45 = (folga) => {
    toast({
      title: "E-mail D-45 enviado",
      description: `E-mail com formulário PDF enviado para ${folga.colaborador}`
    });
  };

  const handleUploadFormulario = () => {
    toast({
      title: "Formulário enviado", 
      description: "Formulário assinado foi anexado com sucesso."
    });
  };

  const handleComprarPassagem = () => {
    toast({
      title: "Passagem registrada",
      description: "Dados da passagem foram preenchidos automaticamente via IA."
    });
    setShowCompraDialog(false);
  };

  const handleEnviarFormulario = (dadosFormulario) => {
    // Manter fluxo automático já configurado
    toast({
      title: "Formulário enviado",
      description: "Seguindo fluxo automático da obra com destinatários configurados."
    });
    setShowFormularioDialog(false);
  };

  const handleMostrarLinhaTempo = (colaborador) => {
    setSelectedColaborador(colaborador);
    setShowLinhaTempoDialog(true);
  };

  const handleMostrarIntegracao = () => {
    setShowIntegracaoDialog(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5 p-4">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Controle Folga de Campo
            </h1>
            <p className="text-muted-foreground">
              Gestão automática de folgas com alertas D-45 e D-30
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Importar Excel
            </Button>
            <Button size="sm">
              <Users className="mr-2 h-4 w-4" />
              Novo Colaborador
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="colaboradores">Colaboradores</TabsTrigger>
            <TabsTrigger value="folgas-obra">Por Obra</TabsTrigger>
            <TabsTrigger value="compras">Compras</TabsTrigger>
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
            <TabsTrigger value="alertas">Alertas</TabsTrigger>
            <TabsTrigger value="auditoria">Auditoria</TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* KPIs */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Folgas D-45 no Prazo</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">85%</div>
                  <p className="text-xs text-muted-foreground">+5% vs mês anterior</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Passagens D-30</CardTitle>
                  <Plane className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">78%</div>
                  <p className="text-xs text-muted-foreground">Meta: 90%</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pendências Ativas</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">12</div>
                  <p className="text-xs text-muted-foreground">-3 vs semana anterior</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Custo Médio</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 742</div>
                  <p className="text-xs text-muted-foreground">Por passagem</p>
                </CardContent>
              </Card>
            </div>

            {/* Resumo por Obra */}
            <Card>
              <CardHeader>
                <CardTitle>Folgas no Mês por Obra/CCA</CardTitle>
                <CardDescription>Janeiro 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Obra Alpha - CC001', 'Obra Beta - CC002', 'Obra Gamma - CC003'].map((obra, idx) => (
                    <div key={obra} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{obra}</p>
                        <p className="text-sm text-muted-foreground">{3 - idx} folgas programadas</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary">{2 - idx} D-45 OK</Badge>
                        <Badge variant="destructive">{idx} Pendentes</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Folgas por Obra */}
          <TabsContent value="folgas-obra" className="space-y-6">
            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle>Filtros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Obra/CCA</Label>
                    <Select value={selectedObra} onValueChange={setSelectedObra}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas as Obras</SelectItem>
                        <SelectItem value="cc001">Obra Alpha - CC001</SelectItem>
                        <SelectItem value="cc002">Obra Beta - CC002</SelectItem>
                        <SelectItem value="cc003">Obra Gamma - CC003</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Mês/Ano</Label>
                    <Select value={selectedMes} onValueChange={setSelectedMes}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2025-01">Janeiro 2025</SelectItem>
                        <SelectItem value="2025-02">Fevereiro 2025</SelectItem>
                        <SelectItem value="2024-12">Dezembro 2024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Política</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas</SelectItem>
                        <SelectItem value="45">45 dias</SelectItem>
                        <SelectItem value="90">90 dias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Busca</Label>
                    <Input placeholder="Nome ou matrícula..." />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabela de Folgas */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Folgas Programadas</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Disparar D-45 em Massa</Button>
                    <Button variant="outline" size="sm">Exportar Excel</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Colaborador</TableHead>
                      <TableHead>Política</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Composição</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Supervisor</TableHead>
                      <TableHead>Engenheiro</TableHead>
                      <TableHead>Formulário</TableHead>
                      <TableHead>Passagem</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockFolgas.map((folga) => (
                      <TableRow key={folga.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{folga.colaborador}</p>
                            <p className="text-sm text-muted-foreground">{folga.obra}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{folga.ciclo} dias</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(folga.periodo_inicio).toLocaleDateString()} até {new Date(folga.periodo_fim).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{folga.composicao}</TableCell>
                        <TableCell>{getStatusBadge(folga.status)}</TableCell>
                        <TableCell>
                          <Badge variant={folga.supervisor_aprovacao === "Aprovado" ? "default" : "secondary"}>
                            {folga.supervisor_aprovacao}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={folga.engenheiro_aprovacao === "Aprovado" ? "default" : "secondary"}>
                            {folga.engenheiro_aprovacao}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={folga.formulario_assinado === "Sim" ? "default" : "secondary"}>
                            {folga.formulario_assinado}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={folga.passagem_comprada === "Sim" ? "default" : "destructive"}>
                            {folga.passagem_comprada}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Dialog open={showAprovacaoDialog} onOpenChange={setShowAprovacaoDialog}>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">Validar</Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Validação de Folga</DialogTitle>
                                  <DialogDescription>
                                    Revisar e aprovar a folga de {folga.colaborador}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label>Período: {folga.periodo_inicio} a {folga.periodo_fim}</Label>
                                  </div>
                                  <div>
                                    <Label>Composição: {folga.composicao}</Label>
                                  </div>
                                  <div>
                                    <Label>Comentários</Label>
                                    <Textarea placeholder="Comentários opcionais..." />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setShowAprovacaoDialog(false)}>Reprovar</Button>
                                  <Button onClick={handleAprovarFolga}>Aprovar</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDispararD45(folga)}
                            >
                              D-45
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Colaboradores */}
          <TabsContent value="colaboradores" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Colaboradores Cadastrados</CardTitle>
                <CardDescription>Base de dados de colaboradores ativos</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Matrícula</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Função</TableHead>
                      <TableHead>Obra/CCA</TableHead>
                      <TableHead>Política</TableHead>
                      <TableHead>Última Folga</TableHead>
                      <TableHead>Próxima Folga</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockColaboradores.map((colab) => (
                      <TableRow key={colab.id}>
                        <TableCell className="font-medium">{colab.matricula}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{colab.nome}</p>
                            <p className="text-sm text-muted-foreground">{colab.cpf}</p>
                          </div>
                        </TableCell>
                        <TableCell>{colab.funcao}</TableCell>
                        <TableCell>
                          <div>
                            <p>{colab.obra}</p>
                            <p className="text-sm text-muted-foreground">{colab.cca}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{colab.politica} dias</Badge>
                        </TableCell>
                        <TableCell>{new Date(colab.data_ultima_folga).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(new Date(colab.data_ultima_folga).getTime() + colab.politica * 24 * 60 * 60 * 1000).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={colab.status === "Ativo" ? "default" : "secondary"}>
                            {colab.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleMostrarLinhaTempo(colab)}
                            >
                              <History className="mr-1 h-3 w-3" />
                              Linha Tempo
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedColaborador(colab);
                                setShowFormularioDialog(true);
                              }}
                            >
                              <FileText className="mr-1 h-3 w-3" />
                              Nova Folga
                            </Button>
                            <Button variant="outline" size="sm">Editar</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compras */}
          <TabsContent value="compras" className="space-y-6">
            <div className="flex gap-4 mb-6">
              <Button 
                onClick={handleMostrarIntegracao}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Ver Integrações BIZZTRIP/ONFLY
              </Button>
            </div>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Compras de Passagens</CardTitle>
                  <Dialog open={showCompraDialog} onOpenChange={setShowCompraDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plane className="mr-2 h-4 w-4" />
                        Registrar Compra
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Registro de Passagem</DialogTitle>
                        <DialogDescription>
                          Upload do comprovante - IA preencherá automaticamente
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Comprovante de Compra</Label>
                          <Input type="file" accept=".pdf,.jpg,.png" />
                          <p className="text-sm text-muted-foreground">IA extrairá dados automaticamente</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Companhia</Label>
                            <Input placeholder="Preenchimento automático..." />
                          </div>
                          <div>
                            <Label>Localizador</Label>
                            <Input placeholder="Preenchimento automático..." />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Data/Hora Ida</Label>
                            <Input type="datetime-local" />
                          </div>
                          <div>
                            <Label>Data/Hora Volta</Label>
                            <Input type="datetime-local" />
                          </div>
                        </div>
                        <div>
                          <Label>Valor Total</Label>
                          <Input placeholder="R$ 0,00" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCompraDialog(false)}>Cancelar</Button>
                        <Button onClick={handleComprarPassagem}>Salvar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Colaborador</TableHead>
                      <TableHead>Companhia</TableHead>
                      <TableHead>Localizador</TableHead>
                      <TableHead>Trecho</TableHead>
                      <TableHead>Ida</TableHead>
                      <TableHead>Volta</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockComprasPassagens.map((compra) => (
                      <TableRow key={compra.id}>
                        <TableCell className="font-medium">{compra.colaborador}</TableCell>
                        <TableCell>{compra.cia}</TableCell>
                        <TableCell className="font-mono text-sm">{compra.localizador}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {compra.origem} → {compra.destino}
                          </div>
                        </TableCell>
                        <TableCell>{compra.ida_data_hora}</TableCell>
                        <TableCell>{compra.volta_data_hora}</TableCell>
                        <TableCell className="font-medium">{compra.valor}</TableCell>
                        <TableCell>
                          <Badge variant="default">{compra.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm">Ver Comprovante</Button>
                            <Button variant="outline" size="sm" onClick={handleUploadFormulario}>
                              Upload Voucher
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Relatórios - Novo Tab */}
          <TabsContent value="relatorios" className="space-y-6">
            <RelatoriosTab />
          </TabsContent>

          {/* Alertas */}
          <TabsContent value="alertas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alertas Automáticos</CardTitle>
                <CardDescription>Notificações D-45 e D-30 enviadas automaticamente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAlertas.map((alerta) => (
                    <div key={alerta.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${alerta.tipo === 'D-30' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                          <div>
                            <p className="font-medium">Alerta {alerta.tipo} - {alerta.colaborador}</p>
                            <p className="text-sm text-muted-foreground">
                              {alerta.obra} • Período: {alerta.periodo}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={alerta.status === "Enviado" ? "default" : "destructive"}>
                            {alerta.status}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">
                            Enviado em {new Date(alerta.data_envio).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Auditoria */}
          <TabsContent value="auditoria" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Log de Auditoria</CardTitle>
                <CardDescription>Histórico completo de todas as ações</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead>Colaborador</TableHead>
                      <TableHead>Detalhes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>21/12/2024 14:30</TableCell>
                      <TableCell>admin@empresa.com</TableCell>
                      <TableCell>
                        <Badge variant="outline">Folga Criada</Badge>
                      </TableCell>
                      <TableCell>João Silva Santos</TableCell>
                      <TableCell>Folga 45 dias criada automaticamente</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>20/12/2024 09:15</TableCell>
                      <TableCell>supervisor@obra.com</TableCell>
                      <TableCell>
                        <Badge variant="default">Aprovação</Badge>
                      </TableCell>
                      <TableCell>Maria Oliveira Costa</TableCell>
                      <TableCell>Folga aprovada pelo supervisor</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>19/12/2024 16:45</TableCell>
                      <TableCell>admin@empresa.com</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Upload</Badge>
                      </TableCell>
                      <TableCell>Carlos Eduardo Lima</TableCell>
                      <TableCell>Formulário assinado anexado</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog de Linha do Tempo */}
        {showLinhaTempoDialog && selectedColaborador && (
          <Dialog open={showLinhaTempoDialog} onOpenChange={setShowLinhaTempoDialog}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Linha do Tempo de Folgas</DialogTitle>
                <DialogDescription>
                  Histórico completo e futuro das folgas do colaborador
                </DialogDescription>
              </DialogHeader>
              <LinhaTempoFolgas colaborador={selectedColaborador} />
            </DialogContent>
          </Dialog>
        )}

        {/* Dialog de Formulário de Solicitação */}
        {showFormularioDialog && selectedColaborador && (
          <Dialog open={showFormularioDialog} onOpenChange={setShowFormularioDialog}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nova Solicitação de Folga</DialogTitle>
                <DialogDescription>
                  Formulário baseado no padrão de referência da obra
                </DialogDescription>
              </DialogHeader>
              <FormularioSolicitacao 
                colaborador={selectedColaborador}
                onSubmit={handleEnviarFormulario}
                onCancel={() => setShowFormularioDialog(false)}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Dialog de Integrações */}
        {showIntegracaoDialog && (
          <Dialog open={showIntegracaoDialog} onOpenChange={setShowIntegracaoDialog}>
            <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Integrações de Passagens</DialogTitle>
                <DialogDescription>
                  Gerenciamento das integrações BIZZTRIP e ONFLY
                </DialogDescription>
              </DialogHeader>
              <IntegracaoPassagens />
            </DialogContent>
          </Dialog>
        )}

        {/* Dialog de Histórico Simples (Manter compatibilidade) */}
        {selectedColaborador && !showLinhaTempoDialog && !showFormularioDialog && (
          <Dialog open={!!selectedColaborador && !showLinhaTempoDialog && !showFormularioDialog} onOpenChange={() => setSelectedColaborador(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Histórico de Folgas - {selectedColaborador.nome}</DialogTitle>
                <DialogDescription>
                  Matrícula: {selectedColaborador.matricula} • {selectedColaborador.obra}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Função</p>
                    <p>{selectedColaborador.funcao}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Política</p>
                    <p>{selectedColaborador.politica} dias</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Última Folga</p>
                    <p>{new Date(selectedColaborador.data_ultima_folga).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Próxima Folga</p>
                    <p className="font-medium text-primary">
                      {new Date(new Date(selectedColaborador.data_ultima_folga).getTime() + selectedColaborador.politica * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Histórico de Folgas</h4>
                  <div className="space-y-2">
                    {mockFolgas
                      .filter(f => f.colaborador_id === selectedColaborador.id)
                      .map((folga) => (
                        <div key={folga.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="font-medium">
                              {new Date(folga.periodo_inicio).toLocaleDateString()} - {new Date(folga.periodo_fim).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-muted-foreground">{folga.composicao}</p>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(folga.status)}
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default ControleFolgaCampo;