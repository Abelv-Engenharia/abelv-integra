
import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { tarefasService } from '@/services/tarefasService';

const COLORS = ['#82ca9d', '#8884d8', '#ffc658', '#bbb'];

const TarefasPieChart = () => {
  const [data, setData] = useState([
    { name: 'Concluídas', value: 0 },
    { name: 'Em andamento', value: 0 },
    { name: 'Pendentes', value: 0 },
    { name: 'Programadas', value: 0 },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await tarefasService.getStats();
        setData([
          { name: 'Concluídas', value: stats.concluidas },
          { name: 'Em andamento', value: stats.emAndamento },
          { name: 'Pendentes', value: stats.pendentes },
          { name: 'Programadas', value: stats.programadas },
        ]);
      } catch (error) {
        console.error('Erro ao carregar dados do gráfico:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <p>Carregando dados...</p>
      </div>
    );
  }

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
