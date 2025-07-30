
import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { supabase } from '@/integrations/supabase/client';
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { fetchOcorrenciasByEmpresa } from "@/services/ocorrencias/ocorrenciasByEmpresaService";

const OcorrenciasByEmpresaChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: userCCAs = [] } = useUserCCAs();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('Carregando dados por empresa...');
        
        // Get CCA IDs that user has permission to
        const allowedCcaIds = userCCAs.map(cca => cca.id);
        const chartData = await fetchOcorrenciasByEmpresa(allowedCcaIds);

        console.log('Dados do gráfico por empresa (filtrado):', chartData);
        setData(chartData);
      } catch (err) {
        console.error("Error loading ocorrencias by empresa:", err);
        setError("Erro ao carregar dados por empresa");
      } finally {
        setLoading(false);
      }
    };

    // Só carrega se já temos dados dos CCAs
    if (userCCAs.length >= 0) {
      loadData();
    }
  }, [userCCAs]);

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
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
        <BarChart
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
            dataKey="name" 
            tick={{ fontSize: 11 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            formatter={(value) => [`${value} ocorrências`, 'Quantidade']} 
          />
          <Legend />
          <Bar dataKey="value" name="Ocorrências" fill="#9b87f5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OcorrenciasByEmpresaChart;
