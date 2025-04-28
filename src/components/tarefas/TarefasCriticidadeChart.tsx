
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const data = [
  { name: 'Baixa', value: 30 },
  { name: 'Média', value: 45 },
  { name: 'Alta', value: 25 },
  { name: 'Crítica', value: 15 },
];

const COLORS = ['#82ca9d', '#ffc658', '#ff9e40', '#ff6b6b'];

const TarefasCriticidadeChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} tarefas`, 'Quantidade']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default TarefasCriticidadeChart;
