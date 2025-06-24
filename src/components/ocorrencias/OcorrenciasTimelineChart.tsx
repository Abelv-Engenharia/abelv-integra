
import { useState, useEffect } from "react";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { supabase } from '@/integrations/supabase/client';
import { useUserCCAs } from "@/hooks/useUserCCAs";

const OcorrenciasTimelineChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: userCCAs = [] } = useUserCCAs();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('Carregando dados de timeline...');
        
        let query = supabase
          .from('ocorrencias')
          .select('data, mes, ano')
          .order('data', { ascending: true });

        // Aplicar filtro por CCAs do usuário
        if (userCCAs.length > 0) {
          // Como a tabela ocorrencias tem o campo 'cca' como texto, 
          // precisamos buscar os códigos dos CCAs permitidos
          const { data: ccasData } = await supabase
            .from('ccas')
            .select('codigo')
            .in('id', userCCAs.map(cca => cca.id));
          
          if (ccasData && ccasData.length > 0) {
            const ccaCodigos = ccasData.map(cca => cca.codigo);
            query = query.in('cca', ccaCodigos);
          }
        }

        const { data: ocorrencias, error } = await query;

        if (error) throw error;

        console.log('Dados de timeline (filtrado):', ocorrencias);

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

        console.log('Dados do gráfico de timeline (filtrado):', timelineData);
        setData(timelineData);
      } catch (err) {
        console.error("Error loading timeline data:", err);
        setError("Erro ao carregar dados de timeline");
      } finally {
        setLoading(false);
      }
    };

    // Só carrega se já temos dados dos CCAs ou se não há CCAs (para mostrar vazio)
    if (userCCAs.length > 0 || userCCAs.length === 0) {
      loadData();
    }
  }, [userCCAs]);

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
