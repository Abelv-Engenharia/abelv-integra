
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export const TreinamentosNormativosChart = ({ data = [], isLoading = false }: { data?: any[]; isLoading?: boolean }) => {
  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Carregando dados...</p>
      </div>
    );
  }
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
        <Tooltip 
          formatter={(value) => [`${value} treinamentos`, 'Quantidade']}
          contentStyle={{ 
            backgroundColor: "white",
            borderRadius: "0.375rem",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            border: "1px solid rgba(229, 231, 235, 1)"
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
