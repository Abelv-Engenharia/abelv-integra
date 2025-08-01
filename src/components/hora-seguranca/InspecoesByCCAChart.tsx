
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchInspecoesByCCA } from '@/services/hora-seguranca/inspecoesByCCAService';
import { useUserCCAs } from '@/hooks/useUserCCAs';
import { supabase } from "@/integrations/supabase/client";

interface Filters {
  ccaId?: number;
  responsavel?: string;
  dataInicial?: string;
  dataFinal?: string;
}

interface InspecoesByCCAChartProps {
  filters?: Filters;
}

export function InspecoesByCCAChart({ filters }: InspecoesByCCAChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: userCCAs = [] } = useUserCCAs();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        if (userCCAs.length === 0) {
          setData([]);
          setLoading(false);
          return;
        }
        
        // Aplicar filtros na consulta
        let query = supabase
          .from('execucao_hsa')
          .select(`
            cca_id,
            status,
            ccas:cca_id(codigo, nome)
          `)
          .in('cca_id', userCCAs.map(cca => cca.id));

        // Aplicar filtros adicionais
        if (filters?.ccaId) {
          query = query.eq('cca_id', filters.ccaId);
        }
        
        if (filters?.responsavel) {
          query = query.eq('responsavel_inspecao', filters.responsavel);
        }
        
        if (filters?.dataInicial) {
          query = query.gte('data', filters.dataInicial);
        }
        
        if (filters?.dataFinal) {
          query = query.lte('data', filters.dataFinal);
        }

        const { data: execucoes, error } = await query;
        
        if (error) {
          console.error('Erro ao buscar dados:', error);
          setError("Não foi possível carregar os dados de inspeções por CCA");
          return;
        }

        // Processar dados por CCA
        const processedData: { [key: string]: any } = {};
        
        execucoes?.forEach(item => {
          const ccaData = item.ccas as any;
          const codigo = ccaData?.codigo;
          const nome = ccaData?.nome;
          
          if (!codigo) return;
          
          if (!processedData[codigo]) {
            processedData[codigo] = {
              codigo,
              nomeCompleto: `${codigo} - ${nome}`,
              "A Realizar": 0,
              "Realizada": 0,
              "Não Realizada": 0,
              "Realizada (Não Programada)": 0,
              "Cancelada": 0
            };
          }
          
          const status = (item.status || '').toUpperCase();
          switch (status) {
            case 'A REALIZAR':
              processedData[codigo]["A Realizar"]++;
              break;
            case 'REALIZADA':
              processedData[codigo]["Realizada"]++;
              break;
            case 'NÃO REALIZADA':
              processedData[codigo]["Não Realizada"]++;
              break;
            case 'REALIZADA (NÃO PROGRAMADA)':
              processedData[codigo]["Realizada (Não Programada)"]++;
              break;
            case 'CANCELADA':
              processedData[codigo]["Cancelada"]++;
              break;
          }
        });

        // Converter para formato do gráfico
        const formattedData = Object.keys(processedData).map(codigo => ({
          name: codigo,
          nomeCompleto: processedData[codigo].nomeCompleto,
          "A Realizar": processedData[codigo]["A Realizar"],
          "Realizada": processedData[codigo]["Realizada"],
          "Não Realizada": processedData[codigo]["Não Realizada"],
          "Realizada (Não Programada)": processedData[codigo]["Realizada (Não Programada)"],
          "Cancelada": processedData[codigo]["Cancelada"]
        }));
        
        setData(formattedData);
      } catch (err) {
        console.error("Error loading inspeções by CCA:", err);
        setError("Não foi possível carregar os dados de inspeções por CCA");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userCCAs, filters]);

  if (loading) {
    return (
      <div className="h-[500px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">Carregando dados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[500px] w-full flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-[500px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">Nenhum dado de inspeção disponível</p>
      </div>
    );
  }

  return (
    <div className="h-[500px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 80,
          }}
          barCategoryGap="25%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={60}
            interval={0}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(label, payload) => {
              if (payload && payload.length > 0) {
                return payload[0]?.payload?.nomeCompleto || label;
              }
              return label;
            }}
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
          <Bar dataKey="A Realizar" name="A Realizar" fill="#4285F4" />
          <Bar dataKey="Realizada" name="Realizada" fill="#43A047" />
          <Bar dataKey="Não Realizada" name="Não Realizada" fill="#E53935" />
          <Bar dataKey="Realizada (Não Programada)" name="Realizada (Não Programada)" fill="#FFA000" />
          <Bar dataKey="Cancelada" name="Cancelada" fill="#757575" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
