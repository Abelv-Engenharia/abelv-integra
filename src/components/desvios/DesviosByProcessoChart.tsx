
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { fetchDesviosByProcesso } from "@/services/desviosDashboardService";
import { useDesviosFilters } from "@/hooks/useDesviosFilters";

const COLORS = ["#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#3b82f6", "#84cc16"];

const DesviosByProcessoChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const filters = useDesviosFilters();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get CCA IDs that user has permission to
        const allowedCcaIds = filters.userCCAs.map(cca => cca.id.toString());
        const chartData = await fetchDesviosByProcesso({
          ccaIds: allowedCcaIds,
          year: filters.year,
          month: filters.month,
          ccaId: filters.ccaId,
          disciplinaId: filters.disciplinaId,
          empresaId: filters.empresaId
        });
        setData(chartData);
      } catch (error) {
        console.error("Error loading processo chart data:", error);
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
        <CardTitle>Processo</CardTitle>
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

export default DesviosByProcessoChart;
