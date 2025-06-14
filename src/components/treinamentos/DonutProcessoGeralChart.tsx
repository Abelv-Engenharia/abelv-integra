import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useFilteredTreinamentosPorProcesso } from "@/services/treinamentos/hooks/useFilteredTreinamentosPorProcesso";
import { useEffect } from "react";

// Definir cores fixas (ou aleatórias se tipos ultrapassarem o length)
const COLORS = ["#F59E0B", "#2563EB", "#6B7280", "#FAA43A", "#34D399", "#DB2777", "#60A5FA"];

// Custom label para mostrar tipo, percentual e total de horas
const renderCustomLabel = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, outerRadius, index, payload } = props;
  const percentual = payload?.percentual ?? 0;
  const name = props.payload?.processo ?? "";
  const value = payload?.horasTotais ?? 0;

  // Ajustar: Aproximar o rótulo do donut para não cortar
  const radius = Number(outerRadius) + 30;
  const x = Number(cx) + radius * Math.cos(-midAngle * RADIAN);
  const y = Number(cy) + radius * Math.sin(-midAngle * RADIAN);
  const color = COLORS[index % COLORS.length];

  const maxLen = 32;
  const labelName = name.length > maxLen ? name.substring(0, maxLen - 3) + "..." : name;

  return (
    <text
      x={x}
      y={y}
      fill={color}
      textAnchor={x > Number(cx) ? "start" : "end"}
      dominantBaseline="central"
      fontSize="15"
      fontWeight="bold"
      style={{
        textShadow: "1px 1px 2px #fff",
        userSelect: "none"
      }}
    >
      {`${labelName}: ${percentual.toFixed(1)}% (${value}h)`}
    </text>
  );
};

export const DonutProcessoGeralChart = ({ year, month, ccaId }: { year:string, month:string, ccaId:string }) => {
  const { data = [], isLoading, error } = useFilteredTreinamentosPorProcesso({ year, month, ccaId });

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
        <span className="text-red-600">Não há dados para exibir.</span>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center">
      <PieChart width={420} height={310}>
        <Pie
          data={data}
          dataKey="horasMOD"
          nameKey="processo"
          cx="50%"
          cy="50%"
          innerRadius={90}
          outerRadius={118}
          paddingAngle={1.2}
          label={renderCustomLabel}
          labelLine={true}
        >
          {data.map((entry, index) => (
            <Cell key={entry.processo} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: any) => `${value} horas`}
          contentStyle={{ fontSize: 15 }}
        />
      </PieChart>
    </div>
  );
};

export default DonutProcessoGeralChart;
