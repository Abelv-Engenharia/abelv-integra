import { useState } from "react";
import { Users, UserCheck, UserX, CalendarOff, Filter, FileDown, Printer, Calendar as CalendarIcon, TrendingUp, TrendingDown, ArrowUpDown, Settings, ClipboardCheck, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useColaboradores } from "@/contexts/ColaboradoresContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Dados CCAs
const ccas = [
  { id: "CCA001", nome: "Obra Principal" },
  { id: "CCA002", nome: "Expansão Norte" },
  { id: "CCA003", nome: "Manutenção Sul" }
];

// Colaboradores Abelv (próprios)
const colaboradoresAbelv = [
  {
    id: 1001,
    nome: "Ana Paula Silva",
    funcao: "Engenheira",
    disciplina: "Civil",
    classificacao: "MO - DIRETA",
    empresa: "Abelv",
    tipo: "Abelv" as const,
    dataInclusao: "2025-01-01"
  },
  {
    id: 1002,
    nome: "Roberto Santos",
    funcao: "Técnico",
    disciplina: "Elétrica",
    classificacao: "MO - DIRETA",
    empresa: "Abelv",
    tipo: "Abelv" as const,
    dataInclusao: "2025-01-01"
  },
  {
    id: 1003,
    nome: "Carlos Eduardo Souza",
    funcao: "Coordenador",
    disciplina: "Mecânica",
    classificacao: "MO - INDIRETA",
    empresa: "Abelv",
    tipo: "Abelv" as const,
    dataInclusao: "2025-01-01"
  },
  {
    id: 1004,
    nome: "Juliana Oliveira",
    funcao: "Administrador",
    disciplina: "Administrativo",
    classificacao: "MO - INDIRETA",
    empresa: "Abelv",
    tipo: "Abelv" as const,
    dataInclusao: "2025-01-05"
  }
];

// Mock de evolução diária (últimos 7 dias)
const evolucaoDiaria = [
  { data: "2025-09-23", mobilizados: 240, presentes: 195, entradas: 2, saidas: 0 },
  { data: "2025-09-24", mobilizados: 242, presentes: 198, entradas: 2, saidas: 0 },
  { data: "2025-09-25", mobilizados: 245, presentes: 201, entradas: 3, saidas: 0 },
  { data: "2025-09-26", mobilizados: 245, presentes: 198, entradas: 0, saidas: 0 },
  { data: "2025-09-27", mobilizados: 243, presentes: 195, entradas: 0, saidas: 2 },
  { data: "2025-09-28", mobilizados: 247, presentes: 202, entradas: 4, saidas: 0 },
  { data: "2025-09-29", mobilizados: 247, presentes: 205, entradas: 0, saidas: 0 }
];

// Parâmetros de Alertas - Mão de Obra
const parametrosAlertasMaoObra = [
  { parametro: "Falta não justificada", valor: "Imediato", tipo: "Alerta" },
  { parametro: "Documentação vencida", valor: "7 dias antes", tipo: "Temporal" },
  { parametro: "Efetivo abaixo do planejado", valor: "> 10%", tipo: "Crítico" },
  { parametro: "Horas extras excessivas", valor: "> 20h/mês", tipo: "Alerta" }
];

// Exigências - Mão de Obra
const exigenciasMaoObra = [
  { exigencia: "ASO válido", prazo: "Obrigatório para admissão", status: "Ativo" },
  { exigencia: "Registro de ponto diário", prazo: "Até 23:59 do dia", status: "Ativo" },
  { exigencia: "Relatório de efetivo mensal", prazo: "Até dia 5 do mês seguinte", status: "Ativo" },
  { exigencia: "Justificativa de faltas", prazo: "Até 2 dias úteis", status: "Ativo" }
];

