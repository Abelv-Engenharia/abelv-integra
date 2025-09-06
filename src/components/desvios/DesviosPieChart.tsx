
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { fetchDesviosByType } from "@/services/desvios/desviosByTypeService";
import { useDesviosFilters } from "@/hooks/useDesviosFilters";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const DesviosPieChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const filters = useDesviosFilters();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('🍰 PieChart - Buscando dados com filtros:', filters.normalizedFilters);
        const chartData = await fetchDesviosByType(filters.normalizedFilters);
        console.log('🍰 PieChart - Dados recebidos:', chartData);
        setData(chartData);
      } catch (error) {
        console.error("Error loading pie chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (filters.userCCAs.length > 0) {
      fetchData();
    }
  }, [filters]);

  const chartConfig = {
    value: {
      label: "Desvios",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Desvios e Oportunidades de Melhoria</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
        )}
      </CardContent>
    </Card>
  );
};

export default DesviosPieChart;
