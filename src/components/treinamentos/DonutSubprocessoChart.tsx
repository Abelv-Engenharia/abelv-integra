
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { name: "Treinamentos Normativos Obrigatórios (NRs)", value: 36 },
  { name: "DESMAS", value: 14 },
  { name: "Procedimentos de SMS e Aulas", value: 7 },
  { name: "Formação", value: 7 },
  { name: "Integração corporativa (NRI, NR10, NRE1, NR45 etc)", value: 29 }
];

const COLORS = ["#F59E0B", "#2563EB", "#6B7280", "#FAA43A", "#60A5FA"];

export const DonutSubprocessoChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend layout="vertical" align="right" verticalAlign="middle" />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DonutSubprocessoChart;