const RelatorioMaoObra = () => {
  const { toast } = useToast();
  const { colaboradores: colaboradoresTerceiros } = useColaboradores();
  const [ccaSelecionado, setCcaSelecionado] = useState("");
  const [dataInicio, setDataInicio] = useState<Date>();
  const [dataFim, setDataFim] = useState<Date>();

  // Combinar colaboradores Abelv com Terceiros
  const todosColaboradores = [
    ...colaboradoresAbelv,
    ...colaboradoresTerceiros.map(col => ({
      ...col,
      tipo: 'Terceiro' as const
    }))
  ];

  // Calcular totais por tipo
  const totalAbelv = todosColaboradores.filter(c => c.tipo === 'Abelv').length;
  const totalTerceiros = todosColaboradores.filter(c => c.tipo === 'Terceiro').length;
  const totalMobilizados = todosColaboradores.length;

  // Simular presentes (85% dos mobilizados como exemplo)
  const totalPresentes = Math.floor(totalMobilizados * 0.85);
  const totalFaltas = Math.floor(totalMobilizados * 0.10);
  const totalFolgasCampo = Math.floor(totalMobilizados * 0.05);

  // Classificação por tipo
  const classificacaoEfetivo = [
    { 
      tipo: "MO - Direta (Abelv)", 
      mobilizado: colaboradoresAbelv.filter(c => c.classificacao === 'MO - DIRETA').length,
      presente: Math.floor(colaboradoresAbelv.filter(c => c.classificacao === 'MO - DIRETA').length * 0.9),
      planejado: colaboradoresAbelv.filter(c => c.classificacao === 'MO - DIRETA').length + 2
    },
    { 
      tipo: "MO - Indireta (Abelv)", 
      mobilizado: colaboradoresAbelv.filter(c => c.classificacao === 'MO - INDIRETA').length,
      presente: Math.floor(colaboradoresAbelv.filter(c => c.classificacao === 'MO - INDIRETA').length * 0.95),
      planejado: colaboradoresAbelv.filter(c => c.classificacao === 'MO - INDIRETA').length + 1
    },
    { 
      tipo: "Terceiros", 
      mobilizado: totalTerceiros,
      presente: Math.floor(totalTerceiros * 0.82),
      planejado: totalTerceiros + 5
    }
  ];

  // Agrupar por disciplina
  const disciplinasMap = new Map<string, { mobilizado: number; presente: number; planejado: number }>();
  
  todosColaboradores.forEach(col => {
    const current = disciplinasMap.get(col.disciplina) || { mobilizado: 0, presente: 0, planejado: 0 };
    disciplinasMap.set(col.disciplina, {
      mobilizado: current.mobilizado + 1,
      presente: current.presente + Math.floor(Math.random() * 2), // Simular variação
      planejado: current.planejado + 1 + Math.floor(Math.random() * 3)
    });
  });

  const modPorDisciplina = Array.from(disciplinasMap.entries()).map(([disciplina, dados]) => {
    const variacaoSemanaAnterior = Math.floor(Math.random() * 7) - 3; // -3 a +3
    return {
      disciplina,
      mobilizado: dados.mobilizado,
      presente: Math.floor(dados.mobilizado * 0.85),
      planejado: dados.planejado,
      variacao7dias: variacaoSemanaAnterior > 0 ? `+${variacaoSemanaAnterior}` : `${variacaoSemanaAnterior}`
    };
  }).sort((a, b) => b.mobilizado - a.mobilizado);

  const resumoCards = [
    {
      title: "Mobilizados",
      value: totalMobilizados,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Presentes",
      value: totalPresentes,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Faltas",
      value: totalFaltas,
      icon: UserX,
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      title: "Folgas de Campo",
      value: totalFolgasCampo,
      icon: CalendarOff,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  const totalMobilizado = classificacaoEfetivo.reduce((sum, item) => sum + item.mobilizado, 0);
  const totalPresente = classificacaoEfetivo.reduce((sum, item) => sum + item.presente, 0);
  const totalPlanejado = classificacaoEfetivo.reduce((sum, item) => sum + item.planejado, 0);

  const handleExportPDF = () => {
    toast({
      title: "Exportando PDF",
      description: "Relatório detalhado de mão de obra sendo gerado..."
    });
  };

  const handleExportCSV = () => {
    toast({
      title: "Exportando Excel",
      description: "Planilha com dados consolidados sendo gerada..."
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatório de Controle de Mão de Obra</h1>
          <p className="text-muted-foreground">Relatório detalhado de efetivo por tipo e disciplina</p>
        </div>

        {/* Ações */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <FileDown className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <FileDown className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
        </div>
      </div>

      <Tabs defaultValue="relatorio" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="relatorio">Relatório</TabsTrigger>
          <TabsTrigger value="parametros">Parâmetros</TabsTrigger>
        </TabsList>

        <TabsContent value="relatorio" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* CCA */}
            <div className="space-y-2">
              <Label htmlFor="cca-filter">CCA da Obra</Label>
              <Select value={ccaSelecionado} onValueChange={setCcaSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os CCAs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os CCAs</SelectItem>
                  {ccas.map((cca) => (
                    <SelectItem key={cca.id} value={cca.id}>
                      {cca.id} - {cca.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Data Início */}
            <div className="space-y-2">
              <Label>Data Início</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataInicio && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataInicio ? format(dataInicio, "dd/MM/yyyy") : <span>Selecionar data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataInicio}
                    onSelect={setDataInicio}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Data Fim */}
            <div className="space-y-2">
              <Label>Data Fim</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataFim && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataFim ? format(dataFim, "dd/MM/yyyy") : <span>Selecionar data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataFim}
                    onSelect={setDataFim}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button>
              <Filter className="h-4 w-4 mr-2" />
              Aplicar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Informações do Período Selecionado */}
      {(dataInicio || dataFim || ccaSelecionado) && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {ccaSelecionado && (
                <span>
                  <strong>CCA:</strong> {ccas.find(c => c.id === ccaSelecionado)?.id} - {ccas.find(c => c.id === ccaSelecionado)?.nome}
                </span>
              )}
              {dataInicio && (
                <span>
                  <strong>De:</strong> {format(dataInicio, "dd/MM/yyyy")}
                </span>
              )}
              {dataFim && (
                <span>
                  <strong>Até:</strong> {format(dataFim, "dd/MM/yyyy")}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {resumoCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classificação do Efetivo com Planejado vs Realizado */}
        <Card>
          <CardHeader>
            <CardTitle>Classificação do Efetivo</CardTitle>
            <CardDescription>Planejado vs Mobilizado por tipo</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Planejado</TableHead>
                  <TableHead className="text-right">Mobilizado</TableHead>
                  <TableHead className="text-right">Presente</TableHead>
                  <TableHead className="text-right">% Presença</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classificacaoEfetivo.map((item, index) => {
                  const diferenca = item.mobilizado - item.planejado;
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.tipo}</TableCell>
                      <TableCell className="text-right">{item.planejado}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {item.mobilizado}
                          {diferenca !== 0 && (
                            <Badge variant={diferenca > 0 ? "default" : "destructive"} className="ml-1">
                              {diferenca > 0 ? `+${diferenca}` : diferenca}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{item.presente}</TableCell>
                      <TableCell className="text-right">
                        {((item.presente / item.mobilizado) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* MOD por Disciplina com Planejado */}
        <Card>
          <CardHeader>
            <CardTitle>Efetivo por Disciplina</CardTitle>
            <CardDescription>Planejado vs Mobilizado por área técnica</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Disciplina</TableHead>
                  <TableHead className="text-right">Planejado</TableHead>
                  <TableHead className="text-right">Mobilizado</TableHead>
                  <TableHead className="text-right">Variação 7d</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modPorDisciplina.map((item, index) => {
                  const diferenca = item.mobilizado - item.planejado;
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.disciplina}</TableCell>
                      <TableCell className="text-right">{item.planejado}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {item.mobilizado}
                          {diferenca !== 0 && (
                            <Badge variant={diferenca > 0 ? "default" : "destructive"} className="ml-1 text-xs">
                              {diferenca > 0 ? `+${diferenca}` : diferenca}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          variant={item.variacao7dias.startsWith('+') ? 'default' : 
                                  item.variacao7dias.startsWith('-') ? 'destructive' : 'secondary'}
                        >
                          {item.variacao7dias}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Evolução Diária (Timeline) */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução Diária do Efetivo</CardTitle>
          <CardDescription>Acompanhamento dos últimos 7 dias com destaque de variações</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Mobilizados</TableHead>
                <TableHead className="text-right">Presentes</TableHead>
                <TableHead className="text-right">Entradas</TableHead>
                <TableHead className="text-right">Saídas</TableHead>
                <TableHead className="text-right">Variação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evolucaoDiaria.map((dia, index) => {
                const variacaoTotal = dia.entradas - dia.saidas;
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {format(new Date(dia.data), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell className="text-right">{dia.mobilizados}</TableCell>
                    <TableCell className="text-right">{dia.presentes}</TableCell>
                    <TableCell className="text-right">
                      {dia.entradas > 0 && (
                        <Badge variant="default" className="gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {dia.entradas}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {dia.saidas > 0 && (
                        <Badge variant="destructive" className="gap-1">
                          <TrendingDown className="h-3 w-3" />
                          {dia.saidas}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {variacaoTotal !== 0 && (
                        <Badge variant={variacaoTotal > 0 ? "default" : "destructive"}>
                          {variacaoTotal > 0 ? `+${variacaoTotal}` : variacaoTotal}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>


      {/* Totais com Comparação */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Consolidação Geral</CardTitle>
          <CardDescription>Totais (Abelv + Terceiros) - Planejado vs Realizado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Planejado</p>
              <p className="text-2xl font-bold text-foreground">{totalPlanejado}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Mobilizado</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-2xl font-bold text-primary">{totalMobilizado}</p>
                {totalMobilizado !== totalPlanejado && (
                  <Badge variant={totalMobilizado > totalPlanejado ? "default" : "destructive"}>
                    {totalMobilizado > totalPlanejado ? "+" : ""}{totalMobilizado - totalPlanejado}
                  </Badge>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Presente</p>
              <p className="text-2xl font-bold text-green-600">{totalPresente}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">% Presença</p>
              <p className="text-2xl font-bold text-foreground">
                {((totalPresente / totalMobilizado) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="parametros" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Parâmetros de Alertas - Mão de Obra
              </CardTitle>
              <CardDescription>
                Configuração de alertas automáticos para o módulo de mão de obra
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
                    {parametrosAlertasMaoObra.map((param, index) => (
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
                Exigências - Mão de Obra
              </CardTitle>
              <CardDescription>
                Requisitos obrigatórios do módulo de mão de obra
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
                    {exigenciasMaoObra.map((exig, index) => (
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
      </Tabs>
    </div>
  );
};

export default RelatorioMaoObra;