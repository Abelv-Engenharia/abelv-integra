import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Clock, CheckCircle, FileText, Users, Building2, Mail, Download, Settings, ClipboardCheck } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data
const mockContratos = [
  {
    id: 1,
    fornecedor: "Hotel Central Ltda",
    obra: "CCA 001 - Projeto Alpha",
    contratoAnexado: true,
    dataAnexacao: "2024-01-15",
    prazoVistoria: 30,
    diasRestantes: 15,
    statusVistoria: "Pendente",
    dataVistoria: null,
    situacaoAlerta: "Ativo"
  },
  {
    id: 2,
    fornecedor: "Pousada Bom Descanso",
    obra: "CCA 002 - Projeto Beta", 
    contratoAnexado: true,
    dataAnexacao: "2024-01-01",
    prazoVistoria: 30,
    diasRestantes: -2,
    statusVistoria: "Atrasada",
    dataVistoria: null,
    situacaoAlerta: "Ativo"
  },
  {
    id: 3,
    fornecedor: "Residencial Conforto",
    obra: "CCA 003 - Projeto Gamma",
    contratoAnexado: true,
    dataAnexacao: "2023-12-20",
    prazoVistoria: 30,
    diasRestantes: 0,
    statusVistoria: "Anexada",
    dataVistoria: "2024-01-10",
    situacaoAlerta: "Resolvido"
  }
];

const mockRelatorioPorObra = [
  {
    obra: "CCA 001 - Projeto Alpha",
    contratosAnexados: 3,
    vistoriasPendentes: 2,
    vistoriasAtraso: 0,
    alertasAtivos: 2,
    alertasResolvidos: 1
  },
  {
    obra: "CCA 002 - Projeto Beta",
    contratosAnexados: 2,
    vistoriasPendentes: 1,
    vistoriasAtraso: 1,
    alertasAtivos: 2,
    alertasResolvidos: 0
  },
  {
    obra: "CCA 003 - Projeto Gamma",
    contratosAnexados: 4,
    vistoriasPendentes: 0,
    vistoriasAtraso: 0,
    alertasAtivos: 0,
    alertasResolvidos: 4
  }
];

const mockDestinatarios = [
  {
    id: 1,
    obra: "CCA 001 - Projeto Alpha",
    responsavel: "João Silva",
    email: "joao.silva@empresa.com",
    cargo: "Coordenador de Obra"
  },
  {
    id: 2,
    obra: "CCA 002 - Projeto Beta",
    responsavel: "Maria Santos",
    email: "maria.santos@empresa.com",
    cargo: "Engenheira Responsável"
  }
];

const statusChartData = [
  { name: 'Regulares', value: 45, color: '#22c55e' },
  { name: 'Pendentes', value: 30, color: '#f59e0b' },
  { name: 'Atrasadas', value: 25, color: '#ef4444' }
];

const obraChartData = [
  { obra: 'CCA 001', regulares: 8, pendentes: 2, atrasadas: 0 },
  { obra: 'CCA 002', regulares: 5, pendentes: 3, atrasadas: 2 },
  { obra: 'CCA 003', regulares: 12, pendentes: 1, atrasadas: 0 }
];

// Parâmetros de Alertas - Alojamento
const parametrosAlertasAlojamento = [
  { parametro: "Vistoria próxima ao vencimento", valor: "15 dias antes", tipo: "Temporal" },
  { parametro: "Vistoria vencida", valor: "Imediato", tipo: "Crítico" },
  { parametro: "Contrato sem vistoria inicial", valor: "7 dias após assinatura", tipo: "Alerta" },
  { parametro: "Documentação pendente", valor: "5 dias", tipo: "Alerta" }
];

// Exigências - Alojamento
const exigenciasAlojamento = [
  { exigencia: "Vistoria inicial obrigatória", prazo: "Até 7 dias após contrato", status: "Ativo" },
  { exigencia: "Vistoria periódica trimestral", prazo: "A cada 90 dias", status: "Ativo" },
  { exigencia: "Registro fotográfico completo", prazo: "Em toda vistoria", status: "Ativo" },
  { exigencia: "Aprovação do gestor", prazo: "Antes da ocupação", status: "Ativo" }
];

