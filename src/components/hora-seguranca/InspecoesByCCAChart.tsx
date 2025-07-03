
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchInspecoesByCCA } from '@/services/hora-seguranca/inspecoesByCCAService';
import { useUserCCAs } from '@/hooks/useUserCCAs';
import { FilterOptions } from '@/pages/hora-seguranca/HoraSegurancaDashboard';

interface InspecoesByCCAChartProps {
  filters?: FilterOptions;
}

export function InspecoesByCCAChart({ filters }: InspecoesByCCAChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: userCCAs = [] } = useUserCCAs();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (userCCAs.length === 0) {
          setData([]);
          return;
        }
        
        // Aplicar filtro por CCAs permitidos
        const ccaIds = userCCAs.map(cca => cca.id);
        const chartData = await fetchInspecoesByCCA(ccaIds, filters);
        
        // Formatar dados para o gráfico
        const formattedData = chartData.map(item => ({
          name: item.cca,
          "A Realizar": item["A Realizar"],
          "Realizada": item["Realizada"],
          "Não Realizada": item["Não Realizada"],
          "Realizada (Não Programada)": item["Realizada (Não Programada)"],
          "Cancelada": item["Cancelada"]
        }));
        
        setData(formattedData);
      } catch (err) {
        console.error("Error loading inspeções by CCA:", err);
        setError("Não foi possível carregar os dados de inspeções por CCA");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userCCAs, filters]);

  if (loading) {
    return (
      <div className="h-[500px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">Carregando dados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[500px] w-full flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-[500px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">Nenhum dado de inspeção disponível</p>
      </div>
    );
  }

  return (
    <div className="h-[500px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 80,
          }}
          barCategoryGap="25%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={60}
            interval={0}
          />
          <YAxis />
          <Tooltip />
          <Legend 
            verticalAlign="top" 
            align="center"
            wrapperStyle={{ 
              paddingBottom: '10px',
              position: 'relative',
              top: '0px'
            }} 
          />
          <Bar dataKey="A Realizar" name="A Realizar" fill="#4285F4" />
          <Bar dataKey="Realizada" name="Realizada" fill="#43A047" />
          <Bar dataKey="Não Realizada" name="Não Realizada" fill="#E53935" />
          <Bar dataKey="Realizada (Não Programada)" name="Realizada (Não Programada)" fill="#FFA000" />
          <Bar dataKey="Cancelada" name="Cancelada" fill="#757575" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
