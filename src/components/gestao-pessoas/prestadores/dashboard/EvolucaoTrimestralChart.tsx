import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DemonstrativoPrestador } from "@/types/dashboard-prestadores";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useMemo } from "react";
import { DashboardPrestadoresService } from "@/services/DashboardPrestadoresService";

interface EvolucaoTrimestralChartProps {
  dados: DemonstrativoPrestador[];
}

export function EvolucaoTrimestralChart({ dados }: EvolucaoTrimestralChartProps) {
  const chartData = useMemo(() => {
    const dadosMensais = DashboardPrestadoresService.obterDadosMensais(dados);
    
    return dadosMensais.map(item => ({
      mes: new Date(item.mes + '-01').toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
      'Total NF': item.nf,
      'Total descontos': item.descontos,
      'Líquido': item.nf - item.descontos,
    }));
  }, [dados]);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evolução trimestral</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">Sem dados para exibir</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução trimestral</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis 
              tickFormatter={(value) => 
                `R$ ${(value / 1000).toFixed(0)}k`
              }
            />
            <Tooltip 
              formatter={(value: number) => 
                value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
              }
            />
            <Legend />
            <Line type="monotone" dataKey="Total NF" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="Total descontos" stroke="#ef4444" strokeWidth={2} />
            <Line type="monotone" dataKey="Líquido" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
