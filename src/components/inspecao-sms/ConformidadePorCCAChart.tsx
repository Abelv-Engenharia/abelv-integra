import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

interface ConformidadePorCCAChartProps {
  data: any[];
}

export const ConformidadePorCCAChart = ({ data }: ConformidadePorCCAChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart 
        data={data} 
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <XAxis 
          dataKey="cca" 
          tick={{ fontSize: 10, textAnchor: 'end', transform: 'rotate(-90)' }}
          height={80}
          interval={0}
          axisLine={true}
        />
        <YAxis hide />
        <Tooltip 
          formatter={(value, name) => [value, name === 'conformes' ? 'Conformes' : 'Não Conformes']}
          labelFormatter={(label) => `CCA: ${label}`}
        />
        <Legend />
        <Bar 
          dataKey="conformes" 
          fill="#22c55e" 
          name="Conformes"
          radius={[2, 2, 0, 0]}
        >
          <LabelList dataKey="conformes" position="top" fontSize={10} />
        </Bar>
        <Bar 
          dataKey="naoConformes" 
          fill="#ef4444" 
          name="Não Conformes"
          radius={[2, 2, 0, 0]}
        >
          <LabelList dataKey="naoConformes" position="top" fontSize={10} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};