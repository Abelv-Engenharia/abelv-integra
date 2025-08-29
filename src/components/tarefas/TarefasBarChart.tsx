
import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList
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

        const allowedCcaCodes = userCCAs.map(cca => cca.codigo.trim());
        
        const { data: tarefasData, error } = await supabase
          .from('tarefas')
          .select('data_cadastro, status, cca')
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
        
        // Inicializar todos os 12 meses do ano atual
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        
        for (let i = 0; i < 12; i++) {
          const monthKey = monthNames[i];
          monthlyData[monthKey] = {
            programadas: 0,
            concluidas: 0,
            pendentes: 0,
            em_andamento: 0
          };
        }

        // Processar dados das tarefas
        tarefasData?.forEach(tarefa => {
          // Verificar se a tarefa pertence a uma CCA permitida
          const tarefaCcaCode = tarefa.cca.split(' - ')[0].trim();
          if (!allowedCcaCodes.includes(tarefaCcaCode)) {
            return;
          }

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
              case 'em-andamento':
                monthlyData[monthKey].em_andamento++;
                break;
            }
          }
        });

        // Converter para array no formato do gráfico (manter ordem dos meses)
        const chartData = monthNames.map(month => ({
          name: month,
          programadas: monthlyData[month].programadas,
          concluidas: monthlyData[month].concluidas,
          pendentes: monthlyData[month].pendentes,
          em_andamento: monthlyData[month].em_andamento
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
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="name" />
        <Tooltip />
        <Legend />
        <Bar dataKey="programadas" fill="#3b82f6" name="Programadas">
          <LabelList dataKey="programadas" position="top" fill="hsl(var(--foreground))" fontSize={10} />
        </Bar>
        <Bar dataKey="concluidas" fill="#22c55e" name="Concluídas">
          <LabelList dataKey="concluidas" position="top" fill="hsl(var(--foreground))" fontSize={10} />
        </Bar>
        <Bar dataKey="pendentes" fill="#ef4444" name="Pendentes">
          <LabelList dataKey="pendentes" position="top" fill="hsl(var(--foreground))" fontSize={10} />
        </Bar>
        <Bar dataKey="em_andamento" fill="#f97316" name="Em Andamento">
          <LabelList dataKey="em_andamento" position="top" fill="hsl(var(--foreground))" fontSize={10} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TarefasBarChart;
