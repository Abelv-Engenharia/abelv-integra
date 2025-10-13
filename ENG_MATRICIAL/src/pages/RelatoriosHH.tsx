import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronRight, ArrowLeft } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from 'recharts';
import { useOS } from "@/contexts/OSContext";

// Mock data - Cenário real: Ricardo (Mecânica) e Elton (Elétrica)
const mockDados = [
  {
    competencia: "2024-03",
    engenheiro: "Elton",
    disciplina: "ELETRICA",
    capacidade: 190,
    hhApropriado: 158,
    cobertura: 83.2,
    ossConcluidas: 5,
    valorFinal: 125000,
    hhAdicional: 12,
    ccasTop: ["CCA-001", "CCA-003", "CCA-005"]
  },
  {
    competencia: "2024-03",
    engenheiro: "Ricardo",
    disciplina: "MECANICA",
    capacidade: 190,
    hhApropriado: 142,
    cobertura: 74.7,
    ossConcluidas: 3,
    valorFinal: 89000,
    hhAdicional: 8,
    ccasTop: ["CCA-002", "CCA-004"]
  },
  {
    competencia: "2024-02",
    engenheiro: "Elton",
    disciplina: "ELETRICA",
    capacidade: 190,
    hhApropriado: 152,
    cobertura: 80.0,
    ossConcluidas: 4,
    valorFinal: 118000,
    hhAdicional: 10,
    ccasTop: ["CCA-001", "CCA-003"]
  },
  {
    competencia: "2024-02",
    engenheiro: "Ricardo",
    disciplina: "MECANICA",
    capacidade: 190,
    hhApropriado: 134,
    cobertura: 70.5,
    ossConcluidas: 3,
    valorFinal: 87000,
    hhAdicional: 6,
    ccasTop: ["CCA-002", "CCA-004"]
  },
  {
    competencia: "2024-01",
    engenheiro: "Elton",
    disciplina: "ELETRICA",
    capacidade: 190,
    hhApropriado: 145,
    cobertura: 76.3,
    ossConcluidas: 4,
    valorFinal: 95000,
    hhAdicional: 8,
    ccasTop: ["CCA-001", "CCA-005"]
  },
  {
    competencia: "2024-01",
    engenheiro: "Ricardo",
    disciplina: "MECANICA",
    capacidade: 190,
    hhApropriado: 128,
    cobertura: 67.4,
    ossConcluidas: 2,
    valorFinal: 75000,
    hhAdicional: 5,
    ccasTop: ["CCA-002"]
  }
];

const mockDrillDown = [
  {
    cca: "CCA-001",
    osId: "OS-2024-001",
    cliente: "Petrobras",
    familiaPacote: "Elétrica / Automação",
    hhPlanejado: 80,
    hhAdicionalAprovado: 12,
    hhAprovadoTotal: 92,
    valorFinal: 45000,
    dataEntrega: "2024-03-15",
    competencia: "2024-03"
  },
  {
    cca: "CCA-001",
    osId: "OS-2024-002",
    cliente: "Vale",
    familiaPacote: "Elétrica / Instrumentação",
    hhPlanejado: 65,
    hhAdicionalAprovado: 8,
    hhAprovadoTotal: 73,
    valorFinal: 38000,
    dataEntrega: "2024-03-22",
    competencia: "2024-03"
  }
];

