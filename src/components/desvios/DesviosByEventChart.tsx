
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { fetchDesviosByEvent } from "@/services/desviosDashboardService";
import { useDesviosFilters } from "@/hooks/useDesviosFilters";
import { useDesviosNavigation } from "@/hooks/useDesviosNavigation";

type ChartItem = { name: string; value: number; color?: string };

const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#06b6d4", "#84cc16"];

const DesviosByEventChart = () => {
  const [data, setData] = useState<ChartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { normalizedFilters, userCCAs } = useDesviosFilters();
  const { navigateToConsulta } = useDesviosNavigation();
  const normalizedKey = useMemo(
    () => JSON.stringify(normalizedFilters ?? {}),
    [normalizedFilters]
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!userCCAs || userCCAs.length === 0) {
          setData([]);
          return;
        }
        const chartData = await fetchDesviosByEvent(normalizedFilters);
        const arr = Array.isArray(chartData) ? chartData : [];
        setData(
          arr.map((d: any) => ({
            name: String(d.name ?? "").trim(),
            value: Number(d.value ?? 0),
            color: d.color,
          }))
        );
      } catch (error) {
        console.error("Error loading event chart data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [normalizedKey, userCCAs?.length]);

  const chartConfig = {
    value: { label: "Desvios" },
  } as const;

  const total = useMemo(
    () => data.reduce((acc, d) => acc + (Number(d.value) || 0), 0),
    [data]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evento Identificado</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        ) : total === 0 ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">Sem dados para os filtros selecionados.</p>
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
                  // Evita NaN% quando total é 0
                  label={({ name, value }) => {
                    const pct = total > 0 ? Math.round((Number(value) * 100) / total) : 0;
                    return `${name} ${pct}%`;
                  }}
                  onClick={(data) => {
                    if (data && data.name) {
                      navigateToConsulta({ evento: data.name });
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color ?? COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default DesviosByEventChart;
