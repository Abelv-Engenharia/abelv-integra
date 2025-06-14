import React from "react";
import { PieChart, Pie, Cell, Tooltip, PieLabelRenderProps } from "recharts";

// Dados mantidos
const data = [
  { name: "Admissão - Formação", value: 66 },
  { name: "Reciclagem", value: 18 },
  { name: "Transferência - Mobilização", value: 14 },
  { name: "Formação", value: 4 }
];

const COLORS = ["#F59E0B", "#2563EB", "#6B7280", "#FAA43A"];

// Função para rótulo customizado, posicionando fora do arco
const renderCustomLabel = (props: PieLabelRenderProps) => {
  const RADIAN = Math.PI / 180;
  // Coerce cx, cy, and outerRadius to numbers for proper math
  const cx = Number(props.cx);
  const cy = Number(props.cy);
  const midAngle = props.midAngle;
  const outerRadius = Number(props.outerRadius);
  const percent = props.percent;
  const name = props.name;
  const index = props.index ?? 0;

  const radius = outerRadius + 24;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const color = COLORS[index % COLORS.length];

  // Exibir o nome completo, mas corta se for excesso
  const label =
    String(name).length > 22 ? String(name).substring(0, 18) + "..." : String(name);

  return (
    <text
      x={x}
      y={y}
      fill={color}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize="16"
      fontWeight={index === 0 ? "bold" : "normal"}
    >
      {index === 0
        ? `- ${name}: ${(percent * 100).toFixed(0)}%`
        : `${label}: ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const DonutProcessoGeralChart = () => {
  return (
    <div className="w-full flex items-center justify-center">
      <PieChart width={540} height={360}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="58%"
          cy="50%"
          innerRadius={92}
          outerRadius={132}
          paddingAngle={2}
          label={renderCustomLabel}
          labelLine={true}
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
};

export default DonutProcessoGeralChart;
