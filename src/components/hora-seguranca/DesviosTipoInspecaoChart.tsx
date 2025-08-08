
import React, { useEffect, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { fetchDesviosByInspectionType } from "@/services/hora-seguranca/desviosInspectionService";
import { useUserCCAs } from "@/hooks/useUserCCAs";

interface Filters {
  ccaId?: number;
  responsavel?: string;
  dataInicial?: string;
  dataFinal?: string;
}

interface DesviosTipoInspecaoChartProps {
  filters?: Filters;
}

export const DesviosTipoInspecaoChart = ({ filters }: DesviosTipoInspecaoChartProps) => {
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
        const chartData = await fetchDesviosByInspectionType(ccaIds, filters);
        setData(chartData);
      } catch (error) {
        console.error("Error loading desvios by inspection type chart:", error);
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
          <XAxis dataKey="tipo" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="desvios" fill="#f97316" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
