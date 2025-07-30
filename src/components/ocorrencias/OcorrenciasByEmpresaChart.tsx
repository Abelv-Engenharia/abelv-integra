
import { useState, useEffect } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { fetchOcorrenciasByRisco } from "@/services/ocorrencias/ocorrenciasByRiscoService";

const colorMap: Record<string, string> = {
  "TRIVIAL": "#3b82f6", // Blue
  "TOLERÁVEL": "#10b981", // Green  
  "MODERADO": "#f59e0b", // Yellow
  "SUBSTANCIAL": "#f97316", // Orange
  "INTOLERÁVEL": "#ef4444", // Red
  "Não classificado": "#9ca3af", // Gray
};

const OcorrenciasByEmpresaChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: userCCAs = [] } = useUserCCAs();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('Carregando dados por classificação de risco...');
        
        // Get CCA IDs that user has permission to
        const allowedCcaIds = userCCAs.map(cca => cca.id);
        const chartData = await fetchOcorrenciasByRisco(allowedCcaIds);

        // Add colors to each data item
        const dataWithColors = chartData.map(item => ({
          ...item,
          color: colorMap[item.name] || "#9ca3af" // Default gray color if no matching color
        }));

        console.log('Dados do gráfico por risco (filtrado):', dataWithColors);
        setData(dataWithColors);
      } catch (err) {
        console.error("Error loading ocorrencias by risco:", err);
        setError("Erro ao carregar dados por classificação de risco");
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
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            dataKey="value"
            isAnimationActive={true}
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={120}
            fill="#8884d8"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name) => [`${value} ocorrências`, name]}
            labelFormatter={() => ''}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => `${value}`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OcorrenciasByEmpresaChart;
