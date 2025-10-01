
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
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
          console.log('[InspecoesBarChart] chartData from service:', chartData);
          
          // Formatar dados para mostrar apenas primeiro nome no eixo X
          const formattedData = chartData.map(item => {
            console.log('[InspecoesBarChart] processing item:', item);
            return {
              name: item.primeiroNome || item.responsavel?.split(' ')[0] || item.responsavel,
              nomeCompleto: item.nomeCompleto || item.responsavel,
              "A Realizar": item["A Realizar"],
              "Realizada": item["Realizada"],
              "Não Realizada": item["Não Realizada"],
              "Realizada (Não Programada)": item["Realizada (Não Programada)"],
              "Cancelada": item["Cancelada"]
            };
          });
          console.log('[InspecoesBarChart] formattedData:', formattedData);
          setData(formattedData);
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
      <div className="h-[600px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">Carregando dados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[600px] w-full flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-[600px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">Nenhum dado de inspeção disponível</p>
      </div>
    );
  }

  const getDataKey = () => {
    return 'name'; // Sempre usar 'name' para ambos os casos
  };

  return (
    <div className="h-[600px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 40,
            right: 30,
            left: 20,
            bottom: 150,
          }}
        >
          <XAxis 
            dataKey={getDataKey()} 
            angle={-90} 
            textAnchor="end" 
            height={120}
            interval={0}
          />
          <YAxis hide />
          <Tooltip 
            labelFormatter={(label, payload) => {
              if (dataType === 'responsible' && payload && payload.length > 0) {
                return payload[0]?.payload?.nomeCompleto || label;
              }
              return label;
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '40px' }} />
          <Bar dataKey="A Realizar" name="A Realizar" fill="#4285F4">
            <LabelList dataKey="A Realizar" position="inside" fill="white" fontSize={12} formatter={(value: any) => value > 0 ? value : ''} />
          </Bar>
          <Bar dataKey="Realizada" name="Realizada" fill="#43A047">
            <LabelList dataKey="Realizada" position="inside" fill="white" fontSize={12} formatter={(value: any) => value > 0 ? value : ''} />
          </Bar>
          <Bar dataKey="Não Realizada" name="Não Realizada" fill="#E53935">
            <LabelList dataKey="Não Realizada" position="inside" fill="white" fontSize={12} formatter={(value: any) => value > 0 ? value : ''} />
          </Bar>
          <Bar dataKey="Realizada (Não Programada)" name="Realizada (Não Programada)" fill="#FFA000">
            <LabelList dataKey="Realizada (Não Programada)" position="inside" fill="white" fontSize={12} formatter={(value: any) => value > 0 ? value : ''} />
          </Bar>
          <Bar dataKey="Cancelada" name="Cancelada" fill="#757575">
            <LabelList dataKey="Cancelada" position="inside" fill="white" fontSize={12} formatter={(value: any) => value > 0 ? value : ''} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
