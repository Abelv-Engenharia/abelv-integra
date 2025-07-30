
import { useState, useEffect } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { fetchOcorrenciasByTipo } from "@/services/ocorrencias/ocorrenciasByTipoService";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { useOcorrenciasFilter } from "@/contexts/OcorrenciasFilterContext";

const colorMap: Record<string, string> = {
  "AC CPD": "#ef4444", // Red - Acidente com Perda de Dias
  "AC SPD": "#f59e0b", // Yellow - Acidente sem Perda de Dias  
  "INC DM": "#3b82f6", // Blue - Incidente com Dano Material
  "INC SDM": "#10b981", // Green - Incidente sem Dano Material
  "QA": "#8b5cf6", // Purple - Quase Acidente
};

const OcorrenciasByTipoChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: userCCAs = [] } = useUserCCAs();
  const { year, month, ccaId } = useOcorrenciasFilter();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Get CCA IDs that user has permission to
        let allowedCcaIds = userCCAs.map(cca => cca.id);
        
        // Se um CCA específico foi selecionado, usar apenas ele
        if (ccaId !== 'todos') {
          allowedCcaIds = [parseInt(ccaId)];
        }
        
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

    // Só carrega se já temos dados dos CCAs
    if (userCCAs.length >= 0) {
      loadData();
    }
  }, [userCCAs, year, month, ccaId]);

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

export default OcorrenciasByTipoChart;
