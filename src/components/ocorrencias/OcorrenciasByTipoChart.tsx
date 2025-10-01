
import { useState, useEffect } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { fetchOcorrenciasByTipo } from "@/services/ocorrencias/ocorrenciasByTipoService";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { useOcorrenciasFilter } from "@/contexts/OcorrenciasFilterContext";

const colorMap: Record<string, string> = {
  "AC CPD": "#E53935", // Vermelho - Acidente com Perda de Dias
  "AC SPD": "#FF6F00", // Laranja - Acidente sem Perda de Dias  
  "INC DM": "#1976D2", // Azul - Incidente com Dano Material
  "INC SDM": "#757575", // Cinza - Incidente sem Dano Material
  "INC AMB": "#388E3C", // Verde - Incidente Ambiental
  "QA": "#8b5cf6", // Roxo - Quase Acidente
};

// Ordem específica para a legenda
const legendOrder = ["AC CPD", "AC SPD", "INC DM", "INC SDM", "INC AMB", "QA"];

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
        
        const chartData = await fetchOcorrenciasByTipo(allowedCcaIds, year, month);
        
        // Add colors to each data item
        const dataWithColors = chartData.map(item => ({
          name: item.tipo,
          value: item.count,
          color: colorMap[item.tipo] || "#9ca3af" // Default gray color if no matching color
        }));
        
        // Ordenar dados conforme a ordem da legenda
        const sortedData = dataWithColors.sort((a, b) => {
          const indexA = legendOrder.indexOf(a.name);
          const indexB = legendOrder.indexOf(b.name);
          const posA = indexA === -1 ? legendOrder.length : indexA;
          const posB = indexB === -1 ? legendOrder.length : indexB;
          return posA - posB;
        });
        
        setData(sortedData);
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