const getCoberturaBadge = (cobertura: number) => {
  if (cobertura >= 80) return <Badge className="bg-green-100 text-green-800">Verde</Badge>;
  if (cobertura >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Amarelo</Badge>;
  return <Badge variant="destructive">Vermelho</Badge>;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Dados para gráficos - separados por engenheiro
const dadosLinha = [
  { 
    competencia: '2024-01', 
    Elton: 76.3, 
    Ricardo: 67.4, 
    meta: 80 
  },
  { 
    competencia: '2024-02', 
    Elton: 80.0, 
    Ricardo: 70.5, 
    meta: 80 
  },
  { 
    competencia: '2024-03', 
    Elton: 83.2, 
    Ricardo: 74.7, 
    meta: 80 
  }
];

const dadosBarras = [
  { competencia: '2024-01', Elton: 145, Ricardo: 128 },
  { competencia: '2024-02', Elton: 152, Ricardo: 134 },
  { competencia: '2024-03', Elton: 158, Ricardo: 142 }
];

// Dados para cálculo de saldos
const calcularSaldos = (engenheiro: string) => {
  const dadosEng = mockDados.filter(d => d.engenheiro === engenheiro);
  const mesAtual = dadosEng.find(d => d.competencia === "2024-03");
  const totalAno = dadosEng.reduce((acc, d) => acc + d.hhApropriado, 0);
  
  const metaMensal = 190; // Meta mensal = capacidade total (190h)
  const metaAnual = 190 * 12; // 2280h anuais
  
  return {
    saldoMes: mesAtual ? (metaMensal - mesAtual.hhApropriado) : metaMensal,
    saldoAno: metaAnual - totalAno,
    coberturaAtual: mesAtual?.cobertura || 0,
    totalAno,
    percentualMensal: mesAtual ? (mesAtual.hhApropriado / metaMensal) * 100 : 0
  };
};

const heatmapData = [
  { 
    engenheiro: 'Elton (Elétrica)', 
    jan: 76.3, 
    fev: 80.0, 
    mar: 83.2,
    disciplina: 'ELETRICA'
  },
  { 
    engenheiro: 'Ricardo (Mecânica)', 
    jan: 67.4, 
    fev: 70.5, 
    mar: 74.7,
    disciplina: 'MECANICA'
  }
];

export default function RelatoriosHH() {
  const { osList } = useOS();
  const [filtroCompetencia, setFiltroCompetencia] = useState("2024-03");
  const [drillDownCCA, setDrillDownCCA] = useState<string | null>(null);
  
  // Calcular estatísticas reais das OS quando disponíveis
  const osComHH = osList.filter(os => os.hhPlanejado > 0 || os.hhAdicional > 0);
  const totalHHReal = osComHH.reduce((total, os) => total + (os.hhPlanejado || 0) + (os.hhAdicional || 0), 0);
  const osElétrica = osComHH.filter(os => os.disciplina === 'Elétrica');
  const osMecânica = osComHH.filter(os => os.disciplina === 'Mecânica');
  
  const dadosFiltrados = mockDados.filter(item => item.competencia === filtroCompetencia);
  
  // Saldos por engenheiro
  const saldosElton = calcularSaldos("Elton");
  const saldosRicardo = calcularSaldos("Ricardo");
  
  // Cálculos dos cards
  const totalHH = dadosFiltrados.reduce((acc, item) => acc + item.hhApropriado, 0);
  const totalCapacidade = dadosFiltrados.length * 190;
  const coberturaTotal = (totalHH / totalCapacidade) * 100;
  
  const eltonData = dadosFiltrados.find(item => item.engenheiro === "Elton");
  const ricardoData = dadosFiltrados.find(item => item.engenheiro === "Ricardo");
  
  const mesesAcima80Elton = dadosLinha.filter(item => item.Elton >= 80).length;
  const mesesAcima80Ricardo = dadosLinha.filter(item => item.Ricardo >= 80).length;

  if (drillDownCCA) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setDrillDownCCA(null)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Drill-down por CCA: {drillDownCCA}</h1>
            <p className="text-muted-foreground">Detalhamento das ordens de serviço</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ordens de Serviço - {drillDownCCA}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>CCA</TableHead>
                    <TableHead>OS</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Família/Pacote</TableHead>
                    <TableHead>HH Planejado</TableHead>
                    <TableHead>HH Adicional</TableHead>
                    <TableHead>HH Total</TableHead>
                    <TableHead>Valor Final</TableHead>
                    <TableHead>Data Entrega</TableHead>
                    <TableHead>Competência</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDrillDown.map((item, index) => {
                    const clienteFormatado = item.cliente.charAt(0).toUpperCase() + item.cliente.slice(1).toLowerCase();
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.cca}</TableCell>
                        <TableCell>{item.osId}</TableCell>
                        <TableCell>{clienteFormatado}</TableCell>
                        <TableCell>{item.familiaPacote}</TableCell>
                        <TableCell>{item.hhPlanejado}h</TableCell>
                        <TableCell>{item.hhAdicionalAprovado}h</TableCell>
                        <TableCell className="font-semibold">{item.hhAprovadoTotal}h</TableCell>
                        <TableCell>{formatCurrency(item.valorFinal)}</TableCell>
                        <TableCell>{new Date(item.dataEntrega).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>{item.competencia}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">HH Apropriado por Competência</h1>
          <p className="text-muted-foreground">Engenharia Matricial - Cobertura e Performance</p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <Label>Competência</Label>
              <Select value={filtroCompetencia} onValueChange={setFiltroCompetencia}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-03">Mar/2024</SelectItem>
                  <SelectItem value="2024-02">Fev/2024</SelectItem>
                  <SelectItem value="2024-01">Jan/2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Engenheiro</Label>
              <Select defaultValue="ambos">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ambos">Elton, Ricardo</SelectItem>
                  <SelectItem value="elton">Elton</SelectItem>
                  <SelectItem value="ricardo">Ricardo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Disciplina</Label>
              <Select defaultValue="ambas">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ambas">Ambas</SelectItem>
                  <SelectItem value="eletrica">Elétrica</SelectItem>
                  <SelectItem value="mecanica">Mecânica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Cliente</Label>
              <Select defaultValue="todos">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="petrobras">Petrobras</SelectItem>
                  <SelectItem value="vale">Vale</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>CCA</Label>
              <Input placeholder="Buscar CCA..." />
            </div>

            <div>
              <Label>Família/Pacote</Label>
              <Select defaultValue="todas">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="automacao">Automação</SelectItem>
                  <SelectItem value="instrumentacao">Instrumentação</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de métricas - Visão geral por engenheiro */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card Elton */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Elton - Elétrica</span>
              {getCoberturaBadge(saldosElton.coberturaAtual)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Cobertura atual</p>
                <p className="text-2xl font-bold">{saldosElton.percentualMensal.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">da meta mensal</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">HH apropriado mês</p>
                <p className="text-xl font-semibold">{eltonData?.hhApropriado || 0}h</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saldo para meta mês</p>
                <p className={`text-lg font-bold ${saldosElton.saldoMes <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {saldosElton.saldoMes <= 0 ? '+' : ''}{Math.abs(saldosElton.saldoMes).toFixed(0)}h
                </p>
                <p className="text-xs text-muted-foreground">para 190h</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saldo para meta ano</p>
                <p className={`text-lg font-bold ${saldosElton.saldoAno <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {saldosElton.saldoAno <= 0 ? '+' : ''}{Math.abs(saldosElton.saldoAno).toFixed(0)}h
                </p>
                <p className="text-xs text-muted-foreground">para 2.280h</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Meses ≥80% no período</p>
                <p className="text-xl font-semibold text-green-600">{mesesAcima80Elton}/3</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card Ricardo */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Ricardo - Mecânica</span>
              {getCoberturaBadge(saldosRicardo.coberturaAtual)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Cobertura atual</p>
                <p className="text-2xl font-bold">{saldosRicardo.percentualMensal.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">da meta mensal</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">HH apropriado mês</p>
                <p className="text-xl font-semibold">{ricardoData?.hhApropriado || 0}h</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saldo para meta mês</p>
                <p className={`text-lg font-bold ${saldosRicardo.saldoMes <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {saldosRicardo.saldoMes <= 0 ? '+' : ''}{Math.abs(saldosRicardo.saldoMes).toFixed(0)}h
                </p>
                <p className="text-xs text-muted-foreground">para 190h</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saldo para meta ano</p>
                <p className={`text-lg font-bold ${saldosRicardo.saldoAno <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {saldosRicardo.saldoAno <= 0 ? '+' : ''}{Math.abs(saldosRicardo.saldoAno).toFixed(0)}h
                </p>
                <p className="text-xs text-muted-foreground">para 2.280h</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Meses ≥80% no período</p>
                <p className="text-xl font-semibold text-green-600">{mesesAcima80Ricardo}/3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cards de métricas consolidadas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Cobertura Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">{coberturaTotal.toFixed(1)}%</span>
              {getCoberturaBadge(coberturaTotal)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {totalHH}h / {totalCapacidade}h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Meta Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">190h</div>
            <p className="text-xs text-muted-foreground">por engenheiro</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Meta Anual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">2.280h</div>
            <p className="text-xs text-muted-foreground">por engenheiro</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de linha */}
        <Card>
          <CardHeader>
            <CardTitle>Cobertura % por Engenheiro × Competência</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dadosLinha}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="competencia" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="Elton" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name="Elton (Elétrica)"
                />
                <Line 
                  type="monotone" 
                  dataKey="Ricardo" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Ricardo (Mecânica)"
                />
                <Line 
                  type="monotone" 
                  dataKey="meta" 
                  stroke="#dc2626" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Meta (80%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de barras */}
        <Card>
          <CardHeader>
            <CardTitle>HH Apropriado por Engenheiro</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosBarras}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="competencia" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Elton" fill="#3b82f6" name="Elton (Elétrica)" />
                <Bar dataKey="Ricardo" fill="#10b981" name="Ricardo (Mecânica)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Heatmap - Cobertura % por Engenheiro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Engenheiro</TableHead>
                  <TableHead className="text-center">Jan/24</TableHead>
                  <TableHead className="text-center">Fev/24</TableHead>
                  <TableHead className="text-center">Mar/24</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {heatmapData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.engenheiro}</TableCell>
                    <TableCell className="text-center">
                      <div className={`p-2 rounded text-white font-semibold ${item.jan >= 80 ? 'bg-green-600' : item.jan >= 60 ? 'bg-yellow-600' : 'bg-red-600'}`}>
                        {item.jan}%
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className={`p-2 rounded text-white font-semibold ${item.fev >= 80 ? 'bg-green-600' : item.fev >= 60 ? 'bg-yellow-600' : 'bg-red-600'}`}>
                        {item.fev}%
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className={`p-2 rounded text-white font-semibold ${item.mar >= 80 ? 'bg-green-600' : item.mar >= 60 ? 'bg-yellow-600' : 'bg-red-600'}`}>
                        {item.mar}%
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Tabela principal */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento por Competência × Engenheiro × Disciplina</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Competência</TableHead>
                  <TableHead>Engenheiro</TableHead>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Capacidade</TableHead>
                  <TableHead>HH Apropriado</TableHead>
                  <TableHead>Cobertura %</TableHead>
                  <TableHead># OS</TableHead>
                  <TableHead>Valor Final</TableHead>
                  <TableHead>% HH Adicional</TableHead>
                  <TableHead>CCAs (top 3)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dadosFiltrados
                  .sort((a, b) => a.cobertura - b.cobertura)
                  .map((item, index) => (
                    <TableRow 
                      key={index}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setDrillDownCCA(item.ccasTop[0])}
                    >
                      <TableCell>
                        <ChevronRight className="h-4 w-4" />
                      </TableCell>
                      <TableCell className="font-medium">{item.competencia}</TableCell>
                      <TableCell>{item.engenheiro}</TableCell>
                      <TableCell>{item.disciplina}</TableCell>
                      <TableCell>{item.capacidade}h</TableCell>
                      <TableCell className="font-semibold">{item.hhApropriado}h</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{item.cobertura.toFixed(1)}%</span>
                          {getCoberturaBadge(item.cobertura)}
                        </div>
                      </TableCell>
                      <TableCell>{item.ossConcluidas}</TableCell>
                      <TableCell>{formatCurrency(item.valorFinal)}</TableCell>
                      <TableCell>{((item.hhAdicional / item.hhApropriado) * 100).toFixed(1)}%</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {item.ccasTop.slice(0, 3).join(', ')}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}