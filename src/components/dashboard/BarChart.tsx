
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface BarChartProps {
  title: string;
  data: any[];
  categories: {
    dataKey: string;
    name: string;
    color: string;
  }[];
  height?: number;
}

const BarChart = ({
  title,
  data,
  categories,
  height = 300,
}: BarChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart
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
            />
            <Legend />
            {categories.map((category, index) => (
              <Bar 
                key={index} 
                dataKey={category.dataKey} 
                name={category.name} 
                fill={category.color} 
                radius={[4, 4, 0, 0]}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BarChart;
