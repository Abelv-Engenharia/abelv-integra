
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

// Mock data for the chart
const data = [
  { name: "Jan", value: 12 },
  { name: "Fev", value: 19 },
  { name: "Mar", value: 15 },
  { name: "Abr", value: 27 },
  { name: "Mai", value: 22 },
  { name: "Jun", value: 30 },
  { name: "Jul", value: 25 },
  { name: "Ago", value: 18 },
  { name: "Set", value: 24 },
  { name: "Out", value: 28 },
  { name: "Nov", value: 21 },
  { name: "Dez", value: 16 },
];

const DesviosAreaChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendência de Desvios</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} width={30} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "white",
                borderRadius: "0.375rem",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                border: "1px solid rgba(229, 231, 235, 1)"
              }} 
              formatter={(value) => [`${value} desvios`, "Total"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DesviosAreaChart;
