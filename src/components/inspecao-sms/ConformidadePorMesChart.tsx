import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ConformidadePorMesChartProps {
  data: any[];
}

export const ConformidadePorMesChart = ({ data }: ConformidadePorMesChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="mes" 
          tick={{ fontSize: 12 }}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip 
          formatter={(value, name) => [value, name === 'conformes' ? 'Conformes' : 'Não Conformes']}
          labelFormatter={(label) => `Mês: ${label}`}
        />
        <Legend />
        <Bar 
          dataKey="conformes" 
          fill="#22c55e" 
          name="Conformes"
          radius={[2, 2, 0, 0]}
        />
        <Bar 
          dataKey="naoConformes" 
          fill="#ef4444" 
          name="Não Conformes"
          radius={[2, 2, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};