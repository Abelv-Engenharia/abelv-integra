import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { fetchMedidasPorTipoCCA } from "@/services/medidasDisciplinares/chartService";

interface MedidasBarChartProps {
  ccaIds: number[];
}

export function MedidasBarChart({ ccaIds }: MedidasBarChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (ccaIds.length === 0) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      const result = await fetchMedidasPorTipoCCA(ccaIds);
      
      // Transformar dados para o formato do gráfico de barras
      const tiposUnicos = [...new Set(result.map(item => item.tipo))];
      const ccasUnicos = [...new Set(result.map(item => item.cca_codigo))].sort();
      
      const chartData = tiposUnicos.map(tipo => {
        const item: any = { tipo };
        ccasUnicos.forEach(cca => {
          const found = result.find(r => r.tipo === tipo && r.cca_codigo === cca);
          item[cca] = found ? found.count : 0;
        });
        return item;
      });
      
      setData(chartData);
      setLoading(false);
    };

    loadData();
  }, [ccaIds]);

  const chartConfig = {
    medidas: {
      label: "Medidas",
    },
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tipos de Medidas por CCA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tipos de Medidas por CCA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Nenhum dado disponível</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Pegar todos os CCAs para criar as barras
  const ccas = Object.keys(data[0] || {}).filter(key => key !== 'tipo');
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#8dd1e1"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tipos de Medidas por CCA</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tipo" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              {ccas.map((cca, index) => (
                <Bar key={cca} dataKey={cca} fill={colors[index % colors.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
