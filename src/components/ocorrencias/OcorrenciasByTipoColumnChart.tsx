
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { fetchOcorrenciasByTipo } from "@/services/ocorrencias/ocorrenciasByTipoService";
import { useUserCCAs } from "@/hooks/useUserCCAs";

const OcorrenciasByTipoColumnChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: userCCAs = [] } = useUserCCAs();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('Carregando dados do gráfico por tipo...');
        
        // Aplicar filtro por CCAs do usuário
        const ccaIds = userCCAs.length > 0 ? userCCAs.map(cca => cca.id) : undefined;
        const chartData = await fetchOcorrenciasByTipo(ccaIds);
        
        console.log('Dados carregados (filtrado):', chartData);
        setData(chartData);
      } catch (error) {
        console.error("Error loading chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Só carrega se já temos dados dos CCAs ou se não há CCAs (para mostrar vazio)
    if (userCCAs.length > 0 || userCCAs.length === 0) {
      loadData();
    }
  }, [userCCAs]);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-muted-foreground">Nenhum dado disponível</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="tipo" 
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
          formatter={(value) => [value, 'Quantidade']}
        />
        <Bar 
          dataKey="count" 
          fill="#8884d8"
          name="Quantidade"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default OcorrenciasByTipoColumnChart;
