
import { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fetchOcorrenciasTimeline } from "@/services/ocorrenciasDashboardService";

const OcorrenciasTimelineChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const chartData = await fetchOcorrenciasTimeline();
        setData(chartData);
      } catch (err) {
        console.error("Error loading ocorrencias timeline:", err);
        setError("Erro ao carregar dados da linha do tempo");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">Carregando dados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">Nenhum dado disponível</p>
      </div>
    );
  }

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="Acidente com Afastamento" 
            name="Com Afastamento" 
            stackId="1" 
            stroke="#ef4444" 
            fill="#ef4444" 
            fillOpacity={0.6}
          />
          <Area 
            type="monotone" 
            dataKey="Acidente sem Afastamento" 
            name="Sem Afastamento" 
            stackId="1" 
            stroke="#f59e0b" 
            fill="#f59e0b" 
            fillOpacity={0.6}
          />
          <Area 
            type="monotone" 
            dataKey="Quase Acidente" 
            name="Quase Acidente" 
            stackId="1" 
            stroke="#3b82f6" 
            fill="#3b82f6" 
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OcorrenciasTimelineChart;
