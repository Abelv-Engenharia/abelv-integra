import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DashboardStats } from "@/types/travel";

interface ServiceDistributionChartProps {
  stats: DashboardStats;
}

export const ServiceDistributionChart = ({ stats }: ServiceDistributionChartProps) => {
  const data = [
    { name: 'Passagem Aérea', value: stats.serviceDistribution.air, color: '#8b5cf6' },
    { name: 'Passagem Rodoviária', value: stats.serviceDistribution.bus, color: '#06b6d4' },
    { name: 'Hotel', value: stats.serviceDistribution.hotel, color: '#10b981' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Serviços</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};