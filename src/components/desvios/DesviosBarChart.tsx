
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { fetchDesviosByMonthAndRisk } from "@/services/desviosDashboardService";

const DesviosBarChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const chartData = await fetchDesviosByMonthAndRisk();
        setData(chartData);
      } catch (error) {
        console.error("Error loading bar chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Desvios por Mês e Nível de Risco</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "white",
                  borderRadius: "0.375rem",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                  border: "1px solid rgba(229, 231, 235, 1)"
                }}
              />
              <Legend />
              <Bar dataKey="Trivial" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Tolerável" fill="#4ade80" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Moderado" fill="#facc15" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Substancial" fill="#f97316" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Intolerável" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default DesviosBarChart;
