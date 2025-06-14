
import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

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
    <div className="w-full h-full flex items-center justify-center">
      <PieChart width={390} height={390}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={140}
          paddingAngle={2}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          labelLine={true}
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        {/* Legenda removida */}
      </PieChart>
    </div>
  );
};

export default DonutSubprocessoChart;
