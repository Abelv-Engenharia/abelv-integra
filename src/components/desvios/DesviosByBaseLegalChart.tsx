
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { fetchDesviosByBaseLegal } from "@/services/desviosDashboardService";
import { useUserCCAs } from "@/hooks/useUserCCAs";

const DesviosByBaseLegalChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: userCCAs = [] } = useUserCCAs();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get CCA IDs that user has permission to
        const allowedCcaIds = userCCAs.map(cca => cca.id.toString());
        const chartData = await fetchDesviosByBaseLegal(allowedCcaIds);
        setData(chartData);
      } catch (error) {
        console.error("Error loading base legal chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userCCAs.length > 0) {
      fetchData();
    }
  }, [userCCAs]);

  const chartConfig = {
    value: {
      label: "Desvios",
      color: "#3b82f6",
    },
  };

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
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-medium">{data.fullName}</p>
                          <p className="text-primary">
                            Desvios: <span className="font-bold">{payload[0].value}</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }} 
                />
                <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default DesviosByBaseLegalChart;
