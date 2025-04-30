
import { useState, useEffect } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { fetchOcorrenciasByRisco } from "@/services/ocorrenciasDashboardService";

const colorMap: Record<string, string> = {
  "TRIVIAL": "#34C6F4",
  "TOLERÁVEL": "#92D050",
  "MODERADO": "#FFE07D",
  "SUBSTANCIAL": "#FFC000",
  "INTOLERÁVEL": "#D13F3F"
};

const OcorrenciasByRiscoChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const chartData = await fetchOcorrenciasByRisco();
        
        // Add colors to each data item
        const dataWithColors = chartData.map(item => ({
          ...item,
          color: colorMap[item.name] || "#9ca3af" // Default gray color if no matching color
        }));
        
        setData(dataWithColors);
      } catch (err) {
        console.error("Error loading ocorrencias by risco:", err);
        setError("Erro ao carregar dados por classificação de risco");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">Carregando dados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">Nenhum dado disponível</p>
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={300}>
          <Pie
            dataKey="value"
            isAnimationActive={true}
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={(entry) => `${entry.name}: ${entry.value}`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} ocorrências`, 'Quantidade']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OcorrenciasByRiscoChart;
