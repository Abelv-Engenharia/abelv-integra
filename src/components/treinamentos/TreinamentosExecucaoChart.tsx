
import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { fetchTreinamentosExecucaoData } from "@/services/treinamentosDashboardService";
import { useUserCCAs } from "@/hooks/useUserCCAs";

export const TreinamentosExecucaoChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: userCCAs = [] } = useUserCCAs();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userCCAIds = userCCAs.map(cca => cca.id);
        const chartData = await fetchTreinamentosExecucaoData();
        setData(chartData);
      } catch (error) {
        console.error("Error loading training execution data:", error);
        setError("Erro ao carregar dados de execução de treinamentos");
      } finally {
        setLoading(false);
      }
    };

    if (userCCAs.length > 0) {
      fetchData();
    } else {
      setData([]);
      setLoading(false);
    }
  }, [userCCAs]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Carregando dados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // If no data is available
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Nenhum dado disponível para exibição</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "white",
            borderRadius: "0.375rem",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            border: "1px solid rgba(229, 231, 235, 1)"
          }} 
        />
        <Legend />
        <Bar yAxisId="left" dataKey="count" name="Quantidade" fill="#8884d8" />
        <Bar yAxisId="right" dataKey="hoursTotal" name="Horas Totais" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};
