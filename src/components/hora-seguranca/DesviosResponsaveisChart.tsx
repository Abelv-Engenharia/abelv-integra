
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchDesviosByResponsavel } from '@/services/hora-seguranca';
import { useUserCCAs } from '@/hooks/useUserCCAs';

export function DesviosResponsaveisChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
        
        // Aplicar filtro por CCAs permitidos
        const ccaIds = userCCAs.map(cca => cca.id);
        const chartData = await fetchDesviosByResponsavel(ccaIds);
        
        // Formatar dados para o gráfico
        const formattedData = chartData.map(item => ({
          name: item.responsavel,
          desvios: item.desvios
        }));
        
        setData(formattedData);
      } catch (err) {
        console.error("Error loading desvios by responsáveis:", err);
        setError("Não foi possível carregar os dados de desvios por responsável");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userCCAs]);

  if (loading) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">Carregando dados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // If we have no data, show a message
  if (data.length === 0) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">Nenhum desvio registrado</p>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 80,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={80}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="desvios" name="Desvios Identificados" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
