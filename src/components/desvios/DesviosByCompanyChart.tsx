
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from "recharts";
import { fetchDesviosByCompany } from "@/services/desviosDashboardService";
import { useDesviosFilters } from "@/hooks/useDesviosFilters";

type ChartItem = {
  name: string;       // rótulo curto (ex.: sigla da empresa)
  fullName?: string;  // nome completo p/ tooltip
  value: number;      // total de desvios/OM
  color?: string;     // opcional, caso o service retorne
};

const DesviosByCompanyChart = () => {
  const [data, setData] = useState<ChartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Evite depender do objeto inteiro "filters" (muda a cada render)
  const { normalizedFilters, userCCAs } = useDesviosFilters();
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
        const chartData = await fetchDesviosByCompany(normalizedFilters);
        const arr = Array.isArray(chartData) ? chartData : [];
        setData(
          arr.map((d: any) => ({
            name: String(d.name ?? "").trim(),
            fullName: d.fullName ? String(d.fullName) : String(d.name ?? "").trim(),
            value: Number(d.value ?? 0),
            color: d.color,
          }))
        );
      } catch (error) {
        console.error("Error loading company chart data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [normalizedKey, userCCAs?.length]);

  const chartConfig = {
    value: { label: "Desvios", color: "#3b82f6" },
  } as const;

  const hasData = data.some(d => (Number(d.value) || 0) > 0);

  // Trunca ticks longos do eixo X para evitar sobreposição
  const tickFormatter = (v: string) => {
    const s = String(v ?? "");
    return s.length > 14 ? s.slice(0, 13) + "…" : s;
    // se preferir -90°, troque angle abaixo
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
        ) : !hasData ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">Sem dados para os filtros selecionados.</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 24, right: 16, left: 8, bottom: 64 }}
              >
                <XAxis
                  dataKey="name"
                  tickFormatter={tickFormatter}
                  angle={-45}
                  textAnchor="end"
                  height={64}
                  interval={0}
                />
                <YAxis allowDecimals={false} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(label, payload) => {
                        const item = payload?.[0]?.payload as ChartItem | undefined;
                        return item?.fullName || String(label ?? "");
                      }}
                    />
                  }
                />
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
