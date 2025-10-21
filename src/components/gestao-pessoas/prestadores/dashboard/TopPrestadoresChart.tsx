import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopPrestador } from "@/types/gestao-pessoas/dashboard-prestadores";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface TopPrestadoresChartProps {
  dados: TopPrestador[];
}

export function TopPrestadoresChart({ dados }: TopPrestadoresChartProps) {
  const chartData = dados.map(p => ({
    nome: p.nome.split(' ')[0],
    valor: p.totalnf,
  }));

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top 10 prestadores</CardTitle>
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
        <CardTitle>Top 10 prestadores por valor de NF</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number"
              tickFormatter={(value) => 
                `R$ ${(value / 1000).toFixed(0)}k`
              }
            />
            <YAxis dataKey="nome" type="category" width={80} />
            <Tooltip 
              formatter={(value: number) => 
                value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
              }
            />
            <Bar dataKey="valor" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
