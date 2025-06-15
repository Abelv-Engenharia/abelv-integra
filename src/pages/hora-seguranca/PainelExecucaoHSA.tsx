import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchInspecoesSummary, fetchInspecoesByStatus, fetchInspecoesByMonth, fetchInspecoesByResponsavel, fetchDesviosByInspectionType } from "@/services/horaSegurancaService";
import { Gauge, Check, Clock, AlertTriangle, Search, Plus } from "lucide-react";
import { ResponsiveContainer, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart as ReLineChart, Line, Legend, Pie as RePie, PieChart as RePieChart, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
const COLORS = ["#4285F4", "#34A853", "#FBBC05", "#EA4335", "#8D6E63", "#FF9800", "#7E57C2"];
export default function PainelExecucaoHSA() {
  const [summary, setSummary] = useState<any>(null);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [monthData, setMonthData] = useState<any[]>([]);
  const [respData, setRespData] = useState<any[]>([]);
  const [desvioRespData, setDesvioRespData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filtros - estão apenas visuais por enquanto!
  const [ano, setAno] = useState("todos");
  const [mes, setMes] = useState("todos");
  const [cca, setCca] = useState("todos");
  const [responsavel, setResponsavel] = useState("todos");
  const navigate = useNavigate();
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      // Resumo KPIs
      const resumo = await fetchInspecoesSummary();
      setSummary(resumo);
      // Execução HSA Status
      const status = await fetchInspecoesByStatus();
      setStatusData(status.map((s: any) => ({
        name: s.status,
        value: s.quantidade ?? s.value ?? 0
      })));
      // Evolução Mensal
      const monthly = await fetchInspecoesByMonth();
      setMonthData(monthly.map((s: any, i: number) => ({
        name: `S-${i + 1}`,
        "ACC PREV": s.previsto ?? s.quantidade,
        "ACC REAL": s.realizado ?? s.quantidade
      })));
      // Execução por Responsável
      const responsaveis = await fetchInspecoesByResponsavel();
      setRespData(responsaveis.map((d: any) => ({
        name: d.responsavel,
        "Cancelada": d.cancelada ?? 0,
        "Realizada": d.realizada ?? 0,
        "Não Realizada": d.nao_realizada ?? 0,
        "Realizada (Não Programada)": d["realizada (não programada)"] ?? 0
      })));
      // Desvios Identificados por Responsável (mocked)
      setDesvioRespData(responsaveis.map((d: any) => ({
        name: d.responsavel,
        desvios: Math.floor(Math.random() * 30 + 1) // mock para exemplo
      })));
      // Desvios por Atividade Crítica (pie)
      const pie = await fetchDesviosByInspectionType();
      setPieData(pie.map((d: any) => ({
        name: d.tipo,
        value: d.quantidade
      })));
      setIsLoading(false);
    }
    loadData();
  }, []);

  // Calcula percentuais dos KPIs:
  const totalInspecoes = summary?.totalInspecoes ?? 0;
  const concluidas = summary?.realizadas ?? 0;
  const programadas = summary?.programadas ?? 1;
  const canceladas = summary?.canceladas ?? 0;
  const pendentes = summary ? summary.programadas - summary.realizadas - summary.canceladas : 0;

  // Evita divisão por zero
  const percentConcluidas = programadas > 0 ? Math.round(concluidas / programadas * 100) : 0;
  const percentPendentes = programadas > 0 ? Math.round(pendentes / programadas * 100) : 0;
  // Supondo que em andamento = 0 (mock)
  const percentAndamento = 0;
  return <div className="max-w-7xl mx-auto py-8 animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 px-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Hora da Segurança</h1>
          <p className="text-muted-foreground">
            Visão geral das inspeções de segurança e suas métricas.
          </p>
        </div>
        <div className="flex flex-row gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => navigate("/hora-seguranca/consulta")}>
            <Search className="h-4 w-4" />
            Consultar Inspeções
          </Button>
          <Button className="flex items-center gap-2 font-semibold" onClick={() => navigate("/hora-seguranca/cadastro")}>
            <Plus className="h-4 w-4" />
            Nova Inspeção
          </Button>
        </div>
      </div>

      {/* FILTROS */}
      <Card className="mt-6 mb-6 mx-2 p-0 bg-white">
        <CardHeader className="pb-2 border-b">
          <CardTitle className="text-base">Filtros</CardTitle>
          <CardDescription>Selecione os filtros para visualizar os dados</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="w-[180px]">
              <label className="block text-xs text-muted-foreground mb-1 font-medium">Ano</label>
              <Select value={ano} onValueChange={setAno}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os anos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os anos</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-[180px]">
              <label className="block text-xs text-muted-foreground mb-1 font-medium">Mês</label>
              <Select value={mes} onValueChange={setMes}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os meses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os meses</SelectItem>
                  <SelectItem value="01">Janeiro</SelectItem>
                  <SelectItem value="02">Fevereiro</SelectItem>
                  <SelectItem value="03">Março</SelectItem>
                  <SelectItem value="04">Abril</SelectItem>
                  <SelectItem value="05">Maio</SelectItem>
                  <SelectItem value="06">Junho</SelectItem>
                  <SelectItem value="07">Julho</SelectItem>
                  <SelectItem value="08">Agosto</SelectItem>
                  <SelectItem value="09">Setembro</SelectItem>
                  <SelectItem value="10">Outubro</SelectItem>
                  <SelectItem value="11">Novembro</SelectItem>
                  <SelectItem value="12">Dezembro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-[180px]">
              <label className="block text-xs text-muted-foreground mb-1 font-medium">CCA</label>
              <Select value={cca} onValueChange={setCca}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os CCAs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os CCAs</SelectItem>
                  <SelectItem value="CCA001">CCA 001</SelectItem>
                  <SelectItem value="CCA002">CCA 002</SelectItem>
                  <SelectItem value="CCA003">CCA 003</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-[220px]">
              <label className="block text-xs text-muted-foreground mb-1 font-medium">Responsável</label>
              <Select value={responsavel} onValueChange={setResponsavel}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os responsáveis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os responsáveis</SelectItem>
                  <SelectItem value="joao">João Silva</SelectItem>
                  <SelectItem value="maria">Maria Oliveira</SelectItem>
                  <SelectItem value="carlos">Carlos Santos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="ml-auto px-5 bg-blue-600 hover:bg-blue-700" type="button">
              <Search className="h-4 w-4 mr-1" />
              Aplicar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* CARDS KPIs */}
      <div className="grid gap-4 md:grid-cols-4 px-2 pb-6">
        {/* Total de Inspeções */}
        <Card className="bg-white border border-gray-200 shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 font-medium">Total de Inspeções</div>
                <div className="text-3xl font-bold mt-2">{isLoading ? "..." : totalInspecoes}</div>
                <div className="mt-2 text-xs text-gray-400">Todos as inspeções registradas</div>
                <div className="mt-1 text-abelv-green text-xs font-semibold">↑8%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Inspeções Concluídas */}
        <Card className="bg-white border border-green-500 shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 font-medium flex items-center gap-1">
                  Inspeções Concluídas{" "}
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-3xl font-bold mt-2">
                  {isLoading ? "..." : `${concluidas} (${percentConcluidas}%)`}
                </div>
                <div className="mt-2 text-xs text-gray-400">Inspeções finalizadas</div>
                <div className="mt-1 text-green-600 text-xs font-semibold">↑{percentConcluidas}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Inspeções em Andamento */}
        <Card className="bg-white border border-yellow-400 shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 font-medium flex items-center gap-1">
                  Inspeções em Andamento{" "}
                  <Clock className="h-4 w-4 text-yellow-500" />
                </div>
                <div className="text-3xl font-bold mt-2">
                  {isLoading ? "..." : `0 (0%)`}
                </div>
                <div className="mt-2 text-xs text-gray-400">Inspeções sendo executadas</div>
                <div className="mt-1 text-yellow-500 text-xs font-semibold">→0%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Inspeções Pendentes */}
        <Card className="bg-white border border-red-500 shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 font-medium flex items-center gap-1">
                  Inspeções Pendentes 
                </div>
                <div className="text-3xl font-bold mt-2">
                  {isLoading ? "..." : `${pendentes} (${percentPendentes}%)`}
                </div>
                <div className="mt-2 text-xs text-gray-400">Inspeções a serem iniciadas</div>
                <div className="mt-1 text-red-600 text-xs font-semibold">↓{percentPendentes}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* GRÁFICOS e restante do painel */}
      {/* Mantém o restante igual, apenas adicionando espaçamento */}
      <div className="px-2 space-y-6">
        {/* Gauge/Velocímetro */}
        

        {/* Execução HSA por status */}
        <Card>
          <CardHeader>
            <CardTitle>Execução HSA</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <ReBarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#43A047" />
              </ReBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Execução HSA por responsável */}
        <Card>
          <CardHeader>
            <CardTitle>Execução HSA por Responsável</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={225}>
              <ReBarChart data={respData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Cancelada" fill="#757575" />
                <Bar dataKey="Realizada" fill="#43A047" />
                <Bar dataKey="Não Realizada" fill="#E53935" />
                <Bar dataKey="Realizada (Não Programada)" fill="#FFA000" />
              </ReBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Desvios identificados por responsável */}
        <Card>
          <CardHeader>
            <CardTitle>Desvios Identificados</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <ReBarChart data={desvioRespData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={140} />
                <Tooltip />
                <Bar dataKey="desvios" fill="#4285F4" />
              </ReBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Desvios por atividade crítica */}
        <Card>
          <CardHeader>
            <CardTitle>Desvios por Atividade Crítica</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={230}>
              <RePieChart>
                <RePie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} fill="#1565C0" label={({
                name,
                percent
              }) => `${name} • ${(percent * 100).toFixed(1)}%`}>
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </RePie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>;
}