
import { useState, useEffect } from "react";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { fetchTaxaFrequenciaAcCpdPorMes, fetchMetaIndicador } from "@/services/ocorrencias/ocorrenciasStatsService";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { useOcorrenciasFilter } from "@/contexts/OcorrenciasFilterContext";

const TaxaFrequenciaAcCpdChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [meta, setMeta] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { data: userCCAs = [] } = useUserCCAs();
  const { year, month, ccaId } = useOcorrenciasFilter();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const anoAtual = year !== 'todos' ? parseInt(year) : new Date().getFullYear();
        
        console.log('Carregando dados AC CPD para o ano:', anoAtual);
        
        // Aplicar filtros
        let ccaIds = userCCAs.length > 0 ? userCCAs.map(cca => cca.id) : undefined;
        
        // Se um CCA específico foi selecionado, usar apenas ele
        if (ccaId !== 'todos') {
          ccaIds = [parseInt(ccaId)];
        }
        
        const [dadosMensais, metaAnual] = await Promise.all([
          fetchTaxaFrequenciaAcCpdPorMes(anoAtual, ccaIds),
          fetchMetaIndicador(anoAtual, 'meta_taxa_frequencia_ac_cpd')
        ]);

        console.log('Dados mensais AC CPD carregados (filtrado):', dadosMensais);
        console.log('Meta AC CPD carregada:', metaAnual);

        // Filtrar apenas meses com dados válidos ou que já passaram
        const mesAtual = new Date().getMonth() + 1;
        const dadosValidos = dadosMensais.filter(item => 
          item.mes <= mesAtual || item.mensal > 0 || item.acumulada > 0
        );

        setData(dadosValidos);
        setMeta(metaAnual);
      } catch (error) {
        console.error("Erro ao carregar dados AC CPD:", error);
      } finally {
        setLoading(false);
      }
    };

    // Só carrega se já temos dados dos CCAs ou se não há CCAs (para mostrar vazio)
    if (userCCAs.length > 0 || userCCAs.length === 0) {
      loadData();
    }
  }, [userCCAs, year, month, ccaId]);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-muted-foreground">Nenhum dado disponível para AC CPD</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="mes" 
          tick={{ fontSize: 11 }}
          tickFormatter={(value) => {
            const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            return meses[value - 1] || value;
          }}
        />
        <YAxis />
        <Tooltip 
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
              return (
                <div className="bg-white p-3 border border-gray-300 rounded shadow">
                  <p className="font-medium">{meses[Number(label) - 1] || label}</p>
                  {payload.map((entry, index) => (
                    <p key={index} style={{ color: entry.color }}>
                      {entry.dataKey === 'mensal' ? 'Taxa do Mês' : 'Taxa Acumulada'}: {Number(entry.value).toFixed(2)}
                    </p>
                  ))}
                  {meta > 0 && (
                    <p style={{ color: '#059669' }}>Meta: {meta.toFixed(2)}</p>
                  )}
                </div>
              );
            }
            return null;
          }}
        />
        <Bar 
          dataKey="mensal" 
          fill="#dc2626"
          name="Taxa Mensal"
        />
        <Line 
          type="monotone" 
          dataKey="acumulada" 
          stroke="#991b1b"
          strokeWidth={2}
          name="Taxa Acumulada"
        />
        {meta > 0 && (
          <ReferenceLine 
            y={meta} 
            stroke="#059669" 
            strokeDasharray="5 5"
            label={{ value: `Meta: ${meta.toFixed(2)}`, position: "top" }}
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default TaxaFrequenciaAcCpdChart;
