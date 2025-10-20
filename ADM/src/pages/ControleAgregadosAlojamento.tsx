import { useState } from "react";
import { Building2, Users, DollarSign, AlertTriangle, FileSpreadsheet, Eye, Edit, Plus, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

// Dados mockados - competência atual
const competenciaAtual = "202412";

// CCAs disponíveis (vem do módulo de cadastro)
const ccas = [
  { id: "CCA001", nome: "Obra Principal" },
  { id: "CCA002", nome: "Expansão Norte" },
  { id: "CCA003", nome: "Manutenção Sul" }
];

// Dados consolidados por CCA (simulando as queries)
const dadosConsolidados = [
  {
    id: "ALJ001",
    alojamento: "Pousada Boa Vista",
    fornecedor: "Pousada Boa Vista Ltda",
    capacidadeContratual: 50,
    ocupacaoReal: 45,
    valorTotal: 67500.00,
    statusLancamento: "lançado",
    contratoRef: "CT001",
    colaboradoresAlocados: [
      { nome: "João Silva", matricula: "12345", checkin: "2024-12-01", checkout: "2024-12-31", dias: 31 },
      { nome: "Maria Santos", matricula: "12346", checkin: "2024-12-05", checkout: "2024-12-31", dias: 27 }
    ]
  },
  {
    id: "ALJ002", 
    alojamento: "Hotel Executivo",
    fornecedor: "Hotel Executivo S.A.",
    capacidadeContratual: 80,
    ocupacaoReal: 75,
    valorTotal: 0,
    statusLancamento: "não_lançado",
    contratoRef: "CT002",
    colaboradoresAlocados: [
      { nome: "Pedro Costa", matricula: "12347", checkin: "2024-12-10", checkout: "2024-12-31", dias: 22 }
    ]
  },
  {
    id: "ALJ003",
    alojamento: "Alojamento Industrial", 
    fornecedor: "Alojamento Industrial",
    capacidadeContratual: 120,
    ocupacaoReal: 130, // Excedente
    valorTotal: 156000.00,
    statusLancamento: "lançado",
    contratoRef: "CT003",
    colaboradoresAlocados: []
  }
];

// Alertas do mês
const alertas = [
  { tipo: "excedente", descricao: "Alojamento Industrial: 130/120 pessoas (excedente de 10)", prioridade: "alta" },
  { tipo: "sem_lancamento", descricao: "Hotel Executivo sem lançamento mensal para dez/2024", prioridade: "media" },
  { tipo: "capacidade", descricao: "Pousada Boa Vista com 90% da capacidade ocupada", prioridade: "baixa" }
];

const ControleAgregadosAlojamento = () => {
  const [ccaSelecionado, setCcaSelecionado] = useState("CCA001");
  const [competencia, setCompetencia] = useState(competenciaAtual);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const toggleRowExpansion = (id: string) => {
    setExpandedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "lançado": return "bg-green-100 text-green-700";
      case "não_lançado": return "bg-red-100 text-red-700";
      case "pendente": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getPrioridadeCor = (prioridade: string) => {
    switch (prioridade) {
      case "alta": return "bg-red-100 text-red-700 border-red-200";
      case "media": return "bg-orange-100 text-orange-700 border-orange-200";
      case "baixa": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Métricas resumo
  const totalOcupacao = dadosConsolidados.reduce((acc, item) => acc + item.ocupacaoReal, 0);
  const totalCapacidade = dadosConsolidados.reduce((acc, item) => acc + item.capacidadeContratual, 0);
  const totalLancado = dadosConsolidados.filter(item => item.statusLancamento === "lançado").length;
  const valorTotalMes = dadosConsolidados.reduce((acc, item) => acc + item.valorTotal, 0);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Controle de Agregados – Alojamento de Colaboradores</h1>
          <p className="text-muted-foreground">Alocações, lançamentos mensais e rateios por CCA</p>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="space-y-2">
            <Label htmlFor="competencia-filter">Competência</Label>
            <Select value={competencia} onValueChange={setCompetencia}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="202412">Dez/2024</SelectItem>
                <SelectItem value="202411">Nov/2024</SelectItem>
                <SelectItem value="202410">Out/2024</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cca-filter">CCA da Obra</Label>
            <Select value={ccaSelecionado} onValueChange={setCcaSelecionado}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o CCA" />
              </SelectTrigger>
              <SelectContent>
                {ccas.map((cca) => (
                  <SelectItem key={cca.id} value={cca.id}>
                    {cca.id} - {cca.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocupação Total</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOcupacao}/{totalCapacidade}</div>
            <p className="text-xs text-muted-foreground">
              {((totalOcupacao / totalCapacidade) * 100).toFixed(1)}% da capacidade
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lançamentos</CardTitle>
            <FileSpreadsheet className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLancado}/{dadosConsolidados.length}</div>
            <p className="text-xs text-muted-foreground">
              alojamentos com lançamento
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {valorTotalMes.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">
              na competência atual
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas</CardTitle>
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertas.length}</div>
            <p className="text-xs text-muted-foreground">
              pendências encontradas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas */}
      {alertas.length > 0 && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <AlertTriangle className="h-5 w-5" />
              Alertas da Competência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alertas.map((alerta, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg border ${getPrioridadeCor(alerta.prioridade)}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{alerta.descricao}</span>
                    <Badge variant="outline" className="text-xs">
                      {alerta.prioridade.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ações principais */}
      <div className="flex flex-wrap gap-3">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Alocação
        </Button>
        <Button variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          Fechamento Competência
        </Button>
        <Button variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          Recalcular Valores
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Gerar PD / Exportar
        </Button>
      </div>

      {/* Tabela Consolidada */}
      <Card>
        <CardHeader>
          <CardTitle>Alojamentos por CCA - {ccas.find(c => c.id === ccaSelecionado)?.nome}</CardTitle>
          <CardDescription>
            Visão consolidada da ocupação e lançamentos da competência {competencia}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Alojamento</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead className="text-right">Capacidade</TableHead>
                  <TableHead className="text-right">Ocupação</TableHead>
                  <TableHead className="text-right">Valor Total</TableHead>
                  <TableHead>Status Lançamento</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dadosConsolidados.map((item) => (
                  <>
                    <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <Collapsible>
                          <CollapsibleTrigger onClick={() => toggleRowExpansion(item.id)}>
                            {expandedRows.includes(item.id) ? 
                              <ChevronDown className="h-4 w-4" /> : 
                              <ChevronRight className="h-4 w-4" />
                            }
                          </CollapsibleTrigger>
                        </Collapsible>
                      </TableCell>
                      <TableCell className="font-medium">{item.alojamento}</TableCell>
                      <TableCell>{item.fornecedor}</TableCell>
                      <TableCell className="text-right">{item.capacidadeContratual}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {item.ocupacaoReal}
                          {item.ocupacaoReal > item.capacidadeContratual && (
                            <Badge variant="outline" className="text-xs bg-red-100 text-red-700">
                              Excedente
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.valorTotal > 0 ? 
                          `R$ ${item.valorTotal.toLocaleString('pt-BR')}` : 
                          "-"
                        }
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.statusLancamento)}>
                          {item.statusLancamento === "lançado" ? "Lançado" : "Não Lançado"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    
                    {/* Linha expandida com detalhes dos colaboradores */}
                    {expandedRows.includes(item.id) && (
                      <TableRow>
                        <TableCell colSpan={8} className="bg-muted/25">
                          <div className="p-4">
                            <h4 className="font-semibold mb-3">Colaboradores Alocados</h4>
                            {item.colaboradoresAlocados.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {item.colaboradoresAlocados.map((colab, idx) => (
                                  <div key={idx} className="bg-background p-3 rounded-lg border">
                                    <div className="font-medium">{colab.nome}</div>
                                    <div className="text-sm text-muted-foreground">Mat: {colab.matricula}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {new Date(colab.checkin).toLocaleDateString('pt-BR')} - {new Date(colab.checkout).toLocaleDateString('pt-BR')}
                                    </div>
                                    <div className="text-sm font-medium text-primary">{colab.dias} dias</div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-muted-foreground">Nenhum colaborador alocado para esta competência.</p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ControleAgregadosAlojamento;