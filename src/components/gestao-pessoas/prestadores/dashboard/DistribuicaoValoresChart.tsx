import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DemonstrativoPrestador } from "@/types/gestao-pessoas/dashboard-prestadores";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useMemo } from "react";

interface DistribuicaoValoresChartProps {
  dados: DemonstrativoPrestador[];
}

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#ef4444'];

export function DistribuicaoValoresChart({ dados }: DistribuicaoValoresChartProps) {
  const chartData = useMemo(() => {
    const totalnf = dados.reduce((sum, d) => sum + d.valornf, 0);
    const totalajudaaluguel = dados.reduce((sum, d) => sum + d.ajudaaluguel, 0);
    const totalreembolso = dados.reduce((sum, d) => sum + d.reembolsoconvenio, 0);
    const totaldescontos = dados.reduce((sum, d) => 
      sum + d.descontoconvenio + d.multasdescontos + d.descontoabelvrun, 0
    );

    return [
      { name: 'NF', value: totalnf },
      { name: 'Ajuda aluguel', value: totalajudaaluguel },
      { name: 'Reembolso', value: totalreembolso },
      { name: 'Descontos', value: totaldescontos },
    ].filter(item => item.value > 0);
  }, [dados]);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de valores</CardTitle>
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
        <CardTitle>Distribuição de valores</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => 
                value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
              }
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
