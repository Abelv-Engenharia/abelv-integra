
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useTreinamentosPorTipoProcesso } from "./useTreinamentosPorTipoProcesso";

const COLORS = ["#F59E0B", "#2563EB", "#6B7280", "#FAA43A", "#34D399", "#DB2777", "#60A5FA"];

export const ProcessoGeralPieChart = () => {
  const { data = [], isLoading, error } = useTreinamentosPorTipoProcesso();

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center h-full">
        <span className="text-muted-foreground">Carregando...</span>
      </div>
    );
  }
  if (error || data.length === 0) {
    return (
      <div className="w-full flex items-center justify-center h-full">
        <span className="text-red-600">Não há dados para exibir.</span>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="horasTotais"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: any, name: string, props: any) => [`${Number(value).toFixed(1)} horas`, `Percentual: ${props.payload.percentual.toFixed(1)}%`]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ProcessoGeralPieChart;
