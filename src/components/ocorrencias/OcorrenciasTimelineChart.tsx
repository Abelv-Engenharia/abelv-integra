
import { useState, useEffect } from "react";
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, LabelList } from "recharts";
import { supabase } from '@/integrations/supabase/client';
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { useOcorrenciasFilter } from "@/contexts/OcorrenciasFilterContext";

const OcorrenciasTimelineChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: userCCAs = [] } = useUserCCAs();
  const { year, month, ccaId } = useOcorrenciasFilter();

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

        // Construir query com filtros
        let query = supabase
          .from('ocorrencias')
          .select('cca, classificacao_ocorrencia_codigo');

        // Aplicar filtro de CCA
        if (ccaId !== 'todos') {
          query = query.eq('cca', ccaId);
        } else {
          // Filtrar pelos CCAs que o usuário tem acesso
          const allowedCcaIds = userCCAs.map(cca => cca.id.toString());
          if (allowedCcaIds.length > 0) {
            query = query.in('cca', allowedCcaIds);
          }
        }

        // Aplicar filtro de ano se fornecido
        if (year && year !== 'todos') {
          query = query.eq('ano', parseInt(year));
        }

        // Aplicar filtro de mês se fornecido
        if (month && month !== 'todos') {
          query = query.eq('mes', parseInt(month));
        }

        const { data: ocorrencias, error } = await query;

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
  }, [userCCAs, year, month, ccaId]);

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

  // Ordem específica das classificações
  const ordemClassificacoes = ['AC CPD', 'AC SPD', 'INC DM', 'INC SDM', 'INC AMB'];
  
  // Cores específicas para cada tipo
  const coresEspecificas: Record<string, string> = {
    'AC CPD': '#E53935',    // Vermelho
    'AC SPD': '#FF6F00',    // Laranja
    'INC DM': '#1976D2',    // Azul
    'INC SDM': '#757575',   // Cinza
    'INC AMB': '#388E3C'    // Verde
  };

  // Obter todas as classificações para criar as barras
  const todasClassificacoes = data.length > 0 ? 
    Object.keys(data[0]).filter(key => key !== 'name' && key !== 'nomeCompleto') : [];
  
  // Ordenar classificações de acordo com a ordem especificada
  const classificacoes = ordemClassificacoes.filter(c => todasClassificacoes.includes(c))
    .concat(todasClassificacoes.filter(c => !ordemClassificacoes.includes(c)));

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 40,
            right: 50,
            left: 20,
            bottom: 80,
          }}
        >
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 16 }}
            angle={-90}
            textAnchor="end"
            height={80}
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
          {classificacoes.map((classificacao) => (
            <Bar 
              key={classificacao}
              dataKey={classificacao} 
              name={classificacao}
              fill={coresEspecificas[classificacao] || '#757575'}
            >
              <LabelList 
                dataKey={classificacao} 
                position="top" 
                fill="#000" 
                fontSize={12} 
                formatter={(value: any) => value > 0 ? value : ''} 
              />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OcorrenciasTimelineChart;
