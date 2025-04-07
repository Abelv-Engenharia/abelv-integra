
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";

// Mock data for the chart
const data = [
  { name: "Trivial", value: 25, color: "#4ade80" },
  { name: "Tolerável", value: 40, color: "#60a5fa" },
  { name: "Moderado", value: 50, color: "#facc15" },
  { name: "Substancial", value: 20, color: "#f97316" },
  { name: "Intolerável", value: 8, color: "#ef4444" },
];

const DesviosByRisk = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Desvios por Nível de Risco</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            layout="vertical"
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 70,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={true} vertical={false} />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "white",
                borderRadius: "0.375rem",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                border: "1px solid rgba(229, 231, 235, 1)"
              }}
              formatter={(value) => [`${value} desvios`, "Quantidade"]}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DesviosByRisk;
