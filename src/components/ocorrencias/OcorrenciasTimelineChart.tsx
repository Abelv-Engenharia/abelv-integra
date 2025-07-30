
import { useState, useEffect } from "react";
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
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
        console.log('Carregando dados de ocorrências por CCA...');
        
        let query = supabase
          .from('ocorrencias')
          .select('cca, classificacao_ocorrencia_codigo');

        // Aplicar filtro por CCAs do usuário
        if (userCCAs.length > 0) {
          const ccaCodigos = userCCAs.map(cca => cca.codigo);
          query = query.in('cca', ccaCodigos);
        }

        const { data: ocorrencias, error } = await query;

        if (error) throw error;

        console.log('Dados de ocorrências por CCA (filtrado):', ocorrencias);

        // Agrupar por CCA e classificação
        const ccaClassificacaoCount: Record<string, Record<string, number>> = {};
        const ccaNomes: Record<string, string> = {};

        // Buscar nomes dos CCAs
        const ccaCodigos = [...new Set((ocorrencias || []).map((ocorrencia: any) => ocorrencia.cca))];
        if (ccaCodigos.length > 0) {
          const { data: ccasData } = await supabase
            .from('ccas')
            .select('codigo, nome')
            .in('codigo', ccaCodigos);
          
          ccasData?.forEach((cca: any) => {
            ccaNomes[cca.codigo] = `${cca.codigo} - ${cca.nome}`;
          });
        }

        (ocorrencias || []).forEach((ocorrencia: any) => {
          const ccaCodigo = ocorrencia.cca;
          const classificacao = ocorrencia.classificacao_ocorrencia_codigo || 'Não definido';
          
          // Usar nome completo do CCA se disponível
          if (!ccaNomes[ccaCodigo]) {
            ccaNomes[ccaCodigo] = ccaCodigo;
          }

          if (!ccaClassificacaoCount[ccaCodigo]) {
            ccaClassificacaoCount[ccaCodigo] = {};
          }
          
          ccaClassificacaoCount[ccaCodigo][classificacao] = 
            (ccaClassificacaoCount[ccaCodigo][classificacao] || 0) + 1;
        });

        // Obter todas as classificações únicas
        const todasClassificacoes = new Set<string>();
        Object.values(ccaClassificacaoCount).forEach(classificacoes => {
          Object.keys(classificacoes).forEach(classificacao => {
            todasClassificacoes.add(classificacao);
          });
        });

        // Converter para formato do gráfico
        const chartData = Object.entries(ccaClassificacaoCount).map(([ccaCodigo, classificacoes]) => {
          const item: any = {
            name: ccaCodigo,
            nomeCompleto: ccaNomes[ccaCodigo] || ccaCodigo
          };
          
          todasClassificacoes.forEach(classificacao => {
            item[classificacao] = classificacoes[classificacao] || 0;
          });
          
          return item;
        });

        console.log('Dados do gráfico por CCA (filtrado):', chartData);
        setData(chartData);
      } catch (err) {
        console.error("Error loading CCA data:", err);
        setError("Erro ao carregar dados por CCA");
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

  // Obter todas as classificações para criar as barras
  const classificacoes = data.length > 0 ? 
    Object.keys(data[0]).filter(key => key !== 'name' && key !== 'nomeCompleto') : [];

  // Cores para as barras
  const cores = [
    '#4285F4', '#43A047', '#E53935', '#FFA000', '#757575', 
    '#9C27B0', '#FF5722', '#607D8B', '#795548', '#009688'
  ];

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 11 }}
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
          />
          <YAxis />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            labelFormatter={(label, payload) => {
              if (payload && payload.length > 0) {
                return payload[0]?.payload?.nomeCompleto || label;
              }
              return label;
            }}
            formatter={(value) => [`${value} ocorrências`, 'Quantidade']}
          />
          <Legend 
            verticalAlign="top" 
            align="center"
            wrapperStyle={{ 
              paddingBottom: '10px',
              position: 'relative',
              top: '0px'
            }}
          />
          {classificacoes.map((classificacao, index) => (
            <Bar 
              key={classificacao}
              dataKey={classificacao} 
              name={classificacao}
              fill={cores[index % cores.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OcorrenciasTimelineChart;
