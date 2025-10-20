import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, subMonths, isSameMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MultaCompleta } from "@/types/multa";

interface MultasChartsProps {
  multas: MultaCompleta[];
}

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6"];

export function MultasCharts({ multas }: MultasChartsProps) {
  // Gráfico 1: Evolução de Multas (6 meses)
  const ultimos6Meses = Array.from({ length: 6 }, (_, i) => subMonths(new Date(), 5 - i));
  const evolucaoData = ultimos6Meses.map(mes => ({
    mes: format(mes, "MMM/yy", { locale: ptBR }),
    quantidade: multas.filter(m => isSameMonth(new Date(m.dataMulta), mes)).length,
    valor: multas
      .filter(m => isSameMonth(new Date(m.dataMulta), mes))
      .reduce((sum, m) => sum + (m.valor || 0), 0)
  }));

  // Gráfico 2: Top 5 Condutores com Mais Multas
  const condutorCount = multas.reduce((acc, m) => {
    acc[m.condutorInfrator] = (acc[m.condutorInfrator] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCondutores = Object.entries(condutorCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  // Gráfico 3: Status das Multas
  const statusCount = multas.reduce((acc, m) => {
    acc[m.statusMulta] = (acc[m.statusMulta] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.entries(statusCount).map(([name, value]) => ({ name, value }));

  // Gráfico 4: Multas por Tipo de Ocorrência
  const ocorrenciaCount = multas.reduce((acc, m) => {
    acc[m.ocorrencia] = (acc[m.ocorrencia] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const ocorrenciaData = Object.entries(ocorrenciaCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  // KPIs
  const valorMedio = multas.length > 0 
    ? multas.reduce((sum, m) => sum + (m.valor || 0), 0) / multas.length 
    : 0;

  const indicadasOrgao = multas.filter(m => m.indicadoOrgao === "Sim").length;
  const taxaIndicacao = multas.length > 0 ? (indicadasOrgao / multas.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* KPIs Específicos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Valor Médio por Multa</p>
            <p className="text-2xl font-bold">
              {valorMedio.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Taxa de Indicação ao Órgão</p>
            <p className="text-2xl font-bold">{taxaIndicacao.toFixed(1)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total de Multas</p>
            <p className="text-2xl font-bold">{multas.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Evolução de Multas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Evolução de Multas (6 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={evolucaoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === "valor" 
                      ? value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                      : value,
                    name === "valor" ? "Valor Total" : "Quantidade"
                  ]}
                />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="quantidade" stroke="#3B82F6" strokeWidth={2} name="Quantidade" />
                <Line yAxisId="right" type="monotone" dataKey="valor" stroke="#10B981" strokeWidth={2} name="Valor" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top 5 Condutores */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top 5 Condutores com Mais Multas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topCondutores} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#EF4444" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status das Multas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status das Multas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Multas por Tipo de Ocorrência */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Multas por Tipo de Ocorrência</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ocorrenciaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
