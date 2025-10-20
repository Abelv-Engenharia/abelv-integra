import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DemonstrativoPrestador } from "@/types/dashboard-prestadores";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useMemo } from "react";
import { DashboardPrestadoresService } from "@/services/DashboardPrestadoresService";

interface ComparativoMensalChartProps {
  dados: DemonstrativoPrestador[];
}

export function ComparativoMensalChart({ dados }: ComparativoMensalChartProps) {
  const chartData = useMemo(() => {
    const dadosMensais = DashboardPrestadoresService.obterDadosMensais(dados);
    
    return dadosMensais.map(item => ({
      mes: new Date(item.mes + '-01').toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
      'NF': item.nf,
      'Ajuda aluguel': item.ajudaaluguel,
      'Reembolso': item.reembolso,
      'Descontos': item.descontos,
    }));
  }, [dados]);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comparativo mensal</CardTitle>
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
        <CardTitle>Comparativo mensal</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
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
            <Bar dataKey="NF" stackId="a" fill="#3b82f6" />
            <Bar dataKey="Ajuda aluguel" stackId="a" fill="#10b981" />
            <Bar dataKey="Reembolso" stackId="a" fill="#8b5cf6" />
            <Bar dataKey="Descontos" stackId="a" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
