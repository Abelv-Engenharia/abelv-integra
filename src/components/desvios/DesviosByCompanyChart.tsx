
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from "recharts";
import { fetchDesviosByCompany } from "@/services/desviosDashboardService";
import { useDesviosFilters } from "@/hooks/useDesviosFilters";

const DesviosByCompanyChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const filters = useDesviosFilters();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const chartData = await fetchDesviosByCompany(filters.normalizedFilters);
        setData(chartData);
      } catch (error) {
        console.error("Error loading company chart data:", error);
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
        <CardTitle>Desvios & OM por Empresa</CardTitle>
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

export default DesviosByCompanyChart;
