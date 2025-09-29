import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { fetchMedidasPorTipo, MedidasPorTipo } from "@/services/medidasDisciplinares/chartService";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface MedidasPieChartProps {
  ccaIds: number[];
}

export function MedidasPieChart({ ccaIds }: MedidasPieChartProps) {
  const [data, setData] = useState<MedidasPorTipo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (ccaIds.length === 0) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      const result = await fetchMedidasPorTipo(ccaIds);
      setData(result);
      setLoading(false);
    };

    loadData();
  }, [ccaIds]);

  const chartConfig = {
    count: {
      label: "Quantidade",
    },
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tipos de Medidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tipos de Medidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Nenhum dado disponível</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tipos de Medidas</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ tipo, percent }) => `${tipo}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
