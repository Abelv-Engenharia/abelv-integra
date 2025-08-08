
import React, { useEffect, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { fetchDesviosByResponsavel } from "@/services/hora-seguranca/desviosByResponsavelService";
import { useUserCCAs } from "@/hooks/useUserCCAs";

interface Filters {
  ccaId?: number;
  responsavel?: string;
  dataInicial?: string;
  dataFinal?: string;
}

interface DesviosResponsaveisChartProps {
  filters?: Filters;
}

export const DesviosResponsaveisChart = ({ filters }: DesviosResponsaveisChartProps) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

        const ccaIds = userCCAs.map(cca => cca.id);
        const chartData = await fetchDesviosByResponsavel(ccaIds, filters);
        
        // Formatar dados para mostrar apenas primeiro nome no eixo X
        const formattedData = chartData.map(item => ({
          name: item.responsavel?.split(' ')[0] || item.responsavel,
          nomeCompleto: item.responsavel,
          desvios: item.desvios
        }));
        
        setData(formattedData);
      } catch (error) {
        console.error("Error loading desvios by responsável chart:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userCCAs, filters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-muted-foreground">Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
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
          <Bar dataKey="desvios" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
