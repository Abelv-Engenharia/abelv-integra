
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { MOCK_EXECUCAO_TREINAMENTOS } from "@/types/treinamentos";

// Prepare data for the chart
const prepareChartData = () => {
  // Group trainings by month and year
  const monthsData = MOCK_EXECUCAO_TREINAMENTOS.reduce((acc, training) => {
    const monthYear = `${training.mes}/${training.ano}`;
    if (!acc[monthYear]) {
      acc[monthYear] = {
        name: monthYear,
        count: 0,
        hoursTotal: 0
      };
    }
    acc[monthYear].count += 1;
    acc[monthYear].hoursTotal += training.cargaHoraria;
    return acc;
  }, {} as Record<string, { name: string; count: number; hoursTotal: number }>);

  // Convert to array and sort by date
  return Object.values(monthsData).sort((a, b) => {
    const [aMonth, aYear] = a.name.split('/').map(Number);
    const [bMonth, bYear] = b.name.split('/').map(Number);
    return aYear !== bYear ? aYear - bYear : aMonth - bMonth;
  });
};

export const TreinamentosExecucaoChart = () => {
  const data = prepareChartData();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="count" name="Quantidade" fill="#8884d8" />
        <Bar yAxisId="right" dataKey="hoursTotal" name="Horas Totais" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};
