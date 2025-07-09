
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchInspecoesSummary, fetchInspecoesByStatus, fetchInspecoesByMonth, fetchInspecoesByResponsavel, fetchDesviosByInspectionType, fetchDesviosByResponsavel } from "@/services/horaSegurancaService";
import { Gauge, Check, Clock, AlertTriangle, Search, Plus } from "lucide-react";
import { ResponsiveContainer, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart as ReLineChart, Line, Pie as RePie, PieChart as RePieChart, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { useUserCCAs } from "@/hooks/useUserCCAs";

const COLORS = ["#4285F4", "#34A853", "#FBBC05", "#EA4335", "#8D6E63", "#FF9800", "#7E57C2"];

export default function PainelExecucaoHSA() {
  const [summary, setSummary] = useState<any>(null);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [monthData, setMonthData] = useState<any[]>([]);
  const [respData, setRespData] = useState<any[]>([]);
  const [desvioRespData, setDesvioRespData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: userCCAs = [] } = useUserCCAs();

  // Carregar lista de CCAs (filtrado pelos CCAs permitidos)
  const [ccas, setCcas] = useState<{ id: number; codigo: string; nome: string }[]>([]);
  useEffect(() => {
    async function getCcas() {
      if (userCCAs.length === 0) {
        setCcas([]);
        return;
      }
      
      const ccaIds = userCCAs.map(cca => cca.id);
      const { data } = await supabase
        .from("ccas")
        .select("id,codigo,nome")
        .in("id", ccaIds)
        .order("codigo");
      setCcas(data || []);
    }
    getCcas();
  }, [userCCAs]);

  // Filtros - estão apenas visuais por enquanto!
  const [ano, setAno] = useState("todos");
  const [mes, setMes] = useState("todos");
  const [cca, setCca] = useState("todos");
  const [responsavel, setResponsavel] = useState("todos");
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      
      if (userCCAs.length === 0) {
        // Se o usuário não tem CCAs permitidos, não carregar dados
        setSummary({ totalInspecoes: 0, programadas: 0, naoProgramadas: 0, desviosIdentificados: 0, realizadas: 0, canceladas: 0 });
        setStatusData([]);
        setMonthData([]);
        setRespData([]);
        setDesvioRespData([]);
        setPieData([]);
        setIsLoading(false);
        return;
      }

      // Aplicar filtro por CCAs permitidos
      const ccaIds = userCCAs.map(cca => cca.id);

      // Resumo KPIs
      const resumo = await fetchInspecoesSummary(ccaIds);
      setSummary(resumo);
      
      // Execução HSA Status
      const status = await fetchInspecoesByStatus(ccaIds);
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
      
      // Execução por Responsável - garantir todas as chaves
      const responsaveis = await fetchInspecoesByResponsavel(ccaIds);
      console.log('[HSA][PainelExecucaoHSA] respData (por responsável):', responsaveis);
      setRespData(
        responsaveis.map((d: any) => ({
          name: d.responsavel,
          "A Realizar": d["A Realizar"] ?? 0,
          "Realizada": d.realizada ?? 0,
          "Não Realizada": d.nao_realizada ?? 0,
          "Realizada (Não Programada)": d["realizada (não programada)"] ?? 0,
          "Cancelada": d.cancelada ?? 0,
        }))
      );
      
      // Desvios Identificados por Responsável - agora usa dados reais
      const desviosReais = await fetchDesviosByResponsavel(ccaIds);
      console.log('[HSA][PainelExecucaoHSA] desviosReais:', desviosReais);
      setDesvioRespData(
        desviosReais.map((d: any) => ({
          name: d.responsavel,
          desvios: d.desvios
        }))
      );
      
      // Desvios por Atividade Crítica (pie) - agora usa dados reais da execucao_hsa
      const desviosPorTipo = await fetchDesviosByInspectionType(ccaIds);
      console.log('[HSA][PainelExecucaoHSA] desviosPorTipo:', desviosPorTipo);
      setPieData(desviosPorTipo.map((d: any) => ({
        name: d.tipo,
        value: d.quantidade
      })));
      
      setIsLoading(false);
    }
    loadData();
  }, [userCCAs]);

  // Verificar se o usuário tem permissão para acessar
  if (userCCAs.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-8 animate-fade-in">
        <div className="flex flex-col items-center justify-center py-20">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Dashboard Hora da Segurança</h1>
          <p className="text-yellow-600 text-center">
            Você não possui permissão para visualizar dados de nenhum CCA.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/")}>
            Voltar ao Início
          </Button>
        </div>
      </div>
    );
  }

  // Cálculos dos cards
  const statusProgramada = ["A REALIZAR", "REALIZADA", "NÃO REALIZADA"];
  const programadasCard = statusData
    .filter((s) => statusProgramada.includes((s.name || "").toUpperCase()))
    .reduce((acc, cur) => acc + (cur.value ?? 0), 0);

  // Inspeções Realizadas = status "REALIZADA"
  const realizadasCard = statusData
    .filter((s) => (s.name || "").toUpperCase() === "REALIZADA")
    .reduce((acc, cur) => acc + (cur.value ?? 0), 0);

  // Inspeções Não Realizadas = status "NÃO REALIZADA"
  const naoRealizadaCard = statusData
    .filter((s) => (s.name || "").toUpperCase() === "NÃO REALIZADA")
    .reduce((acc, cur) => acc + (cur.value ?? 0), 0);

  // Inspeções Realizadas Não Programadas = status "REALIZADA (NÃO PROGRAMADA)"
  const realizadasNaoProgramadaCard = statusData
    .filter((s) => (s.name || "").toUpperCase() === "REALIZADA (NÃO PROGRAMADA)")
    .reduce((acc, cur) => acc + (cur.value ?? 0), 0);

  // Inspeções a Realizar = status "A REALIZAR"
  const aRealizarCard = statusData
    .filter((s) => (s.name || "").toUpperCase() === "A REALIZAR")
    .reduce((acc, cur) => acc + (cur.value ?? 0), 0);

  // Aderência Real HSA
  const aderenciaPerc =
    programadasCard > 0
      ? Math.round((realizadasCard / programadasCard) * 1000) / 10 // 1 decimal
      : 0;

  // Aderência HSA Ajustada
  const aderenciaAjustadaNum = realizadasCard + realizadasNaoProgramadaCard;
  const aderenciaAjustadaPerc = 
    programadasCard > 0
      ? Math.round((aderenciaAjustadaNum / programadasCard) * 1000) / 10
      : 0;

  let aderenciaColor = "text-green-600";
  if (aderenciaPerc < 90) {
    aderenciaColor = "text-red-600";
  } else if (aderenciaPerc < 95) {
    aderenciaColor = "text-orange-500";
  }

  let aderenciaAjustadaColor = "text-green-600";
  if (aderenciaAjustadaPerc < 90) {
    aderenciaAjustadaColor = "text-red-600";
  } else if (aderenciaAjustadaPerc < 95) {
    aderenciaAjustadaColor = "text-orange-500";
  }

  const chartConfig = pieData.reduce((acc, entry) => {
    if (entry.name) {
      acc[entry.name] = { label: entry.name };
    }
    return acc;
  }, {} as ChartConfig);

  return (
    <div className="max-w-7xl mx-auto py-8 animate-fade-in">
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
                  {ccas.map(c => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.codigo} - {c.nome}
                    </SelectItem>
                  ))}
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
      
      {/* CARDS KPIs - NOVA ORGANIZAÇÃO */}
      {/* Linha de aderência: agora divide igualmente a largura */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 pb-2">
        {/* Aderência real HSA */}
        <Card className="bg-white border border-gray-200 shadow-none w-full">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 font-bold">
                  {/* Título alterado para negrito e texto solicitado */}
                  Aderência HSA real
                </div>
                <div className={`text-3xl font-bold mt-2 ${aderenciaColor}`}>
                  {isLoading
                    ? "..."
                    : `${aderenciaPerc.toLocaleString("pt-BR", {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}%`}
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  Inspeções programadas: {isLoading ? "..." : programadasCard}
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  Inspeções realizadas: {isLoading ? "..." : realizadasCard}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Aderência HSA Ajustada */}
        <Card className="bg-white border border-blue-400 shadow-none w-full">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 font-bold">
                  {/* Título agora em negrito */}
                  Aderência HSA Ajustada
                </div>
                <div className={`text-3xl font-bold mt-2 ${aderenciaAjustadaColor}`}>
                  {isLoading
                    ? "..."
                    : `${aderenciaAjustadaPerc.toLocaleString("pt-BR", {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}%`}
                </div>
                {/* Rótulos simplificados conforme solicitado */}
                <div className="mt-2 text-xs text-gray-400">
                  Inspeções programadas: {isLoading ? "..." : programadasCard}
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  Inspeções realizadas (considerando realizada não programada):{" "}
                  {isLoading
                    ? "..."
                    : aderenciaAjustadaNum}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CARDS KPIs NOVA ORGANIZAÇÃO */}
      <div className="grid gap-4 md:grid-cols-4 px-2 pb-6">
        {/* Inspeções a realizar */}
        <Card className="bg-white border border-blue-500 shadow-none">
          <CardContent className="p-4">
            <div className="flex flex-col items-start">
              <div className="text-sm text-gray-500 font-medium flex items-center gap-1">
                Inspeções a Realizar
                <span>
                  <svg className="inline h-4 w-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                </span>
              </div>
              <div className="text-3xl font-bold mt-2">
                {isLoading ? "..." : aRealizarCard}
              </div>
              <div className="mt-2 text-xs text-gray-400">Aguardando execução</div>
            </div>
          </CardContent>
        </Card>
        {/* Inspeções Realizadas */}
        <Card className="bg-white border border-green-500 shadow-none">
          <CardContent className="p-4">
            <div className="flex flex-col items-start">
              <div className="text-sm text-gray-500 font-medium flex items-center gap-1">
                Inspeções Realizadas
                <span>
                  <svg className="inline h-4 w-4 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                </span>
              </div>
              <div className="text-3xl font-bold mt-2">
                {isLoading ? "..." : realizadasCard}
              </div>
              <div className="mt-2 text-xs text-gray-400">Inspeções finalizadas</div>
            </div>
          </CardContent>
        </Card>
        {/* Inspeções Não Realizadas */}
        <Card className="bg-white border border-red-500 shadow-none">
          <CardContent className="p-4">
            <div className="flex flex-col items-start">
              <div className="text-sm text-gray-500 font-medium flex items-center gap-1">
                Inspeções Não Realizadas
                <span>
                  <svg className="inline h-4 w-4 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 19a7 7 0 110-14 7 7 0 010 14z"></path></svg>
                </span>
              </div>
              <div className="text-3xl font-bold mt-2">
                {isLoading ? "..." : naoRealizadaCard}
              </div>
              <div className="mt-2 text-xs text-gray-400">Inspeções não foram realizadas</div>
            </div>
          </CardContent>
        </Card>
        {/* Inspeções Realizadas Não Programadas */}
        <Card className="bg-white border border-yellow-500 shadow-none">
          <CardContent className="p-4">
            <div className="flex flex-col items-start">
              <div className="text-sm text-gray-500 font-medium flex items-center gap-1">
                Inspeções Realizadas Não Programadas
                <span>
                  <svg className="inline h-4 w-4 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line></svg>
                </span>
              </div>
              <div className="text-3xl font-bold mt-2">
                {isLoading ? "..." : realizadasNaoProgramadaCard}
              </div>
              <div className="mt-2 text-xs text-gray-400">Realizadas fora do previsto</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* GRÁFICOS e restante do painel */}
      {/* Mantém o restante igual, apenas adicionando espaçamento */}
      <div className="px-2 space-y-6">
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
                <ChartLegend />
                <Bar dataKey="A Realizar" fill="#4285F4" />
                <Bar dataKey="Realizada" fill="#43A047" />
                <Bar dataKey="Não Realizada" fill="#E53935" />
                <Bar dataKey="Realizada (Não Programada)" fill="#FFA000" />
                <Bar dataKey="Cancelada" fill="#757575" />
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
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square h-[300px]"
            >
              <RePieChart>
  <ChartTooltip
    content={<ChartTooltipContent nameKey="name" />}
  />
  <RePie
    data={pieData}
    dataKey="value"
    nameKey="name"
    cx="50%"
    cy="40%" // <-- move o gráfico para cima
    outerRadius={80}
    fill="#1565C0"
    labelLine={false}
    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
      if (percent < 0.05) {
        return null;
      }
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
      const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
      return (
        <text
          x={x}
          y={y}
          fill="white"
          className="text-xs font-bold"
          textAnchor="middle"
          dominantBaseline="central"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    }}
  >
    {pieData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </RePie>
  
  {/* 🧭 Mova a legenda para baixo e centralize */}
  <ChartLegend
    layout="vertical"
    verticalAlign="bottom"
    align="center"
    content={<ChartLegendContent nameKey="name" />}
  />
</RePieChart>

            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
