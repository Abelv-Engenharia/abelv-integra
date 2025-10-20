import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format, subMonths, isSameMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FuelTransaction } from "@/types/gestao-pessoas/fuel";

interface AbastecimentoChartsProps {
  transacoes: FuelTransaction[];
}

const COLORS = ["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#EC4899"];

export function AbastecimentoCharts({ transacoes }: AbastecimentoChartsProps) {
  // Gráfico 1: Consumo Mensal (6 meses)
  const ultimos6Meses = Array.from({ length: 6 }, (_, i) => subMonths(new Date(), 5 - i));
  const consumoMensalData = ultimos6Meses.map(mes => {
    const transacoesMes = transacoes.filter(t => 
      isSameMonth(new Date(t.data_hora_transacao), mes)
    );
    const total = transacoesMes.reduce((sum, t) => sum + t.valor, 0);
    return {
      mes: format(mes, "MMM/yy", { locale: ptBR }),
      valor: total
    };
  });

  const mediaHistorica = consumoMensalData.reduce((sum, d) => sum + d.valor, 0) / consumoMensalData.length;

  // Gráfico 2: Top 10 Veículos por Consumo
  const veiculoConsumo = transacoes.reduce((acc, t) => {
    const key = `${t.placa} - ${t.modelo_veiculo}`;
    acc[key] = (acc[key] || 0) + t.valor;
    return acc;
  }, {} as Record<string, number>);

  const topVeiculosData = Object.entries(veiculoConsumo)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, value]) => ({ name, value }));

  // Gráfico 3: Distribuição por Tipo de Combustível
  const tipoCombustivel = transacoes.reduce((acc, t) => {
    acc[t.mercadoria] = (acc[t.mercadoria] || 0) + t.valor;
    return acc;
  }, {} as Record<string, number>);

  const tipoData = Object.entries(tipoCombustivel).map(([name, value]) => ({ name, value }));

  // Gráfico 4: Consumo por Estado
  const estadoConsumo = transacoes.reduce((acc, t) => {
    acc[t.uf_ec] = (acc[t.uf_ec] || 0) + t.valor;
    return acc;
  }, {} as Record<string, number>);

  const estadoData = Object.entries(estadoConsumo)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, value]) => ({ name, value }));

  // KPIs
  const consumoMedioPorVeiculo = transacoes.length > 0
    ? Object.values(veiculoConsumo).reduce((sum, val) => sum + val, 0) / Object.keys(veiculoConsumo).length
    : 0;

  const litrosTotais = transacoes.reduce((sum, t) => sum + t.qtd_mercadoria, 0);
  
  const precoMedioPorLitro = litrosTotais > 0
    ? transacoes.reduce((sum, t) => sum + t.valor, 0) / litrosTotais
    : 0;

  const mesAtual = consumoMensalData[consumoMensalData.length - 1]?.valor || 0;
  const mesAnterior = consumoMensalData[consumoMensalData.length - 2]?.valor || 0;
  const variacao = mesAnterior > 0 ? ((mesAtual - mesAnterior) / mesAnterior) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* KPIs Específicos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Consumo Médio/Veículo</p>
            <p className="text-2xl font-bold">
              {consumoMedioPorVeiculo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Litros Totais</p>
            <p className="text-2xl font-bold">{litrosTotais.toLocaleString("pt-BR")} L</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Preço Médio/Litro</p>
            <p className="text-2xl font-bold">
              {precoMedioPorLitro.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Variação vs Mês Anterior</p>
            <p className={`text-2xl font-bold ${variacao >= 0 ? "text-red-600" : "text-green-600"}`}>
              {variacao >= 0 ? "+" : ""}{variacao.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Consumo Mensal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Consumo Mensal (6 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={consumoMensalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [
                    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
                    "Valor"
                  ]}
                />
                <Legend />
                <Line type="monotone" dataKey="valor" stroke="#8B5CF6" strokeWidth={2} name="Gasto Total" />
                <Line 
                  type="monotone" 
                  dataKey={() => mediaHistorica} 
                  stroke="#10B981" 
                  strokeDasharray="5 5" 
                  name="Média Histórica" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top 10 Veículos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top 10 Veículos por Consumo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topVeiculosData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 10 }} />
                <Tooltip 
                  formatter={(value: number) => [
                    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
                    "Gasto"
                  ]}
                />
                <Bar dataKey="value" fill="#3B82F6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tipo de Combustível */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribuição por Tipo de Combustível</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={tipoData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tipoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [
                    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
                    "Valor"
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Consumo por Estado */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top 10 Estados por Consumo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={estadoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [
                    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
                    "Gasto"
                  ]}
                />
                <Bar dataKey="value" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
