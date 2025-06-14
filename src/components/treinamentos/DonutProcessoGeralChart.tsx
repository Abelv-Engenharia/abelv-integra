
import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useTreinamentosPorTipoProcesso } from "./useTreinamentosPorTipoProcesso";

// Definir cores fixas (ou aleatórias se tipos ultrapassarem o length)
const COLORS = ["#F59E0B", "#2563EB", "#6B7280", "#FAA43A", "#34D399", "#DB2777", "#60A5FA"];

// Custom label para mostrar tipo, percentual e total de horas
const renderCustomLabel = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, outerRadius, index, payload } = props;
  // Utilizar valores corretos do payload
  const percentual = payload?.percentual ?? 0;
  const name = payload?.name ?? "";
  const value = payload?.horasTotais ?? 0; // total horas (MOD+MOI)

  // Definir raio maior para afastar rótulo e melhorar visualização
  const radius = Number(outerRadius) + 48;
  const x = Number(cx) + radius * Math.cos(-midAngle * RADIAN);
  const y = Number(cy) + radius * Math.sin(-midAngle * RADIAN);
  const color = COLORS[index % COLORS.length];

  // Não cortar nome (permitir até 32 caracteres), cortar apenas se for longo demais
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

export const DonutProcessoGeralChart = () => {
  const { data = [], isLoading, error } = useTreinamentosPorTipoProcesso();

  // Placeholder se carregando ou erro
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
      <PieChart width={520} height={400}>
        <Pie
          data={data}
          dataKey="horasTotais"
          nameKey="name"
          cx="58%"
          cy="52%"
          innerRadius={110}
          outerRadius={142}
          paddingAngle={1.5}
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

export default DonutProcessoGeralChart;
