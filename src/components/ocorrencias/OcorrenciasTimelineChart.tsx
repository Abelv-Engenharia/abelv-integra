
import { useState, useEffect } from "react";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fetchOcorrenciasTimeline } from "@/services/ocorrenciasDashboardService";

const OcorrenciasTimelineChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const timelineData = await fetchOcorrenciasTimeline();
        setData(timelineData);
      } catch (err) {
        console.error("Error loading timeline data:", err);
        setError("Erro ao carregar dados de timeline");
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
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            tickFormatter={(value) => {
              const [year, month] = value.split('-');
              return `${month}/${year.slice(2)}`;
            }}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(value) => {
              const [year, month] = value.toString().split('-');
              const monthNames = [
                'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
              ];
              return `${monthNames[parseInt(month) - 1]}/${year}`;
            }}
            formatter={(value) => [`${value} ocorrências`, 'Quantidade']}
          />
          <Line 
            type="monotone" 
            dataKey="ocorrencias" 
            stroke="#9b87f5" 
            strokeWidth={2}
            dot={{ fill: '#9b87f5', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#9b87f5', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OcorrenciasTimelineChart;
