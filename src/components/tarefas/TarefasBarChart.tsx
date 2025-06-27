
import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useUserCCAs } from '@/hooks/useUserCCAs';

interface ChartData {
  name: string;
  programadas: number;
  concluidas: number;
  pendentes: number;
  em_andamento: number;
}

const TarefasBarChart = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: userCCAs = [] } = useUserCCAs();

  useEffect(() => {
    const fetchTarefasData = async () => {
      try {
        setLoading(true);
        
        if (userCCAs.length === 0) {
          setData([]);
          setLoading(false);
          return;
        }

        const allowedCcaNames = userCCAs.map(cca => cca.codigo);
        
        const { data: tarefasData, error } = await supabase
          .from('tarefas')
          .select('data_cadastro, status, cca')
          .in('cca', allowedCcaNames.map(codigo => `${codigo} - `))
          .gte('data_cadastro', new Date(new Date().getFullYear(), 0, 1).toISOString())
          .order('data_cadastro', { ascending: true });

        if (error) {
          console.error('Erro ao buscar tarefas:', error);
          setData([]);
          return;
        }

        // Agrupar dados por mês
        const monthlyData: Record<string, { programadas: number; concluidas: number; pendentes: number; em_andamento: number }> = {};
        
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        
        // Inicializar os últimos 6 meses
        const currentDate = new Date();
        for (let i = 5; i >= 0; i--) {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
          const monthKey = monthNames[date.getMonth()];
          monthlyData[monthKey] = {
            programadas: 0,
            concluidas: 0,
            pendentes: 0,
            em_andamento: 0
          };
        }

        // Processar dados das tarefas
        tarefasData?.forEach(tarefa => {
          const date = new Date(tarefa.data_cadastro);
          const monthKey = monthNames[date.getMonth()];
          
          if (monthlyData[monthKey]) {
            switch (tarefa.status) {
              case 'programada':
                monthlyData[monthKey].programadas++;
                break;
              case 'concluida':
                monthlyData[monthKey].concluidas++;
                break;
              case 'pendente':
                monthlyData[monthKey].pendentes++;
                break;
              case 'em_andamento':
                monthlyData[monthKey].em_andamento++;
                break;
            }
          }
        });

        // Converter para array no formato do gráfico
        const chartData = Object.entries(monthlyData).map(([name, values]) => ({
          name,
          programadas: values.programadas,
          concluidas: values.concluidas,
          pendentes: values.pendentes,
          em_andamento: values.em_andamento
        }));

        setData(chartData);
      } catch (error) {
        console.error('Erro ao processar dados das tarefas:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTarefasData();
  }, [userCCAs]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="text-sm text-muted-foreground">Carregando dados...</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="programadas" fill="#8884d8" name="Programadas" />
        <Bar dataKey="concluidas" fill="#82ca9d" name="Concluídas" />
        <Bar dataKey="pendentes" fill="#ffc658" name="Pendentes" />
        <Bar dataKey="em_andamento" fill="#ff7300" name="Em Andamento" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TarefasBarChart;
