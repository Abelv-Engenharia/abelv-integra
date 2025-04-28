
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Alto", value: 12, color: "#ef4444" }, // Red
  { name: "Médio", value: 20, color: "#f59e0b" }, // Amber
  { name: "Baixo", value: 16, color: "#22c55e" }, // Green
  { name: "Crítico", value: 4, color: "#991b1b" }  // Dark red
];

const OcorrenciasByRiscoChart = () => {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={300}>
          <Pie
            dataKey="value"
            isAnimationActive={true}
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={(entry) => `${entry.name}: ${entry.value}`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} ocorrências`, 'Quantidade']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OcorrenciasByRiscoChart;
