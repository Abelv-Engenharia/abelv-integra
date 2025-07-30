
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { fetchDesviosByInspectionType } from '@/services/hora-seguranca';
import { useUserCCAs } from '@/hooks/useUserCCAs';

export function DesviosTipoInspecaoChart() {
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
        const chartData = await fetchDesviosByInspectionType(ccaIds);
        
        // Formatar dados para o gráfico
        const formattedData = chartData.map((item, index) => ({
          name: item.tipo,
          value: item.quantidade,
          fill: `hsl(${220 + index * 40}, 70%, 50%)`
        }));
        
        setData(formattedData);
      } catch (err) {
        console.error("Error loading desvios by inspection type:", err);
        setError("Não foi possível carregar os dados de desvios por tipo de inspeção");
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
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
