
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from "recharts";
import { fetchDesviosByBaseLegal } from "@/services/desviosDashboardService";
import { useDesviosFilters } from "@/hooks/useDesviosFilters";
import { useDesviosNavigation } from "@/hooks/useDesviosNavigation";

type ChartItem = {
  name: string;     // rótulo curto para eixo (ex.: "NR 10")
  fullName?: string; // nome completo para tooltip (ex.: "NR 10 - Segurança em Instalações...")
  value: number;
  color?: string;   // opcional (se seu service já retornar cor)
};

const DesviosByBaseLegalChart = () => {
  const [data, setData] = useState<ChartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Evitar depender do objeto inteiro (muda por referência a cada render)
  const { normalizedFilters, userCCAs } = useDesviosFilters();
  const { navigateToConsulta } = useDesviosNavigation();

  // Chave estável para disparar o efeito quando filtros realmente mudarem
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
        const chartData = await fetchDesviosByBaseLegal(normalizedFilters);
        // Garante array e tipagem segura
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
        console.error("Error loading base legal chart data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [normalizedKey, userCCAs?.length]);

  // Config do ChartContainer (define CSS var --color-value)
  const chartConfig = {
    value: {
      label: "Desvios",
      color: "#3b82f6",
    },
  } as const;

  // Para eixos: truncar nomes longos e evitar sobreposição
  const tickFormatter = (v: string) => {
    const s = String(v ?? "");
    return s.length > 14 ? s.slice(0, 13) + "…" : s;
  };

  const hasData = data.some(d => (Number(d.value) || 0) > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Desvios por Base Legal</CardTitle>
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
                onClick={async (data) => {
                  if (data && data.activePayload?.[0]?.payload?.name) {
                    await navigateToConsulta({ baseLegal: data.activePayload[0].payload.name });
                  }
                }}
                style={{ cursor: 'pointer' }}
               >
                <XAxis
                  dataKey="name"
                  tickFormatter={tickFormatter}
                  angle={-90}
                  textAnchor="end"
                  height={64}
                  interval={0}
                />
                <YAxis allowDecimals={false} hide={true} />
                <ChartTooltip
                  // Usa o Tooltip pronto; se preferir custom, pode manter o seu JSX
                  content={
                    <ChartTooltipContent
                      labelFormatter={(label, payload) => {
                        const item = payload?.[0]?.payload as ChartItem | undefined;
                        return item?.fullName || String(label ?? "");
                      }}
                    />
                  }
                />
                <Bar 
                  dataKey="value" 
                  fill="var(--color-value)" 
                  radius={[4, 4, 0, 0]}
                  style={{ cursor: 'pointer' }}
                >
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

export default DesviosByBaseLegalChart;