export default function RelatoriosAlertasAlojamento() {
  const [filtroObra, setFiltroObra] = useState('todas');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pendente':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">⏳ Pendente</Badge>;
      case 'Anexada':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">✅ Anexada</Badge>;
      case 'Atrasada':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">🚨 Atrasada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAlertaBadge = (situacao: string) => {
    return situacao === 'Ativo' 
      ? <Badge className="bg-red-100 text-red-800 hover:bg-red-100">🔴 Ativo</Badge>
      : <Badge className="bg-green-100 text-green-800 hover:bg-green-100">✅ Resolvido</Badge>;
  };

  const getDiasRestantesColor = (dias: number) => {
    if (dias < 0) return 'text-red-600 font-bold';
    if (dias <= 7) return 'text-orange-600 font-semibold';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatórios & Alertas - Alojamento</h1>
            <p className="text-muted-foreground">Gestão consolidada de contratos, vistorias e alertas automáticos</p>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contratos com Vistoria Pendente</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">5</div>
              <p className="text-xs text-muted-foreground">Total aguardando vistoria</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximas do Prazo</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">3</div>
              <p className="text-xs text-muted-foreground">Vencimento em 7 dias</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vistorias em Atraso</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">2</div>
              <p className="text-xs text-muted-foreground">Prazo vencido</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Regularização</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">75%</div>
              <Progress value={75} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Alertas Críticos */}
        {mockContratos.filter(c => c.diasRestantes < 0 || c.diasRestantes <= 7).length > 0 && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Atenção:</strong> Existem {mockContratos.filter(c => c.diasRestantes < 0).length} vistorias em atraso 
              e {mockContratos.filter(c => c.diasRestantes <= 7 && c.diasRestantes >= 0).length} próximas do prazo.
            </AlertDescription>
          </Alert>
        )}

        {/* Tabs Principal */}
        <Tabs defaultValue="gestao" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="gestao">Gestão de Contratos</TabsTrigger>
            <TabsTrigger value="relatorio">Relatório por Obra</TabsTrigger>
            <TabsTrigger value="parametros">Parâmetros</TabsTrigger>
            <TabsTrigger value="destinatarios">Destinatários</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>

          {/* Gestão de Contratos e Vistorias */}
          <TabsContent value="gestao" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Gestão de Contratos e Vistorias
                </CardTitle>
                <CardDescription>
                  Acompanhamento de contratos anexados e prazos de vistoria
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filtros */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={filtroObra} onValueChange={setFiltroObra}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Filtrar por obra" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as obras</SelectItem>
                      <SelectItem value="cca001">CCA 001 - Projeto Alpha</SelectItem>
                      <SelectItem value="cca002">CCA 002 - Projeto Beta</SelectItem>
                      <SelectItem value="cca003">CCA 003 - Projeto Gamma</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Status da vistoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os status</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="anexada">Anexada</SelectItem>
                      <SelectItem value="atrasada">Atrasada</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" className="ml-auto">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Relatório
                  </Button>
                </div>

                {/* Tabela */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fornecedor</TableHead>
                        <TableHead>Obra/CCA</TableHead>
                        <TableHead className="text-center">Contrato Anexado</TableHead>
                        <TableHead>Data Anexação</TableHead>
                        <TableHead className="text-center">Dias Restantes</TableHead>
                        <TableHead>Status Vistoria</TableHead>
                        <TableHead>Data Vistoria</TableHead>
                        <TableHead>Situação Alerta</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockContratos.map((contrato) => (
                        <TableRow key={contrato.id}>
                          <TableCell className="font-medium">{contrato.fornecedor}</TableCell>
                          <TableCell>{contrato.obra}</TableCell>
                          <TableCell className="text-center">
                            {contrato.contratoAnexado ? '✅' : '❌'}
                          </TableCell>
                          <TableCell>{contrato.dataAnexacao}</TableCell>
                          <TableCell className={`text-center ${getDiasRestantesColor(contrato.diasRestantes)}`}>
                            {contrato.diasRestantes < 0 
                              ? `${Math.abs(contrato.diasRestantes)} dias em atraso`
                              : `${contrato.diasRestantes} dias`
                            }
                          </TableCell>
                          <TableCell>{getStatusBadge(contrato.statusVistoria)}</TableCell>
                          <TableCell>{contrato.dataVistoria || '-'}</TableCell>
                          <TableCell>{getAlertaBadge(contrato.situacaoAlerta)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Relatório Consolidado por Obra */}
          <TabsContent value="relatorio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Relatório Consolidado por Obra/CCA
                </CardTitle>
                <CardDescription>
                  Visão consolidada de contratos e vistorias por obra
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Obra/CCA</TableHead>
                        <TableHead className="text-center">Contratos Anexados</TableHead>
                        <TableHead className="text-center">Vistorias Pendentes</TableHead>
                        <TableHead className="text-center">Vistorias em Atraso</TableHead>
                        <TableHead className="text-center">Alertas Ativos</TableHead>
                        <TableHead className="text-center">Alertas Resolvidos</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockRelatorioPorObra.map((obra, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{obra.obra}</TableCell>
                          <TableCell className="text-center">{obra.contratosAnexados}</TableCell>
                          <TableCell className="text-center text-orange-600 font-medium">
                            {obra.vistoriasPendentes}
                          </TableCell>
                          <TableCell className="text-center text-red-600 font-medium">
                            {obra.vistoriasAtraso}
                          </TableCell>
                          <TableCell className="text-center text-red-600 font-medium">
                            {obra.alertasAtivos}
                          </TableCell>
                          <TableCell className="text-center text-green-600 font-medium">
                            {obra.alertasResolvidos}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Parâmetros e Exigências */}
          <TabsContent value="parametros" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Parâmetros de Alertas - Alojamento
                </CardTitle>
                <CardDescription>
                  Configuração de alertas automáticos para o módulo de alojamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Parâmetro</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Tipo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parametrosAlertasAlojamento.map((param, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{param.parametro}</TableCell>
                          <TableCell>{param.valor}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                param.tipo === 'Crítico' ? 'destructive' : 
                                param.tipo === 'Alerta' ? 'default' : 
                                'secondary'
                              }
                            >
                              {param.tipo}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  Exigências - Alojamento
                </CardTitle>
                <CardDescription>
                  Requisitos obrigatórios do módulo de alojamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Exigência</TableHead>
                        <TableHead>Prazo</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {exigenciasAlojamento.map((exig, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{exig.exigencia}</TableCell>
                          <TableCell>{exig.prazo}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              {exig.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuração de Destinatários */}
          <TabsContent value="destinatarios" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Configuração de Destinatários
                </CardTitle>
                <CardDescription>
                  Cadastro de responsáveis por obra para recebimento de alertas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-end">
                  <Button>
                    <Users className="h-4 w-4 mr-2" />
                    Adicionar Destinatário
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Obra/CCA</TableHead>
                        <TableHead>Responsável</TableHead>
                        <TableHead>E-mail</TableHead>
                        <TableHead>Cargo</TableHead>
                        <TableHead className="text-center">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockDestinatarios.map((destinatario) => (
                        <TableRow key={destinatario.id}>
                          <TableCell className="font-medium">{destinatario.obra}</TableCell>
                          <TableCell>{destinatario.responsavel}</TableCell>
                          <TableCell className="font-mono text-sm">{destinatario.email}</TableCell>
                          <TableCell>{destinatario.cargo}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center gap-2">
                              <Button variant="outline" size="sm">Editar</Button>
                              <Button variant="outline" size="sm">Excluir</Button>
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

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico Pizza - Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Status</CardTitle>
                  <CardDescription>Situação atual das vistorias</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {statusChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Gráfico Barras - Por Obra */}
              <Card>
                <CardHeader>
                  <CardTitle>Situação por Obra/CCA</CardTitle>
                  <CardDescription>Comparativo entre obras</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={obraChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="obra" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="regulares" fill="#22c55e" name="Regulares" />
                      <Bar dataKey="pendentes" fill="#f59e0b" name="Pendentes" />
                      <Bar dataKey="atrasadas" fill="#ef4444" name="Atrasadas" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}