import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Line, ComposedChart, ResponsiveContainer } from "recharts";
import { usePropostasComerciais } from "@/hooks/comercial/usePropostasComerciais";
import { useMetasAnuais } from "@/hooks/comercial/useMetasAnuais";
const CommercialSpreadsheet = () => {
  const { propostas, isLoading: isLoadingPropostas } = usePropostasComerciais();
  const { metas, isLoading: isLoadingMetas } = useMetasAnuais();
  const currentYear = new Date().getFullYear();
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Filtrar dados do ano atual
  const currentYearData = propostas.filter(item => {
    const dataPropostaStr = item.data_saida_proposta || '';
    if (!dataPropostaStr) return false;
    const year = parseInt(dataPropostaStr.split('/')[2]);
    return year === currentYear;
  });

  // Agrupar dados por trimestre
  const getQuarterlyData = () => {
    const quarters = {
      T1: { vendas: 0, margem: 0 },
      T2: { vendas: 0, margem: 0 },
      T3: { vendas: 0, margem: 0 },
      T4: { vendas: 0, margem: 0 }
    };
    currentYearData.forEach(item => {
      const dataPropostaStr = item.data_saida_proposta || '';
      if (!dataPropostaStr) return;
      const month = parseInt(dataPropostaStr.split('/')[1]);
      const quarter = Math.ceil(month / 3);
      const quarterKey = `T${quarter}` as keyof typeof quarters;

      // Considerar apenas propostas "Contemplado" para positivação
      if (item.status === 'Contemplado') {
        quarters[quarterKey].vendas += item.valor_venda || 0;
        quarters[quarterKey].margem += item.margem_valor || 0;
      }
    });
    return quarters;
  };

  // Buscar metas do ano atual
  const currentYearGoals = metas.find(goal => goal.ano === currentYear && goal.ativo);
  const quarterlyData = getQuarterlyData();

  const isLoading = isLoadingPropostas || isLoadingMetas;

  // Preparar dados para o gráfico
  const chartData = [{
    quarter: 'T1',
    realizado: quarterlyData.T1.vendas,
    margem: quarterlyData.T1.margem,
    meta: currentYearGoals?.meta_t1 || 0
  }, {
    quarter: 'T2',
    realizado: quarterlyData.T2.vendas,
    margem: quarterlyData.T2.margem,
    meta: currentYearGoals?.meta_t2 || 0
  }, {
    quarter: 'T3',
    realizado: quarterlyData.T3.vendas,
    margem: quarterlyData.T3.margem,
    meta: currentYearGoals?.meta_t3 || 0
  }, {
    quarter: 'T4',
    realizado: quarterlyData.T4.vendas,
    margem: quarterlyData.T4.margem,
    meta: currentYearGoals?.meta_t4 || 0
  }];
  const chartConfig = {
    realizado: {
      label: "Realizado",
      color: "hsl(var(--chart-1))"
    },
    meta: {
      label: "Meta",
      color: "hsl(var(--chart-2))"
    },
    margem: {
      label: "Margem",
      color: "hsl(var(--chart-3))"
    }
  };
  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando dados de performance...</p>
      </div>;
  }

  return <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Performance de Vendas</h1>
            <p className="text-muted-foreground mt-2">Gerenciamento de propostas comerciais</p>
          </div>
        </div>


        {/* Gráfico de Performance Trimestral */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance de Vendas {currentYear} - Realizado vs Meta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5
              }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" tick={{
                  fill: 'hsl(var(--foreground))',
                  fontSize: 12
                }} />
                  <YAxis tick={{
                  fill: 'hsl(var(--foreground))',
                  fontSize: 12
                }} tickFormatter={value => formatCurrency(value)} />
                  <ChartTooltip content={<ChartTooltipContent />} formatter={(value: number) => [formatCurrency(value), ""]} />
                  <Bar dataKey="realizado" fill="hsl(var(--chart-1))" name="Realizado" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="meta" stroke="hsl(var(--chart-2))" strokeWidth={3} name="Meta" strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="margem" stroke="hsl(var(--chart-3))" strokeWidth={3} name="Margem" />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Resumo de Performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {chartData.map(quarter => <Card key={quarter.quarter}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{quarter.quarter}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Realizado</p>
                    <p className="text-2xl font-bold">{formatCurrency(quarter.realizado)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Margem</p>
                    <p className="text-lg font-medium text-chart-3">{formatCurrency(quarter.margem)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Meta</p>
                    <p className="text-lg font-medium">{formatCurrency(quarter.meta)}</p>
                  </div>
                  {quarter.meta > 0 && <div>
                      <p className="text-sm text-muted-foreground">Performance</p>
                      <p className={`text-sm font-medium ${quarter.realizado >= quarter.meta ? 'text-green-600' : 'text-red-600'}`}>
                        {(quarter.realizado / quarter.meta * 100).toFixed(1)}%
                      </p>
                    </div>}
                </div>
              </CardContent>
            </Card>)}
        </div>
      </div>
    </div>;
};
export default CommercialSpreadsheet;