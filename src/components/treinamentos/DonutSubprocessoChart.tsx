
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, PieLabelRenderProps } from "recharts";
import { fetchDonutSubprocessoData } from "@/services/treinamentos/treinamentosSubprocessoService";

const COLORS = ["#F59E0B", "#2563EB", "#6B7280", "#FAA43A", "#60A5FA"];

const renderCustomLabel = (props: PieLabelRenderProps) => {
  const RADIAN = Math.PI / 180;
  const cx = Number(props.cx);
  const cy = Number(props.cy);
  const midAngle = props.midAngle;
  const outerRadius = Number(props.outerRadius);
  const percent = (props as any).percent ?? 0;
  const name = props.name ?? "";
  const value = props.value ?? 0;

  // Posicionamento para fora do donut
  const radius = outerRadius + 42;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const labelText = `${name}; ${value}; ${(percent * 100).toFixed(0)}%`;

  return (
    <text
      x={x}
      y={y}
      fill="#444"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize="17"
      fontWeight="bold"
      style={{ fontFamily: "inherit" }}
    >
      {labelText}
    </text>
  );
};

// Remover obrigatoriedade do id
export const DonutSubprocessoChart: React.FC = () => {
  const [data, setData] = useState<Array<{ name: string; value: number; percent: number }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchDonutSubprocessoData(null)
      .then(result => setData(result))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center h-60">
        <span className="text-muted-foreground">Carregando...</span>
      </div>
    );
  }
  if (!data || data.length === 0) {
    return (
      <div className="w-full flex items-center justify-center h-60">
        <span className="text-muted-foreground">Não há dados para exibir.</span>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center">
      <PieChart width={820} height={440}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={116}
          outerRadius={166}
          paddingAngle={2}
          label={renderCustomLabel}
          labelLine={true}
          isAnimationActive={false}
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props) =>
            [`${value} horas`, data[props?.payload?.index]?.name]
          }
        />
      </PieChart>
    </div>
  );
};

export default DonutSubprocessoChart;
