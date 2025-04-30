
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchInspecoesChartData } from '@/services/horaSegurancaService';

interface InspecoesBarChartProps {
  dataType: 'cca' | 'responsible';
}

export function InspecoesBarChart({ dataType }: InspecoesBarChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const chartData = await fetchInspecoesChartData();
        
        // This is a placeholder as we're using the same data source for both types
        // In a real implementation, we'd have different queries for CCA vs responsible
        setData(chartData);
      } catch (err) {
        console.error(`Error loading inspection data for ${dataType}:`, err);
        setError(`Não foi possível carregar os dados de inspeções por ${dataType === 'cca' ? 'CCA' : 'responsável'}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dataType]);

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
        <p className="text-muted-foreground">Nenhum dado disponível</p>
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
          <Bar dataKey="Concluída" name="Realizadas" fill="#22c55e" />
          <Bar dataKey="Pendente" name="Pendentes" fill="#facc15" />
          <Bar dataKey="Cancelada" name="Canceladas" fill="#94a3b8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
