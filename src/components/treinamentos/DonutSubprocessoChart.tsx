
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
  const percent = props.percent;
  const name = props.name;
  const index = props.index ?? 0;

  const radius = outerRadius + 28;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const color = COLORS[index % COLORS.length];
  const label = String(name).length > 28 ? String(name).substring(0, 23) + "..." : String(name);

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

interface DonutSubprocessoChartProps {
  processoTreinamentoId: string | null;
}

export const DonutSubprocessoChart: React.FC<DonutSubprocessoChartProps> = ({
  processoTreinamentoId
}) => {
  const [data, setData] = useState<Array<{ name: string; value: number }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!processoTreinamentoId) {
      setData([]);
      return;
    }
    setLoading(true);
    fetchDonutSubprocessoData(processoTreinamentoId)
      .then(result => setData(result))
      .finally(() => setLoading(false));
  }, [processoTreinamentoId]);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center h-60">
        <span className="text-muted-foreground">Carregando...</span>
      </div>
    );
  }
  if ((!data || data.length === 0) && processoTreinamentoId) {
    return (
      <div className="w-full flex items-center justify-center h-60">
        <span className="text-muted-foreground">Não há dados para exibir.</span>
      </div>
    );
  }

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
