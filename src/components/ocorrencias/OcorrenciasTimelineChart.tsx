
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
        
        // Primeiro buscar os CCAs para mapear ID para código
        const { data: ccasData } = await supabase
          .from('ccas')
          .select('id, codigo, nome');

        const ccaMap = new Map();
        ccasData?.forEach(cca => {
          ccaMap.set(cca.id.toString(), { codigo: cca.codigo, nome: cca.nome });
        });

        const { data: ocorrencias, error } = await supabase
          .from('ocorrencias')
          .select('cca, classificacao_ocorrencia_codigo');

        if (error) throw error;

        console.log('Dados de ocorrências por CCA (filtrado):', ocorrencias);

        // Agrupar por CCA e classificação
        const ccaClassificacaoCount: Record<string, Record<string, number>> = {};
        const ccaNomes: Record<string, string> = {};

        (ocorrencias || []).forEach((ocorrencia: any) => {
          const ccaId = ocorrencia.cca;
          const classificacao = ocorrencia.classificacao_ocorrencia_codigo || 'Não definido';
          
          // Buscar código e nome do CCA pelo ID
          const ccaInfo = ccaMap.get(ccaId);
          if (!ccaInfo) return; // Pular se não encontrar o CCA
          
          const ccaCodigo = ccaInfo.codigo;
          const ccaNomeCompleto = `${ccaInfo.codigo} - ${ccaInfo.nome}`;
          
          // Armazenar nome completo
          ccaNomes[ccaCodigo] = ccaNomeCompleto;

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
            name: ccaCodigo, // Código do CCA no eixo X
            nomeCompleto: ccaNomes[ccaCodigo] || ccaCodigo // Nome completo para tooltip
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

    loadData();
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
