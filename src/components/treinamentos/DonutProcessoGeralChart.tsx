
import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const data = [
  { name: "Admissão - Formação", value: 66 },
  { name: "Reciclagem", value: 18 },
  { name: "Transferência - Mobilização", value: 14 },
  { name: "Formação", value: 4 }
];

const COLORS = ["#F59E0B", "#2563EB", "#6B7280", "#FAA43A"];

export const DonutProcessoGeralChart = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <PieChart width={300} height={300}>
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
        {/* Legenda removida */}
      </PieChart>
    </div>
  );
};

export default DonutProcessoGeralChart;
