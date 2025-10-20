import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { 
  TrendingUp, Clock, CheckCircle2, AlertTriangle, FileX, Calendar, 
  Download, Send, Save, Filter, ChevronRight 
} from "lucide-react";
import { useState } from "react";

export default function DashboardMobilizacao() {
  const [periodoFilter, setPeriodoFilter] = useState("30");
  const [origemFilter, setOrigemFilter] = useState("ambos");

  // Mock data - KPIs
  const kpis = {
    entregasNoPrazo: 78,
    aptosFinais: { qtd: 34, perc: 76 },
    coberturaCriticos: 85,
    taxaIlegiveis: 12,
    backlogCritico: 23,
    agingBacklog: 8,
    tempoMedioApto: 5,
    coAdmissaoPrazo: 82
  };

  // Dados do funil/pirâmide
  const dadosFunil = [
    { nivel: "Exigidos (Críticos)", valor: 150, perc: 100 },
    { nivel: "Recebidos", valor: 135, perc: 90 },
    { nivel: "Legíveis", valor: 120, perc: 80 },
    { nivel: "Validados", valor: 105, perc: 70 },
    { nivel: "Apto Final", valor: 90, perc: 60 }
  ];

  // Pizza - Status atual
  const dadosStatusPizza = [
    { nome: "Apto", valor: 34, cor: "#10b981" },
    { nome: "Condicional", valor: 12, cor: "#eab308" },
    { nome: "Reprovado", valor: 5, cor: "#ef4444" }
  ];

  // Barras comparativas por CCA
  const dadosBarrasCCA = [
    { cca: "CCA 023101", entregasPrazo: 85, coberturaCriticos: 92, aptosFinais: 78 },
    { cca: "CCA 024502", entregasPrazo: 72, coberturaCriticos: 80, aptosFinais: 68 },
    { cca: "CCA 025103", entregasPrazo: 68, coberturaCriticos: 75, aptosFinais: 65 }
  ];

  // Heatmap - Pendências críticas
  const dadosHeatmap = [
    { cca: "CCA 023101", ctps: 2, aso: 1, compEndereco: 3, certificado: 0 },
    { cca: "CCA 024502", ctps: 4, aso: 2, compEndereco: 1, certificado: 2 },
    { cca: "CCA 025103", ctps: 1, aso: 3, compEndereco: 2, certificado: 1 }
  ];

  // Linha - Evolução diária
  const dadosEvolucaoDiaria = [
    { dia: "01/03", perc: 65 },
    { dia: "05/03", perc: 68 },
    { dia: "10/03", perc: 72 },
    { dia: "15/03", perc: 74 },
    { dia: "20/03", perc: 76 },
    { dia: "25/03", perc: 78 },
    { dia: "30/03", perc: 78 }
  ];

  // Backlog de regularização
  const backlogRegularizacao = [
    { colaborador: "Jean Anderson C. Sobrinho", cca: "CCA 023101", documento: "CTPS Digital", status: "Pendente", dataR: "15/04/2025", diasR: 2, responsavel: "Maria Silva" },
    { colaborador: "Carlos Eduardo Mendes", cca: "CCA 024502", documento: "Cartão SUS", status: "Em Atraso", dataR: "10/04/2025", diasR: -3, responsavel: "João Santos" },
    { colaborador: "Ana Paula Costa", cca: "CCA 023101", documento: "ASO", status: "Ilegível", dataR: "18/04/2025", diasR: 5, responsavel: "Maria Silva" }
  ];

  // Ranking por responsável
  const rankingResponsavel = [
    { responsavel: "Maria Silva", entregasPrazo: 85, coberturaCriticos: 92, ilegiveis: 8, aptoDia: 2.3 },
    { responsavel: "João Santos", entregasPrazo: 72, coberturaCriticos: 80, ilegiveis: 15, aptoDia: 1.8 },
    { responsavel: "Pedro Oliveira", entregasPrazo: 68, coberturaCriticos: 75, ilegiveis: 18, aptoDia: 1.5 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendente": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Em Atraso": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Ilegível": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="h-full flex flex-col p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Dashboard - Gestão de Documentação de Mobilização</h1>
          <p className="text-xs text-muted-foreground">45 colaboradores • 3 CCAs • 2 obras (filtros aplicados)</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline"><Download className="h-4 w-4 mr-1" />Exportar PDF</Button>
          <Button size="sm" variant="outline"><Download className="h-4 w-4 mr-1" />Exportar Excel</Button>
          <Button size="sm" variant="outline"><Send className="h-4 w-4 mr-1" />Enviar Snapshot</Button>
          <Button size="sm" variant="outline"><Save className="h-4 w-4 mr-1" />Salvar Visão</Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select defaultValue="todas">
            <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder="Obra / CCA" /></SelectTrigger>
            <SelectContent><SelectItem value="todas">Todas as Obras</SelectItem></SelectContent>
          </Select>
          <Select defaultValue="todos">
            <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue placeholder="Supervisor" /></SelectTrigger>
            <SelectContent><SelectItem value="todos">Todos</SelectItem></SelectContent>
          </Select>
          <Select defaultValue="todos">
            <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder="Responsável" /></SelectTrigger>
            <SelectContent><SelectItem value="todos">Todos</SelectItem></SelectContent>
          </Select>
          <Select value={periodoFilter} onValueChange={setPeriodoFilter}>
            <SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="14">Últimos 14 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
          <Select value={origemFilter} onValueChange={setOrigemFilter}>
            <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ambos">Ambos</SelectItem>
              <SelectItem value="candidato">Candidato</SelectItem>
              <SelectItem value="coadmissao">CoAdmissão Interna</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="todos">
            <SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Criticidade" /></SelectTrigger>
            <SelectContent><SelectItem value="todos">Todos</SelectItem></SelectContent>
          </Select>
          <Select defaultValue="todos">
            <SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Categoria" /></SelectTrigger>
            <SelectContent><SelectItem value="todos">Todas</SelectItem></SelectContent>
          </Select>
          <Select defaultValue="todos">
            <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent><SelectItem value="todos">Todos</SelectItem></SelectContent>
          </Select>
        </div>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-8 gap-2">
        <Card className="p-2">
          <p className="text-xs text-muted-foreground">Entregas no Prazo</p>
          <p className="text-xl font-bold text-green-600">{kpis.entregasNoPrazo}%</p>
        </Card>
        <Card className="p-2">
          <p className="text-xs text-muted-foreground">Aptos Finais</p>
          <p className="text-xl font-bold">{kpis.aptosFinais.qtd} <span className="text-sm">({kpis.aptosFinais.perc}%)</span></p>
        </Card>
        <Card className="p-2">
          <p className="text-xs text-muted-foreground">Cobertura Críticos</p>
          <p className="text-xl font-bold text-blue-600">{kpis.coberturaCriticos}%</p>
        </Card>
        <Card className="p-2">
          <p className="text-xs text-muted-foreground">Taxa Ilegíveis</p>
          <p className="text-xl font-bold text-orange-600">{kpis.taxaIlegiveis}%</p>
        </Card>
        <Card className="p-2">
          <p className="text-xs text-muted-foreground">Backlog Crítico</p>
          <p className="text-xl font-bold text-red-600">{kpis.backlogCritico}</p>
        </Card>
        <Card className="p-2">
          <p className="text-xs text-muted-foreground">Aging Backlog</p>
          <p className="text-xl font-bold">{kpis.agingBacklog} dias</p>
        </Card>
        <Card className="p-2">
          <p className="text-xs text-muted-foreground">Tempo D0→Apto</p>
          <p className="text-xl font-bold">{kpis.tempoMedioApto} dias</p>
        </Card>
        <Card className="p-2">
          <p className="text-xs text-muted-foreground">CoAdm no Prazo</p>
          <p className="text-xl font-bold text-green-600">{kpis.coAdmissaoPrazo}%</p>
        </Card>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-3 pr-3">
          {/* Gráficos - Linha 1 */}
          <div className="grid grid-cols-3 gap-3">
            {/* Funil de Entrega */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Funil de Entrega por CCA</CardTitle>
              </CardHeader>
              <CardContent className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosFunil} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" fontSize={10} />
                    <YAxis dataKey="nivel" type="category" width={100} fontSize={10} />
                    <Tooltip />
                    <Bar dataKey="valor" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pizza Status */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Status Atual</CardTitle>
                  <Tabs value={origemFilter} onValueChange={setOrigemFilter} className="w-auto">
                    <TabsList className="h-7">
                      <TabsTrigger value="candidato" className="text-xs px-2">Candidato</TabsTrigger>
                      <TabsTrigger value="coadmissao" className="text-xs px-2">CoAdmissão</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={dadosStatusPizza} dataKey="valor" nameKey="nome" cx="50%" cy="50%" outerRadius={60} label fontSize={10}>
                      {dadosStatusPizza.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.cor} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Evolução Diária */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Evolução Entregas no Prazo</CardTitle>
              </CardHeader>
              <CardContent className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dadosEvolucaoDiaria}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dia" fontSize={10} />
                    <YAxis fontSize={10} />
                    <Tooltip />
                    <Line type="monotone" dataKey="perc" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos - Linha 2 */}
          <div className="grid grid-cols-2 gap-3">
            {/* Barras Comparativas */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Comparativo por CCA</CardTitle>
              </CardHeader>
              <CardContent className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosBarrasCCA}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="cca" fontSize={10} />
                    <YAxis fontSize={10} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Bar dataKey="entregasPrazo" name="% Entregas Prazo" fill="#10b981" />
                    <Bar dataKey="coberturaCriticos" name="% Cobertura Críticos" fill="#3b82f6" />
                    <Bar dataKey="aptosFinais" name="% Aptos Finais" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Heatmap */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Heatmap - Pendências Críticas (CCA × Tipo)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-medium">CCA</th>
                        <th className="text-center p-2 font-medium">CTPS</th>
                        <th className="text-center p-2 font-medium">ASO</th>
                        <th className="text-center p-2 font-medium">Comp. End.</th>
                        <th className="text-center p-2 font-medium">Certificado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dadosHeatmap.map((row, idx) => (
                        <tr key={idx} className="border-b hover:bg-accent/50 cursor-pointer">
                          <td className="p-2 font-medium">{row.cca}</td>
                          <td className="text-center p-2">
                            <span className={`inline-block px-2 py-1 rounded ${row.ctps > 2 ? 'bg-red-100 text-red-800' : row.ctps > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                              {row.ctps}
                            </span>
                          </td>
                          <td className="text-center p-2">
                            <span className={`inline-block px-2 py-1 rounded ${row.aso > 2 ? 'bg-red-100 text-red-800' : row.aso > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                              {row.aso}
                            </span>
                          </td>
                          <td className="text-center p-2">
                            <span className={`inline-block px-2 py-1 rounded ${row.compEndereco > 2 ? 'bg-red-100 text-red-800' : row.compEndereco > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                              {row.compEndereco}
                            </span>
                          </td>
                          <td className="text-center p-2">
                            <span className={`inline-block px-2 py-1 rounded ${row.certificado > 2 ? 'bg-red-100 text-red-800' : row.certificado > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                              {row.certificado}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabelas */}
          <div className="grid grid-cols-2 gap-3">
            {/* Backlog de Regularização */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Backlog de Regularização</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Colaborador</TableHead>
                      <TableHead className="text-xs">CCA</TableHead>
                      <TableHead className="text-xs">Documento</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Data R</TableHead>
                      <TableHead className="text-xs text-right">Dias p/ R</TableHead>
                      <TableHead className="text-xs">Responsável</TableHead>
                      <TableHead className="text-xs"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {backlogRegularizacao.map((item, idx) => (
                      <TableRow key={idx} className="hover:bg-accent/50">
                        <TableCell className="text-xs">{item.colaborador}</TableCell>
                        <TableCell className="text-xs">{item.cca}</TableCell>
                        <TableCell className="text-xs">{item.documento}</TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${getStatusColor(item.status)}`} variant="secondary">
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{item.dataR}</TableCell>
                        <TableCell className={`text-xs text-right font-medium ${item.diasR < 0 ? 'text-red-600' : 'text-foreground'}`}>
                          {item.diasR < 0 ? `${Math.abs(item.diasR)} atraso` : item.diasR}
                        </TableCell>
                        <TableCell className="text-xs">{item.responsavel}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <ChevronRight className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Ranking por Responsável */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Ranking por Responsável</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Responsável</TableHead>
                      <TableHead className="text-xs text-right">% Entregas Prazo</TableHead>
                      <TableHead className="text-xs text-right">Cobertura Críticos %</TableHead>
                      <TableHead className="text-xs text-right">Ilegíveis %</TableHead>
                      <TableHead className="text-xs text-right">Apto/dia</TableHead>
                      <TableHead className="text-xs"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rankingResponsavel.map((item, idx) => (
                      <TableRow key={idx} className="hover:bg-accent/50">
                        <TableCell className="text-xs font-medium">{item.responsavel}</TableCell>
                        <TableCell className="text-xs text-right">{item.entregasPrazo}%</TableCell>
                        <TableCell className="text-xs text-right">{item.coberturaCriticos}%</TableCell>
                        <TableCell className="text-xs text-right">{item.ilegiveis}%</TableCell>
                        <TableCell className="text-xs text-right">{item.aptoDia}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                            Ver pendências
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
