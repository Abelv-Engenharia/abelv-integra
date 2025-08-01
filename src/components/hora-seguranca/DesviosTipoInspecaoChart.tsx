
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { fetchDesviosByInspectionType } from '@/services/hora-seguranca';
import { useUserCCAs } from '@/hooks/useUserCCAs';
import { supabase } from "@/integrations/supabase/client";

interface Filters {
  ccaId?: number;
  responsavel?: string;
  dataInicial?: string;
  dataFinal?: string;
}

interface DesviosTipoInspecaoChartProps {
  filters?: Filters;
}

export function DesviosTipoInspecaoChart({ filters }: DesviosTipoInspecaoChartProps) {
  console.log('DesviosTipoInspecaoChart rendering with PieChart');
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
          .select('inspecao_programada, desvios_identificados')
          .in('cca_id', userCCAs.map(cca => cca.id))
          .gt('desvios_identificados', 0);

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
          setError("Não foi possível carregar os dados de desvios por tipo de inspeção");
          return;
        }

        // Processar dados por tipo de inspeção
        const processedData: { [key: string]: number } = {};
        
        execucoes?.forEach(item => {
          const tipo = item.inspecao_programada || 'Tipo não informado';
          
          if (!processedData[tipo]) {
            processedData[tipo] = 0;
          }
          
          processedData[tipo] += item.desvios_identificados || 0;
        });

        // Converter para formato do gráfico
        const formattedData = Object.keys(processedData).map((tipo, index) => ({
          name: tipo,
          value: processedData[tipo],
          fill: `hsl(${210 + index * 20}, 20%, ${50 + index * 10}%)`
        }));
        
        setData(formattedData);
      } catch (err) {
        console.error("Error loading desvios by inspection type:", err);
        setError("Não foi possível carregar os dados de desvios por tipo de inspeção");
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
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
