
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from "recharts";
import { fetchDesviosByCompany } from "@/services/desviosDashboardService";
import { useDesviosFilters } from "@/hooks/useDesviosFilters";

type ChartItem = {
  name: string;       // rótulo curto (ex.: sigla da empresa)
  fullName?: string;  // nome completo p/ tooltip
  value: number;      // total de desvios
  om?: number;        // total de OM (opcional)
  color?: string;     // cor opcional (não usada quando 2 séries)
};

const DesviosByCompanyChart = () => {
  const [data, setData] = useState<ChartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
            om: d.omValue !== undefined ? Number(d.omValue) : (d.om !== undefined ? Number(d.om) : undefined),
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

  // Se o service trouxer OM, plota duas séries
  const hasOM = data.some(d => typeof d.om === "number");

  // Define as variáveis de cor para o ChartContainer
  const chartConfig = hasOM
    ? ({
        desvios: { label: "Desvios", color: "#3b82f6" },
        om: { label: "OM", color: "#10b981" },
      } as const)
    : ({
        value: { label: "Desvios", color: "#3b82f6" },
      } as const);

  const hasData =
    data.some(d => (Number(d.value) || 0) > 0) ||
    (hasOM && data.some(d => (Number(d.om) || 0) > 0));

  // Trunca ticks longos do eixo X para evitar sobreposição
  const tickFormatter = (v: string) => {
    const s = String(v ?? "");
    return s.length > 14 ? s.slice(0, 13) + "…" : s;
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
              <BarChart data={data} margin={{ top: 24, right: 16, left: 8, bottom: 64 }}>
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

                {/* Série de Desvios */}
                <Bar
                  dataKey={hasOM ? "value" : "value"}
                  name="Desvios"
                  fill={hasOM ? "var(--color-desvios)" : "var(--color-value)"}
                  radius={[4, 4, 0, 0]}
                >
                  <LabelList dataKey="value" position="top" />
                </Bar>

                {/* Série de OM (opcional) */}
                {hasOM && (
                  <Bar
                    dataKey="om"
                    name="OM"
                    fill="var(--color-om)"
                    radius={[4, 4, 0, 0]}
                  >
                    <LabelList dataKey="om" position="top" />
                  </Bar>
                )}
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default DesviosByCompanyChart;
