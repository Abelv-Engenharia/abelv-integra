import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { AlertTriangle, FileText, Download, Filter, DollarSign, Users, Building2, Calendar, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data para relatórios e alertas de hospedagem
const mockRelatoriosHospedagem = [
  {
    id: 'REL-001',
    periodo: '2025-01',
    obra: 'CCA 25051',
    fornecedor: 'João Carlos Silva',
    totalColaboradores: 8,
    totalDias: 240,
    valorTotal: 18000,
    status: 'fechado'
  },
  {
    id: 'REL-002',
    periodo: '2025-01',
    obra: 'CCA 25052', 
    fornecedor: 'Pousada Central Ltda',
    totalColaboradores: 12,
    totalDias: 360,
    valorTotal: 25200,
    status: 'pendente'
  }
];

const mockAlertasHospedagem = [
  {
    id: 'ALT-001',
    tipo: 'medicao_pendente',
    obra: 'CCA 25051',
    fornecedor: 'João Carlos Silva',
    competencia: '2025-01',
    prazoVencimento: '2025-02-05',
    prioridade: 'alta',
    descricao: 'Medição de hospedagem pendente há 5 dias'
  },
  {
    id: 'ALT-002',
    tipo: 'nota_fiscal_atraso',
    obra: 'CCA 25052',
    fornecedor: 'Pousada Central Ltda',
    competencia: '2024-12',
    prazoVencimento: '2025-01-30',
    prioridade: 'critica',
    descricao: 'Nota fiscal não lançada - prazo vencido'
  },
  {
    id: 'ALT-003',
    tipo: 'documentacao_incompleta',
    obra: 'CCA 25053',
    fornecedor: 'Hotel Executivo SA',
    competencia: '2025-01',
    prazoVencimento: '2025-02-10',
    prioridade: 'media',
    descricao: 'Documentação da hospedagem incompleta'
  }
];

const mockDashboardData = {
  totalHospedagens: 45,
  valorTotalMes: 98500,
  medicoesPendentes: 8,
  colaboradoresAtendidos: 156,
  medicoesAprovadas: 23,
  notasFiscaisPendentes: 5
};

const getPrioridadeBadge = (prioridade: string) => {
  const config = {
    critica: { variant: 'destructive' as const, text: 'Crítica' },
    alta: { variant: 'secondary' as const, text: 'Alta' },
    media: { variant: 'outline' as const, text: 'Média' }
  };
  
  const prioridadeConfig = config[prioridade as keyof typeof config] || config.media;
  
  return (
    <Badge variant={prioridadeConfig.variant}>
      {prioridadeConfig.text}
    </Badge>
  );
};

const getStatusBadge = (status: string) => {
  const config = {
    fechado: { variant: 'default' as const, text: 'Fechado' },
    pendente: { variant: 'secondary' as const, text: 'Pendente' },
    processando: { variant: 'outline' as const, text: 'Processando' }
  };
  
  const statusConfig = config[status as keyof typeof config] || config.pendente;
  
  return (
    <Badge variant={statusConfig.variant}>
      {statusConfig.text}
    </Badge>
  );
};

export default function HospedagemRelatoriosAlertas() {
  const { toast } = useToast();
  const [filtroObra, setFiltroObra] = useState<string>('todas');
  const [filtroPeriodo, setFiltroPeriodo] = useState<string>('2025-01');
  const [filtroFornecedor, setFiltroFornecedor] = useState<string>('todos');

  const handleExportarRelatorio = (formato: 'excel' | 'pdf') => {
    toast({
      title: "Exportando Relatório",
      description: `Relatório de hospedagem sendo exportado em formato ${formato.toUpperCase()}`
    });
  };

  const handleResolverAlerta = (alertaId: string) => {
    toast({
      title: "Alerta Resolvido",
      description: `Alerta ${alertaId} foi marcado como resolvido`
    });
  };

  const relatóriosFiltrados = mockRelatoriosHospedagem.filter(rel => {
    return (filtroObra === 'todas' || rel.obra.includes(filtroObra)) &&
           (filtroPeriodo === 'todos' || rel.periodo === filtroPeriodo) &&
           (filtroFornecedor === 'todos' || rel.fornecedor.includes(filtroFornecedor));
  });

  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hospedagem - Relatórios e Alertas</h1>
          <p className="text-muted-foreground">Dashboard, relatórios consolidados e alertas de hospedagem</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
            <TabsTrigger value="alertas">Alertas</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Cards Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Hospedagens Ativas</p>
                      <p className="text-2xl font-bold">{mockDashboardData.totalHospedagens}</p>
                    </div>
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Valor Total Mês</p>
                      <p className="text-2xl font-bold">R$ {mockDashboardData.valorTotalMes.toLocaleString('pt-BR')}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Colaboradores</p>
                      <p className="text-2xl font-bold">{mockDashboardData.colaboradoresAtendidos}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Medições Pendentes</p>
                      <p className="text-2xl font-bold text-amber-600">{mockDashboardData.medicoesPendentes}</p>
                    </div>
                    <Clock className="h-8 w-8 text-amber-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Aprovadas</p>
                      <p className="text-2xl font-bold text-green-600">{mockDashboardData.medicoesAprovadas}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">NF Pendentes</p>
                      <p className="text-2xl font-bold text-red-600">{mockDashboardData.notasFiscaisPendentes}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resumo Visual */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Evolução Mensal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm">Janeiro 2025</span>
                      <span className="font-semibold">R$ 98.500</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm">Dezembro 2024</span>
                      <span className="font-semibold">R$ 87.200</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm">Novembro 2024</span>
                      <span className="font-semibold">R$ 92.800</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Hospedagens por Obra
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm">CCA 25051</span>
                      <Badge variant="outline">15 hospedagens</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm">CCA 25052</span>
                      <Badge variant="outline">18 hospedagens</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm">CCA 25053</span>
                      <Badge variant="outline">12 hospedagens</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="relatorios" className="space-y-6">
            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Obra</label>
                    <Select value={filtroObra} onValueChange={setFiltroObra}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas as Obras</SelectItem>
                        <SelectItem value="25051">CCA 25051</SelectItem>
                        <SelectItem value="25052">CCA 25052</SelectItem>
                        <SelectItem value="25053">CCA 25053</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Período</label>
                    <Input 
                      type="month" 
                      value={filtroPeriodo}
                      onChange={(e) => setFiltroPeriodo(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Fornecedor</label>
                    <Select value={filtroFornecedor} onValueChange={setFiltroFornecedor}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos os Fornecedores</SelectItem>
                        <SelectItem value="João Carlos">João Carlos Silva</SelectItem>
                        <SelectItem value="Pousada Central">Pousada Central Ltda</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end gap-2">
                    <Button onClick={() => handleExportarRelatorio('excel')}>
                      <Download className="h-4 w-4 mr-2" />
                      Excel
                    </Button>
                    <Button variant="outline" onClick={() => handleExportarRelatorio('pdf')}>
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabela de Relatórios */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Relatório Consolidado de Hospedagem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Período</TableHead>
                      <TableHead>Obra</TableHead>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead>Total Colaboradores</TableHead>
                      <TableHead>Total Dias</TableHead>
                      <TableHead>Valor Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatóriosFiltrados.map((relatorio) => (
                      <TableRow key={relatorio.id}>
                        <TableCell>{relatorio.periodo}</TableCell>
                        <TableCell>{relatorio.obra}</TableCell>
                        <TableCell>{relatorio.fornecedor}</TableCell>
                        <TableCell>{relatorio.totalColaboradores}</TableCell>
                        <TableCell>{relatorio.totalDias} dias</TableCell>
                        <TableCell>R$ {relatorio.valorTotal.toLocaleString('pt-BR')}</TableCell>
                        <TableCell>{getStatusBadge(relatorio.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alertas" className="space-y-6">
            {/* Resumo de Alertas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Alertas Críticos</p>
                      <p className="text-2xl font-bold text-red-600">
                        {mockAlertasHospedagem.filter(a => a.prioridade === 'critica').length}
                      </p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Alta Prioridade</p>
                      <p className="text-2xl font-bold text-amber-600">
                        {mockAlertasHospedagem.filter(a => a.prioridade === 'alta').length}
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-amber-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total de Alertas</p>
                      <p className="text-2xl font-bold">{mockAlertasHospedagem.length}</p>
                    </div>
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Alertas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Alertas de Hospedagem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Obra</TableHead>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead>Competência</TableHead>
                      <TableHead>Prazo</TableHead>
                      <TableHead>Prioridade</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAlertasHospedagem.map((alerta) => (
                      <TableRow key={alerta.id}>
                        <TableCell className="font-medium">{alerta.tipo.replace('_', ' ')}</TableCell>
                        <TableCell>{alerta.obra}</TableCell>
                        <TableCell>{alerta.fornecedor}</TableCell>
                        <TableCell>{alerta.competencia}</TableCell>
                        <TableCell>
                          {new Date(alerta.prazoVencimento).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>{getPrioridadeBadge(alerta.prioridade)}</TableCell>
                        <TableCell>{alerta.descricao}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleResolverAlerta(alerta.id)}
                          >
                            Resolver
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}