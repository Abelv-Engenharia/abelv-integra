
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "TRIVIAL", value: 12, color: "#34C6F4" },
  { name: "TOLERÁVEL", value: 20, color: "#92D050" },
  { name: "MODERADO", value: 16, color: "#FFE07D" },
  { name: "SUBSTANCIAL", value: 8, color: "#FFC000" },
  { name: "INTOLERÁVEL", value: 4, color: "#D13F3F" }
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
