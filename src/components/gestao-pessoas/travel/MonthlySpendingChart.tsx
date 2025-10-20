import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DashboardStats } from "@/types/travel";

interface MonthlySpendingChartProps {
  stats: DashboardStats;
}

export const MonthlySpendingChart = ({ stats }: MonthlySpendingChartProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos Mensais por Agência</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.monthlySpending}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Legend />
            <Bar dataKey="onfly" stackId="a" fill="#8b5cf6" name="Onfly" />
            <Bar dataKey="biztrip" stackId="a" fill="#06b6d4" name="Biztrip" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};