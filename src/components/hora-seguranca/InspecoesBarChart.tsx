
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchInspecoesByResponsavel } from '@/services/hora-seguranca';
import { useUserCCAs } from '@/hooks/useUserCCAs';

interface InspecoesBarChartProps {
  dataType: 'cca' | 'responsible';
}

export function InspecoesBarChart({ dataType }: InspecoesBarChartProps) {
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
        
        if (dataType === 'responsible') {
          const chartData = await fetchInspecoesByResponsavel(ccaIds);
          setData(chartData);
        } else if (dataType === 'cca') {
          // Para dados por CCA, vamos mostrar apenas os CCAs permitidos
          const ccaData = userCCAs.map(cca => ({
            name: `${cca.codigo} - ${cca.nome}`,
            "A Realizar": 0,
            "Realizada": 0,
            "Não Realizada": 0,
            "Realizada (Não Programada)": 0,
            "Cancelada": 0,
          }));
          setData(ccaData);
        }
      } catch (err) {
        console.error("Error loading inspection data:", err);
        setError("Não foi possível carregar os dados de inspeções");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dataType, userCCAs]);

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

  if (data.length === 0) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">Nenhum dado de inspeção disponível</p>
      </div>
    );
  }

  const getChartTitle = () => {
    return dataType === 'cca' ? 'Inspeções por CCA' : 'Inspeções por Responsável';
  };

  const getDataKey = () => {
    return dataType === 'cca' ? 'nome' : 'responsavel';
  };

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
            dataKey={getDataKey()} 
            angle={-45} 
            textAnchor="end" 
            height={80}
          />
          <YAxis />
          <Tooltip />
          <Legend />
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
