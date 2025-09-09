
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from "recharts";
import { fetchDesviosByClassification } from "@/services/desvios/desviosByClassificationService";
import { useDesviosFilters } from "@/hooks/useDesviosFilters";
import { useDesviosNavigation } from "@/hooks/useDesviosNavigation";

const DesviosClassificationChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const { normalizedFilters, userCCAs } = useDesviosFilters();
  const { navigateToConsulta } = useDesviosNavigation();

  // chave estável p/ disparar o efeito somente quando os valores de fato mudarem
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
        console.log('📊 ClassificationChart - Buscando dados com filtros:', normalizedFilters);
        const chartData = await fetchDesviosByClassification(normalizedFilters);
        console.log('📊 ClassificationChart - Dados recebidos:', chartData);
        setData(chartData || []);
      } catch (error) {
        console.error("Error loading classification chart data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [normalizedKey, userCCAs?.length]);

  const chartConfig = {
    value: {
      label: "Desvios",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Classificação de Risco</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 40, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="value" 
                  radius={[4, 4, 0, 0]}
                  onClick={async (data) => {
                    if (data && data.name) {
                      await navigateToConsulta({ classificacao: data.name });
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <LabelList dataKey="value" position="top" />
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default DesviosClassificationChart;
