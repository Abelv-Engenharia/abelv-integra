
import React, { useEffect, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { fetchInspecoesByCCA } from "@/services/hora-seguranca/inspecoesByCCAService";
import { useUserCCAs } from "@/hooks/useUserCCAs";

interface Filters {
  ccaId?: number;
  responsavel?: string;
  dataInicial?: string;
  dataFinal?: string;
}

interface InspecoesByCCAChartProps {
  filters?: Filters;
}

export const InspecoesByCCAChart = ({ filters }: InspecoesByCCAChartProps) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: userCCAs = [] } = useUserCCAs();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        if (userCCAs.length === 0) {
          setData([]);
          setLoading(false);
          return;
        }

        const ccaIds = userCCAs.map(cca => cca.id);
        const chartData = await fetchInspecoesByCCA(ccaIds, filters);
        setData(chartData);
      } catch (error) {
        console.error("Error loading inspeções by CCA chart:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userCCAs, filters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-muted-foreground">Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="cca" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="A Realizar" stackId="a" fill="#4285F4" />
          <Bar dataKey="Realizada" stackId="a" fill="#34A853" />
          <Bar dataKey="Não Realizada" stackId="a" fill="#EA4335" />
          <Bar dataKey="Realizada (Não Programada)" stackId="a" fill="#FBBC05" />
          <Bar dataKey="Cancelada" stackId="a" fill="#9E9E9E" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
