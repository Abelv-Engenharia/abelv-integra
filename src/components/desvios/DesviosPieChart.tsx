
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// Mock data for the chart
const data = [
  { name: "Controle de Acesso", value: 25 },
  { name: "Trabalho em Altura", value: 18 },
  { name: "Espaço Confinado", value: 12 },
  { name: "Equipamentos", value: 30 },
  { name: "Ergonomia", value: 15 },
];

const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#f97316", "#ef4444"];

const DesviosPieChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Desvios por Tipo</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "white",
                borderRadius: "0.375rem",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                border: "1px solid rgba(229, 231, 235, 1)"
              }}
              formatter={(value, name) => [`${value} desvios`, name]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DesviosPieChart;
