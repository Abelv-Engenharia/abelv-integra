
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { fetchDesviosByProcesso } from "@/services/desviosDashboardService";
import { useDesviosFilters } from "@/hooks/useDesviosFilters";
import { useDesviosNavigation } from "@/hooks/useDesviosNavigation";

type ChartItem = { name: string; value: number; color?: string };

const COLORS = ["#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#3b82f6", "#84cc16"];

const DesviosByProcessoChart = () => {
  const [data, setData] = useState<ChartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Evite depender do objeto inteiro "filters" (muda por referência a cada render).
  const { normalizedFilters, userCCAs } = useDesviosFilters();
  const { navigateToConsulta } = useDesviosNavigation();

  // String estável para dependência do useEffect
  const normalizedKey = useMemo(() => JSON.stringify(normalizedFilters ?? {}), [normalizedFilters]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // só busca se houver pelo menos 1 CCA permitido
        if (!userCCAs || userCCAs.length === 0) {
          setData([]);
          return;
        }
        const chartData = await fetchDesviosByProcesso(normalizedFilters);
        setData(Array.isArray(chartData) ? chartData : []);
      } catch (error) {
        console.error("Error loading processo chart data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Dependemos apenas de uma chave estável e do tamanho da lista de CCAs
  }, [normalizedKey, userCCAs?.length]);

  const chartConfig = {
    value: { label: "Desvios" },
  };

  // Total para proteger labels quando o total é 0 (evita NaN%)
  const total = useMemo(() => data.reduce((acc, d) => acc + (Number(d.value) || 0), 0), [data]);

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
        ) : total === 0 ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">Sem dados para os filtros selecionados.</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart
                 onClick={async (data) => {
                   if (data && data.activePayload?.[0]?.payload?.name) {
                     await navigateToConsulta({ processo: data.activePayload[0].payload.name });
                   }
                 }}
                 style={{ cursor: 'pointer' }}
               >
                 <Pie
                   data={data}
                   cx="50%"
                   cy="50%"
                   outerRadius={80}
                   dataKey="value"
                   // evita NaN% quando total é 0
                   label={({ name, value }) => {
                     const pct = total > 0 ? Math.round((Number(value) * 100) / total) : 0;
                     return `${name} ${pct}%`;
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

export default DesviosByProcessoChart;
