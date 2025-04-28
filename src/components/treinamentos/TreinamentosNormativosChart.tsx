
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { MOCK_TREINAMENTOS_NORMATIVOS } from "@/types/treinamentos";
import { calcularStatusTreinamento } from "@/utils/treinamentosUtils";

// Update status of all trainings
const updateStatus = () => {
  return MOCK_TREINAMENTOS_NORMATIVOS.map(treinamento => ({
    ...treinamento,
    status: calcularStatusTreinamento(treinamento.dataValidade)
  }));
};

// Prepare data for the chart
const prepareChartData = () => {
  const trainings = updateStatus();
  
  const statusCount = trainings.reduce((acc, training) => {
    if (!acc[training.status]) {
      acc[training.status] = 0;
    }
    acc[training.status] += 1;
    return acc;
  }, {} as Record<string, number>);
  
  return [
    { name: "Válido", value: statusCount["Válido"] || 0 },
    { name: "Próximo ao vencimento", value: statusCount["Próximo ao vencimento"] || 0 },
    { name: "Vencido", value: statusCount["Vencido"] || 0 }
  ];
};

const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

export const TreinamentosNormativosChart = () => {
  const data = prepareChartData();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} treinamentos`, 'Quantidade']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
