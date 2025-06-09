
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

const COLORS = ['#82ca9d', '#ffc658', '#ff9e40', '#ff6b6b'];

const TarefasCriticidadeChart = () => {
  const [data, setData] = useState([
    { name: 'Baixa', value: 0 },
    { name: 'Média', value: 0 },
    { name: 'Alta', value: 0 },
    { name: 'Crítica', value: 0 },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tarefas = await tarefasService.getAll();
        const criticidadeCount = {
          baixa: 0,
          media: 0,
          alta: 0,
          critica: 0
        };

        tarefas.forEach(tarefa => {
          const criticidade = tarefa.configuracao?.criticidade || 'media';
          criticidadeCount[criticidade]++;
        });

        setData([
          { name: 'Baixa', value: criticidadeCount.baixa },
          { name: 'Média', value: criticidadeCount.media },
          { name: 'Alta', value: criticidadeCount.alta },
          { name: 'Crítica', value: criticidadeCount.critica },
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

export default TarefasCriticidadeChart;
