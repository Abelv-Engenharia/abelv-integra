
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from "recharts";
import { fetchDesviosByDiscipline } from "@/services/desviosDashboardService";
import { useDesviosFilters } from "@/hooks/useDesviosFilters";

const DesviosByDisciplineChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const filters = useDesviosFilters();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get CCA IDs that user has permission to
        const allowedCcaIds = filters.userCCAs.map(cca => cca.id.toString());
        const chartData = await fetchDesviosByDiscipline({
          ccaIds: allowedCcaIds,
          year: filters.year,
          month: filters.month,
          ccaId: filters.ccaId,
          disciplinaId: filters.disciplinaId,
          empresaId: filters.empresaId
        });
        setData(chartData);
      } catch (error) {
        console.error("Error loading discipline chart data:", error);
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
      color: "#3b82f6",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Desvios por Disciplina</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 40, right: 30, left: 20, bottom: 60 }}>
                <XAxis dataKey="name" angle={-90} textAnchor="end" height={60} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="value" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default DesviosByDisciplineChart;
