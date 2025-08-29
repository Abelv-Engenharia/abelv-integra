import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useUserCCAs } from '@/hooks/useUserCCAs';

interface ChartData {
  usuario: string;
  programadas: number;
  concluidas: number;
  pendentes: number;
  em_andamento: number;
  total: number;
}

const TarefasStatusPorUsuarioChart = () => {
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
        
        // Buscar tarefas com responsáveis
        const { data: tarefasData, error } = await supabase
          .from('tarefas')
          .select(`
            status, 
            cca,
            profiles!tarefas_responsavel_id_fkey(nome)
          `);

        if (error) {
          console.error('Erro ao buscar tarefas:', error);
          setData([]);
          return;
        }

        // Agrupar dados por usuário
        const userData: Record<string, { programadas: number; concluidas: number; pendentes: number; em_andamento: number }> = {};
        
        // Processar dados das tarefas
        tarefasData?.forEach(tarefa => {
          // Verificar se a tarefa pertence a uma CCA permitida
          const tarefaCcaCode = tarefa.cca.split(' - ')[0].trim();
          if (!allowedCcaCodes.includes(tarefaCcaCode)) {
            return;
          }

          const userName = tarefa.profiles?.nome;
          if (!userName) return;
          
          if (!userData[userName]) {
            userData[userName] = {
              programadas: 0,
              concluidas: 0,
              pendentes: 0,
              em_andamento: 0
            };
          }

          switch (tarefa.status) {
            case 'programada':
              userData[userName].programadas++;
              break;
            case 'concluida':
              userData[userName].concluidas++;
              break;
            case 'pendente':
              userData[userName].pendentes++;
              break;
            case 'em_andamento':
            case 'em-andamento':
              userData[userName].em_andamento++;
              break;
          }
        });

        // Converter para array no formato do gráfico
        const chartData = Object.entries(userData).map(([usuario, values]) => ({
          usuario: usuario.split(' ')[0], // Apenas primeiro nome
          programadas: values.programadas,
          concluidas: values.concluidas,
          pendentes: values.pendentes,
          em_andamento: values.em_andamento,
          total: values.programadas + values.concluidas + values.pendentes + values.em_andamento
        })).sort((a, b) => b.total - a.total);

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

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="text-sm text-muted-foreground">Nenhum dado encontrado</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <XAxis 
          dataKey="usuario" 
          angle={-90} 
          textAnchor="end" 
          height={80}
          interval={0}
          tick={{ fontSize: 12 }}
        />
        <Bar dataKey="programadas" fill="hsl(var(--chart-1))" name="Programadas">
          <LabelList dataKey="programadas" position="top" fill="hsl(var(--foreground))" fontSize={10} />
        </Bar>
        <Bar dataKey="em_andamento" fill="hsl(var(--chart-2))" name="Em Andamento">
          <LabelList dataKey="em_andamento" position="top" fill="hsl(var(--foreground))" fontSize={10} />
        </Bar>
        <Bar dataKey="pendentes" fill="hsl(var(--chart-3))" name="Pendentes">
          <LabelList dataKey="pendentes" position="top" fill="hsl(var(--foreground))" fontSize={10} />
        </Bar>
        <Bar dataKey="concluidas" fill="hsl(var(--chart-4))" name="Concluídas">
          <LabelList dataKey="concluidas" position="top" fill="hsl(var(--foreground))" fontSize={10} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TarefasStatusPorUsuarioChart;