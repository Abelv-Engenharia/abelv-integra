
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { fetchTreinamentosNormativosData } from "@/services/treinamentos/treinamentosNormativosDataService";
import { useUserCCAs } from "@/hooks/useUserCCAs";

interface TreinamentosNormativosChartProps {
  filters?: {
    year?: number;
    month?: number;
    ccaId?: number;
  };
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

const TreinamentosNormativosChart = ({ filters }: TreinamentosNormativosChartProps) => {
  const { data: userCCAs = [] } = useUserCCAs();
  const userCCAIds = userCCAs.map(cca => cca.id);
  
  // Aplicar filtros de CCA se especificado
  const filteredCCAIds = filters?.ccaId ? [filters.ccaId] : userCCAIds;

  const { data: chartData = [], isLoading } = useQuery({
    queryKey: ['treinamentos-normativos-chart', filteredCCAIds, filters],
    queryFn: () => fetchTreinamentosNormativosData(filteredCCAIds),
    enabled: filteredCCAIds.length > 0,
  });

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-muted-foreground">Carregando dados...</p>
      </div>
    );
  }

  if (chartData.length === 0 || chartData.every(item => item.value === 0)) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-muted-foreground">Nenhum dado disponível para o período selecionado</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-blue-600">
            Quantidade: {data.value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name}: ${value}`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export { TreinamentosNormativosChart };
