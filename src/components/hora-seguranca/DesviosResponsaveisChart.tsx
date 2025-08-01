
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchDesviosByResponsavel } from '@/services/hora-seguranca';
import { useUserCCAs } from '@/hooks/useUserCCAs';
import { supabase } from "@/integrations/supabase/client";

interface Filters {
  ccaId?: number;
  responsavel?: string;
  dataInicial?: string;
  dataFinal?: string;
}

interface DesviosResponsaveisChartProps {
  filters?: Filters;
}

export function DesviosResponsaveisChart({ filters }: DesviosResponsaveisChartProps) {
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
          .select('responsavel_inspecao, desvios_identificados')
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
          setError("Não foi possível carregar os dados de desvios por responsável");
          return;
        }

        // Processar dados por responsável
        const processedData: { [key: string]: number } = {};
        
        execucoes?.forEach(item => {
          const responsavel = item.responsavel_inspecao;
          if (!responsavel) return;
          
          if (!processedData[responsavel]) {
            processedData[responsavel] = 0;
          }
          
          processedData[responsavel] += item.desvios_identificados || 0;
        });

        // Converter para formato do gráfico
        const formattedData = Object.keys(processedData).map(responsavel => ({
          name: responsavel.split(' ')[0], // Primeiro nome
          nomeCompleto: responsavel,
          desvios: processedData[responsavel]
        }));
        
        setData(formattedData);
      } catch (err) {
        console.error("Error loading desvios by responsáveis:", err);
        setError("Não foi possível carregar os dados de desvios por responsável");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userCCAs, filters]);

  if (loading) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">Carregando dados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // If we have no data, show a message
  if (data.length === 0) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">Nenhum desvio registrado</p>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 80,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={80}
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
          <Legend />
          <Bar dataKey="desvios" name="Desvios Identificados" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
