
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList } from "recharts";
import { fetchDesviosByRiskLevel } from "@/services/desvios/desviosByRiskLevelService";
import { useDesviosFilters } from "@/hooks/useDesviosFilters";

type ChartItem = { name: string; value: number; color?: string };

// Fallback de cores por nível (UPPERCASE, sem depender de acentos)
const RISK_COLORS: Record<string, string> = {
  TRIVIAL: "#4ade80",
  TOLERAVEL: "#60a5fa",
  TOLERÁVEL: "#60a5fa",
  MODERADO: "#facc15",
  SUBSTANCIAL: "#f97316",
  INTOLERAVEL: "#ef4444",
  INTOLERÁVEL: "#ef4444",
};

const DesviosByRisk = () => {
  const [data, setData] = useState<ChartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filtros normalizados (year, month, ccaIds, etc.)
  const { normalizedFilters, userCCAs } = useDesviosFilters();

  // Chave estável para dependência do useEffect
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

        // Agora o service recebe os filtros normalizados
        const chartData = await fetchDesviosByRiskLevel(normalizedFilters);

        const arr = Array.isArray(chartData) ? chartData : [];
        setData(
          arr.map((d: any) => {
            const name = String(d.name ?? "").trim();
            const key = name.toUpperCase();
            return {
              name,
              value: Number(d.value ?? 0),
              color: d.color ?? RISK_COLORS[key] ?? "#94a3b8",
            };
          })
        );
      } catch (error) {
        console.error("Error loading risk chart data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [normalizedKey, userCCAs?.length]);

  const hasData = data.some(d => (Number(d.value) || 0) > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Desvios por Nível de Risco</CardTitle>
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
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 20, right: 24, left: 72, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal vertical={false} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={140} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "0.375rem",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                  border: "1px solid rgba(229, 231, 235, 1)",
                }}
                formatter={(value) => [`${value} desvios`, "Quantidade"]}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color!} />
                ))}
                <LabelList dataKey="value" position="right" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default DesviosByRisk;
