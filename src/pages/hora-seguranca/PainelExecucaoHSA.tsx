import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchInspecoesSummary, fetchInspecoesByStatus, fetchInspecoesByMonth, fetchInspecoesByResponsavel, fetchDesviosByInspectionType } from "@/services/horaSegurancaService";
import { Gauge, TrendingUp, TrendingDown, BarChart3, PieChart } from "lucide-react";
import { ResponsiveContainer, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart as ReLineChart, Line, Legend, Pie as RePie, PieChart as RePieChart, Cell } from "recharts";

const COLORS = ["#4285F4", "#34A853", "#FBBC05", "#EA4335", "#8D6E63", "#FF9800", "#7E57C2"];

export default function PainelExecucaoHSA() {
  const [summary, setSummary] = useState<any>(null);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [monthData, setMonthData] = useState<any[]>([]);
  const [respData, setRespData] = useState<any[]>([]);
  const [desvioRespData, setDesvioRespData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      // Resumo KPIs
      const resumo = await fetchInspecoesSummary();
      setSummary(resumo);
      // Execução HSA Status
      const status = await fetchInspecoesByStatus();
      setStatusData(
        status.map((s: any) => ({
          name: s.status,
          value: s.quantidade,
        }))
      );
      // Evolução Mensal (mock ou implementar fetchInspecoesByMonth)
      const monthly = await fetchInspecoesByMonth();
      setMonthData(
        monthly.map((s: any, i: number) => ({
          name: `S-${i + 1}`,
          "ACC PREV": s.previsto ?? s.quantidade,
          "ACC REAL": s.realizado ?? s.quantidade,
        }))
      );
      // Execução por Responsável
      const responsaveis = await fetchInspecoesByResponsavel();
      setRespData(
        responsaveis.map((d: any) => ({
          name: d.responsavel,
          "Cancelada": d.cancelada ?? 0,
          "Realizada": d.realizada ?? 0,
          "Não Realizada": d.nao_realizada ?? 0,
          "Realizada (Não Programada)": d["realizada (não programada)"] ?? 0,
        }))
      );
      // Desvios Identificados por Responsável (mocked)
      setDesvioRespData(
        responsaveis.map((d: any) => ({
          name: d.responsavel,
          desvios: Math.floor(Math.random() * 30 + 1), // mock para exemplo
        }))
      );
      // Desvios por Atividade Crítica (pie)
      const pie = await fetchDesviosByInspectionType();
      setPieData(
        pie.map((d: any) => ({
          name: d.tipo,
          value: d.quantidade,
        }))
      );
      setIsLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <h2 className="text-3xl font-bold text-center tracking-tight mb-4">PAINEL DE EXECUÇÃO - HORA DA SEGURANÇA</h2>
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-green-50 border-l-4 border-green-500">
          <CardHeader>
            <CardTitle>Programadas</CardTitle>
            <CardDescription>Inspeções programadas no período</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary?.programadas ?? "--"}</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-l-4 border-blue-500">
          <CardHeader>
            <CardTitle>Realizadas</CardTitle>
            <CardDescription>Inspeções realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary?.realizadas ?? "--"}</div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-l-4 border-red-500">
          <CardHeader>
            <CardTitle>Não Realizadas</CardTitle>
            <CardDescription>Programadas mas não realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary ? (summary.programadas - summary.realizadas - summary.canceladas) : "--"}</div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-l-4 border-purple-500">
          <CardHeader>
            <CardTitle>Aderência</CardTitle>
            <CardDescription>índice de aderência</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-3xl font-bold">
              {summary && summary.programadas > 0
                ? `${Math.round((summary.realizadas / summary.programadas) * 100)}%`
                : "--"}
              <Gauge className="w-7 h-7 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gauge/Velocímetro */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>HSA com aderência satisfatória</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <RePieChart>
                <RePie
                  data={[
                    { name: "Aderência", value: summary ? summary.realizadas : 0 },
                    {
                      name: "Fora da Meta",
                      value: summary && summary.programadas ? summary.programadas - summary.realizadas : 0,
                    },
                  ]}
                  cx="50%"
                  cy="75%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                >
                  <Cell key="cell1" fill="#4CAF50" />
                  <Cell key="cell2" fill="#E0E0E0" />
                </RePie>
              </RePieChart>
            </ResponsiveContainer>
            <div className="text-center text-xl pt-2">
              {summary && summary.programadas > 0
                ? `${Math.round((summary.realizadas / summary.programadas) * 100)}%`
                : "--"}
            </div>
          </CardContent>
        </Card>
        {/* Evolução Mensal */}
        <Card className="flex-[2]">
          <CardHeader>
            <CardTitle>Evolução Mensal</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <ResponsiveContainer width="100%" height={180}>
              <ReLineChart data={monthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ACC PREV" stroke="#A5A5A5" strokeWidth={2} />
                <Line type="monotone" dataKey="ACC REAL" stroke="#43A047" strokeWidth={3} />
              </ReLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Execução HSA por status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Execução HSA</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <ReBarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false}/>
              <Tooltip />
              <Bar dataKey="value" fill="#43A047" />
            </ReBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Execução HSA por responsável */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Execução HSA por Responsável</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={225}>
            <ReBarChart data={respData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false}/>
              <Tooltip />
              <Legend />
              <Bar dataKey="Cancelada" fill="#757575"/>
              <Bar dataKey="Realizada" fill="#43A047"/>
              <Bar dataKey="Não Realizada" fill="#E53935"/>
              <Bar dataKey="Realizada (Não Programada)" fill="#FFA000"/>
            </ReBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Desvios identificados por responsável */}
      <Card className="mb-6">
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
              <RePie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                fill="#1565C0"
                label={({ name, percent }) => `${name} • ${(percent * 100).toFixed(1)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </RePie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
