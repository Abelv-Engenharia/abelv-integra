
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
  { name: 'Concluídas', value: 85 },
  { name: 'Em andamento', value: 25 },
  { name: 'Pendentes', value: 15 },
  { name: 'Programadas', value: 30 },
];

const COLORS = ['#82ca9d', '#8884d8', '#ffc658', '#bbb'];

const TarefasPieChart = () => {
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

export default TarefasPieChart;
