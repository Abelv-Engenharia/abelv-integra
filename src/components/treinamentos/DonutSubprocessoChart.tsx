import React from "react";
import { PieChart, Pie, Cell, Tooltip, PieLabelRenderProps } from "recharts";

const data = [
  { name: "Treinamentos Normativos Obrigatórios (NRs)", value: 36 },
  { name: "DESMAS", value: 14 },
  { name: "Procedimentos de SMS e Aulas", value: 7 },
  { name: "Formação", value: 7 },
  { name: "Integração corporativa (NRI, NR10, NRE1, NR45 etc)", value: 29 }
];

const COLORS = ["#F59E0B", "#2563EB", "#6B7280", "#FAA43A", "#60A5FA"];

// Custom label logic igual ao do gráfico geral
const renderCustomLabel = (props: PieLabelRenderProps) => {
  const RADIAN = Math.PI / 180;
  // Coerce cx, cy, and outerRadius to numbers for safe math
  const cx = Number(props.cx);
  const cy = Number(props.cy);
  const midAngle = props.midAngle;
  const outerRadius = Number(props.outerRadius);
  const percent = props.percent;
  const name = props.name;
  const index = props.index ?? 0;

  const radius = outerRadius + 28;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const color = COLORS[index % COLORS.length];

  const label =
    String(name).length > 28 ? String(name).substring(0, 23) + "..." : String(name);

  return (
    <text
      x={x}
      y={y}
      fill={color}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize="15"
    >
      {`${label}: ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const DonutSubprocessoChart = () => {
  return (
    <div className="w-full flex items-center justify-center">
      <PieChart width={540} height={360}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="60%"
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

export default DonutSubprocessoChart;
