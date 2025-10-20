import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CCASpendingData } from "@/types/gestao-pessoas/travel";

interface CCASpendingChartProps {
  data: CCASpendingData[];
}

export const CCASpendingChart = ({ data }: CCASpendingChartProps) => {
  const chartData = data
    .sort((a, b) => b.totalGasto - a.totalGasto)
    .slice(0, 10)
    .map(cca => ({
      nome: cca.cca,
      Aéreo: cca.gastosAereo,
      Hotel: cca.gastosHotel,
      Rodoviário: cca.gastosRodoviario
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 CCAs por Gasto Total</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="nome" type="category" width={80} />
            <Tooltip 
              formatter={(value: number) => 
                new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(value)
              }
            />
            <Legend />
            <Bar dataKey="Aéreo" stackId="a" fill="#3b82f6" />
            <Bar dataKey="Hotel" stackId="a" fill="#10b981" />
            <Bar dataKey="Rodoviário" stackId="a" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
