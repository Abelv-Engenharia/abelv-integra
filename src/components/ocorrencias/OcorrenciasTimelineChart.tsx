
import { useState, useEffect } from "react";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { supabase } from '@/integrations/supabase/client';

const OcorrenciasTimelineChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('Carregando dados de timeline...');
        
        const { data: ocorrencias, error } = await supabase
          .from('ocorrencias')
          .select('data, mes, ano')
          .order('data', { ascending: true });

        if (error) throw error;

        console.log('Dados de timeline:', ocorrencias);

        const monthlyCount = (ocorrencias || []).reduce((acc: Record<string, number>, curr) => {
          if (curr.mes && curr.ano) {
            const key = `${curr.ano}-${curr.mes.toString().padStart(2, '0')}`;
            acc[key] = (acc[key] || 0) + 1;
          }
          return acc;
        }, {});

        const timelineData = Object.entries(monthlyCount)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([month, count]) => ({
            month,
            ocorrencias: count
          }));

        console.log('Dados do gráfico de timeline:', timelineData);
        setData(timelineData);
      } catch (err) {
        console.error("Error loading timeline data:", err);
        setError("Erro ao carregar dados de timeline");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">Nenhum dado disponível</p>
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 11 }}
            tickFormatter={(value) => {
              const [year, month] = value.split('-');
              return `${month}/${year.slice(2)}`;
            }}
          />
          <YAxis />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            labelFormatter={(value) => {
              const [year, month] = value.toString().split('-');
              const monthNames = [
                'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
              ];
              return `${monthNames[parseInt(month) - 1]}/${year}`;
            }}
            formatter={(value) => [`${value} ocorrências`, 'Quantidade']}
          />
          <Line 
            type="monotone" 
            dataKey="ocorrencias" 
            stroke="#9b87f5" 
            strokeWidth={2}
            dot={{ fill: '#9b87f5', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#9b87f5', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OcorrenciasTimelineChart;
