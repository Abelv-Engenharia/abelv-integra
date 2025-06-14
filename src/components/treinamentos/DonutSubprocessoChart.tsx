
import React from "react";
import { PieChart, Pie, Cell, Tooltip, PieLabelRenderProps } from "recharts";
import { useTreinamentosPorSubprocesso } from "./useTreinamentosPorSubprocesso";

const COLORS = ["#F59E0B", "#2563EB", "#6B7280", "#FAA43A", "#60A5FA", "#DB2777", "#34D399", "#818CF8", "#A21CAF", "#F472B6"];

const renderCustomLabel = (props: PieLabelRenderProps & { payload: any }) => {
  const RADIAN = Math.PI / 180;
  const cx = Number(props.cx);
  const cy = Number(props.cy);
  const midAngle = props.midAngle;
  const outerRadius = Number(props.outerRadius);
  const percent = props.percent; // Entre 0 e 1
  const name = props.name ?? "";
  const index = props.index ?? 0;
  const payload = props.payload;

  const horas = payload?.horasTotais ?? 0;

  // Label: nome - percentual - horas
  const radius = outerRadius + 32;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const color = COLORS[index % COLORS.length];

  const labelName = typeof name === "string" && name.length > 30 ? name.substring(0, 27) + "..." : name;

  return (
    <text
      x={x}
      y={y}
      fill={color}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize="15"
    >
      {`${labelName}: ${(payload.percentual ?? percent*100).toFixed(1)}% (${horas}h)`}
    </text>
  );
};

interface DonutSubprocessoChartProps {
  processoId: string;
}

export const DonutSubprocessoChart = ({ processoId }: DonutSubprocessoChartProps) => {
  const { data = [], isLoading, error } = useTreinamentosPorSubprocesso(processoId);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center h-80">
        <span className="text-muted-foreground">Carregando...</span>
      </div>
    );
  }
  if (error || data.length === 0) {
    return (
      <div className="w-full flex items-center justify-center h-80">
        <span className="text-muted-foreground">Nenhum dado de subprocesso encontrado para o processo selecionado.</span>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center">
      <PieChart width={460} height={330}>
        <Pie
          data={data}
          dataKey="horasTotais"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={72}
          outerRadius={104}
          paddingAngle={1.8}
          label={renderCustomLabel}
          labelLine={true}
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: any, _: string, props: any) => `${value} horas`}
          contentStyle={{ fontSize: 15 }}
        />
      </PieChart>
    </div>
  );
};

export default DonutSubprocessoChart;
