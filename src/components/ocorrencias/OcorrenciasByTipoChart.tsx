
import { useState, useEffect } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { fetchOcorrenciasByTipo } from "@/services/ocorrencias/ocorrenciasByTipoService";
import { useUserCCAs } from "@/hooks/useUserCCAs";

const colorMap: Record<string, string> = {
  "Acidente com Afastamento": "#ef4444", // Red
  "Acidente sem Afastamento": "#f59e0b", // Yellow
  "Quase Acidente": "#3b82f6",           // Blue
};

const OcorrenciasByTipoChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: userCCAs = [] } = useUserCCAs();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Get CCA IDs that user has permission to
        const allowedCcaIds = userCCAs.map(cca => cca.id);
        const chartData = await fetchOcorrenciasByTipo(allowedCcaIds);
        
        // Add colors to each data item
        const dataWithColors = chartData.map(item => ({
          name: item.tipo,
          value: item.count,
          color: colorMap[item.tipo] || "#9ca3af" // Default gray color if no matching color
        }));
        
        setData(dataWithColors);
      } catch (err) {
        console.error("Error loading ocorrencias by tipo:", err);
        setError("Erro ao carregar dados por tipo de ocorrência");
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
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">Carregando dados...</p>
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
        <PieChart width={400} height={300}>
          <Pie
            dataKey="value"
            isAnimationActive={true}
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={(entry) => `${entry.name}: ${entry.value}`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} ocorrências`, 'Quantidade']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OcorrenciasByTipoChart;
