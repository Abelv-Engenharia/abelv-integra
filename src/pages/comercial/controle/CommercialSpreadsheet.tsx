import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CartesianGrid, XAxis, Bar, Line, ComposedChart, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { commercialMockData } from "@/data/commercialMockData";
import { annualGoalsMockData } from "@/data/annualGoalsMockData";

export default function CommercialSpreadsheet() {
  const currentYear = new Date().getFullYear();
  const filteredData = useMemo(() => {
    return commercialMockData.filter(item => {
      const year = parseInt(item.dataSaidaProposta.split('/')[2]);
      return year === currentYear;
    });
  }, [currentYear]);

  const quarterlyData = useMemo(() => {
    const quarters = { T1: 0, T2: 0, T3: 0, T4: 0 };
    
    filteredData.forEach(item => {
      if (item.status === 'Contemplado') {
        const month = parseInt(item.dataSaidaProposta.split('/')[1]);
        if (month >= 1 && month <= 3) quarters.T1 += item.valorVenda;
        else if (month >= 4 && month <= 6) quarters.T2 += item.valorVenda;
        else if (month >= 7 && month <= 9) quarters.T3 += item.valorVenda;
        else if (month >= 10 && month <= 12) quarters.T4 += item.valorVenda;
      }
    });
    
    return quarters;
  }, [filteredData]);

  const annualGoal = useMemo(() => {
    return annualGoalsMockData.find(goal => goal.ano === currentYear && goal.ativo);
  }, [currentYear]);

  const chartData = [
    { trimestre: "T1", realizado: quarterlyData.T1, meta: annualGoal?.metaT1 || 0 },
    { trimestre: "T2", realizado: quarterlyData.T2, meta: annualGoal?.metaT2 || 0 },
    { trimestre: "T3", realizado: quarterlyData.T3, meta: annualGoal?.metaT3 || 0 },
    { trimestre: "T4", realizado: quarterlyData.T4, meta: annualGoal?.metaT4 || 0 },
  ];

  const chartConfig = {
    realizado: {
      label: "Realizado",
      color: "hsl(var(--chart-1))",
    },
    meta: {
      label: "Meta",
      color: "hsl(var(--chart-2))",
    },
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Performance de Vendas {currentYear}</h1>
        <p className="text-muted-foreground">
          Acompanhamento de vendas por trimestre
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Realizado vs Meta - {currentYear}</CardTitle>
          <CardDescription>
            Comparação entre valores realizados e metas trimestrais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="trimestre" />
                <Tooltip content={<ChartTooltipContent />} formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="realizado" fill="var(--color-realizado)" name="Realizado" radius={[8, 8, 0, 0]} />
                <Line dataKey="meta" stroke="var(--color-meta)" strokeWidth={2} name="Meta" type="monotone" />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {['T1', 'T2', 'T3', 'T4'].map((quarter, index) => {
          const data = chartData[index];
          const performance = data.meta > 0 ? ((data.realizado / data.meta) * 100).toFixed(1) : '0.0';
          const isAboveTarget = parseFloat(performance) >= 100;
          
          return (
            <Card key={quarter}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{quarter}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Realizado</p>
                    <p className="text-lg font-bold">{formatCurrency(data.realizado)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Meta</p>
                    <p className="text-sm">{formatCurrency(data.meta)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Performance</p>
                    <p className={`text-xl font-bold ${isAboveTarget ? 'text-green-600' : 'text-red-600'}`}>
                      {performance}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
