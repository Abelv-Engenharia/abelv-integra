
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface AreaChartProps {
  title: string;
  data: any[];
  dataKey: string;
  strokeColor?: string;
  fillColor?: string;
  height?: number;
}

const AreaChart = ({
  title,
  data,
  dataKey,
  strokeColor = "#1E40AF",
  fillColor = "#3B82F6",
  height = 300,
}: AreaChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsAreaChart
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
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={strokeColor}
              fill={fillColor}
              fillOpacity={0.2}
            />
          </RechartsAreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AreaChart;
