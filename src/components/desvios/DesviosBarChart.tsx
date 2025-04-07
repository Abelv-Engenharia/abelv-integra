
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// Mock data for the chart
const data = [
  { name: "Jan", Trivial: 5, Tolerável: 8, Moderado: 10, Substancial: 3, Intolerável: 1 },
  { name: "Fev", Trivial: 4, Tolerável: 7, Moderado: 9, Substancial: 4, Intolerável: 0 },
  { name: "Mar", Trivial: 6, Tolerável: 10, Moderado: 12, Substancial: 2, Intolerável: 1 },
  { name: "Abr", Trivial: 7, Tolerável: 8, Moderado: 11, Substancial: 3, Intolerável: 2 },
  { name: "Mai", Trivial: 3, Tolerável: 9, Moderado: 8, Substancial: 5, Intolerável: 0 },
  { name: "Jun", Trivial: 8, Tolerável: 12, Moderado: 9, Substancial: 2, Intolerável: 1 },
];

const DesviosBarChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Desvios por Mês e Nível de Risco</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "white",
                borderRadius: "0.375rem",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                border: "1px solid rgba(229, 231, 235, 1)"
              }}
            />
            <Legend />
            <Bar dataKey="Trivial" fill="#4ade80" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Tolerável" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Moderado" fill="#facc15" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Substancial" fill="#f97316" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Intolerável" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DesviosBarChart;
