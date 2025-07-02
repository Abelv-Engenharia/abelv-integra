
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useTreinamentosPorTipoProcesso } from "./useTreinamentosPorTipoProcesso";

interface ProcessoGeralPieChartProps {
  filters?: {
    year?: number;
    month?: number;
    ccaId?: number;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const ProcessoGeralPieChart = ({ filters }: ProcessoGeralPieChartProps) => {
  const { data: chartData = [], isLoading, error } = useTreinamentosPorTipoProcesso(filters);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-muted-foreground">Carregando dados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-red-500">Erro ao carregar dados do gráfico</p>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-muted-foreground">Nenhum dado disponível para o período selecionado</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-blue-600">
            Horas: {data.horasTotais.toLocaleString()}
          </p>
          <p className="text-green-600">
            Percentual: {data.percentual.toFixed(1)}%
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
          label={({ name, percentual }) => `${name}: ${percentual.toFixed(1)}%`}
          outerRadius={120}
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

export default ProcessoGeralPieChart;
