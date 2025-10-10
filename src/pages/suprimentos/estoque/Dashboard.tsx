import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

// Dados mockados para os gráficos
const saldoData = [
  { periodo: "Sem 1", valor: 45000 },
  { periodo: "Sem 2", valor: 52000 },
  { periodo: "Sem 3", valor: 48000 },
  { periodo: "Sem 4", valor: 61000 },
  { periodo: "Sem 5", valor: 55000 },
  { periodo: "Sem 6", valor: 67000 },
];

const entradaData = [
  { periodo: "Sem 1", valor: 12000 },
  { periodo: "Sem 2", valor: 15000 },
  { periodo: "Sem 3", valor: 8000 },
  { periodo: "Sem 4", valor: 18000 },
  { periodo: "Sem 5", valor: 11000 },
  { periodo: "Sem 6", valor: 16000 },
];

const saidaData = [
  { periodo: "Sem 1", valor: 8000 },
  { periodo: "Sem 2", valor: 10000 },
  { periodo: "Sem 3", valor: 13000 },
  { periodo: "Sem 4", valor: 7000 },
  { periodo: "Sem 5", valor: 14000 },
  { periodo: "Sem 6", valor: 9000 },
];

// Dados de fornecedores - filtrados (valor > 0) e ordenados do maior para o menor
const saldoBeneficiamentoData = [
  { fornecedor: "Fornecedor A", valor: 45000 },
  { fornecedor: "Fornecedor B", valor: 38000 },
  { fornecedor: "Fornecedor C", valor: 32000 },
  { fornecedor: "Fornecedor D", valor: 28000 },
  { fornecedor: "Fornecedor E", valor: 22000 },
  { fornecedor: "Fornecedor F", valor: 15000 },
].sort((a, b) => b.valor - a.valor).filter(item => item.valor > 0);

const totalEnviadoBeneficiamentoData = [
  { fornecedor: "Fornecedor A", valor: 85000 },
  { fornecedor: "Fornecedor B", valor: 72000 },
  { fornecedor: "Fornecedor C", valor: 58000 },
  { fornecedor: "Fornecedor D", valor: 45000 },
  { fornecedor: "Fornecedor E", valor: 38000 },
  { fornecedor: "Fornecedor F", valor: 28000 },
].sort((a, b) => b.valor - a.valor).filter(item => item.valor > 0);

const chartConfig = {
  valor: {
    label: "Valor",
    color: "hsl(var(--primary))",
  },
};

export default function EstoqueDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do controle de estoque</p>
      </div>

      {/* Cards de requisições */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => navigate("/suprimentos/estoque/requisicoes/requisicoes-emitidas")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requisições Emitidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-muted-foreground">Total de requisições emitidas</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => navigate("/suprimentos/estoque/requisicoes/requisicoes-pendentes")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requisições Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">Aguardando aprovação</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de linha */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-center">Saldo do Almoxarifado</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={saldoData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="periodo" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="valor" stroke="#00c8c8" strokeWidth={2} dot={{ fill: "#00c8c8" }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-center">Entrada de Materiais</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={entradaData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="periodo" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="valor" stroke="#00be00" strokeWidth={2} dot={{ fill: "#00be00" }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-center">Saída de Materiais</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={saidaData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="periodo" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="valor" stroke="#ff5a5a" strokeWidth={2} dot={{ fill: "#ff5a5a" }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de barras horizontais */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-center">Saldo de Material em Beneficiamento</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={saldoBeneficiamentoData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    type="number"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                  />
                  <YAxis
                    type="category"
                    dataKey="fornecedor"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    width={100}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="valor" fill="#00c8c8" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-center">Total de Material enviado para Beneficiamento</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={totalEnviadoBeneficiamentoData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    type="number"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                  />
                  <YAxis
                    type="category"
                    dataKey="fornecedor"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    width={100}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="valor" fill="#9b59b6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
