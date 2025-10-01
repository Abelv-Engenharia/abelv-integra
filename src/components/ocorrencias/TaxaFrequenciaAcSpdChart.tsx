import { useState, useEffect } from "react";
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, LabelList } from "recharts";
import { fetchTaxaFrequenciaAcSpdPorMes, fetchMetaIndicador } from "@/services/ocorrencias/ocorrenciasStatsService";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { useOcorrenciasFilter } from "@/contexts/OcorrenciasFilterContext";
import { IndicadorFlag } from "./IndicadorFlag";

const TaxaFrequenciaAcSpdChart = () => {
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
        const mesAtual = month !== 'todos' ? parseInt(month) : undefined;
        
        console.log('Carregando dados AC SPD para o ano:', anoAtual, 'mês:', mesAtual);
        
        // Aplicar filtros
        let ccaIds = userCCAs.length > 0 ? userCCAs.map(cca => cca.id) : undefined;
        
        // Se um CCA específico foi selecionado, usar apenas ele
        if (ccaId !== 'todos') {
          ccaIds = [parseInt(ccaId)];
        }
        
        const [dadosMensais, metaAnual] = await Promise.all([
          fetchTaxaFrequenciaAcSpdPorMes(anoAtual, ccaIds, mesAtual),
          fetchMetaIndicador(anoAtual, 'meta_taxa_frequencia_ac_spd')
        ]);

        console.log('Dados mensais AC SPD carregados (filtrado):', dadosMensais);
        console.log('Meta AC SPD carregada:', metaAnual);

        // Se um mês específico foi selecionado, mostrar apenas esse mês
        let dadosParaExibir = dadosMensais;
        if (mesAtual) {
          dadosParaExibir = dadosMensais.filter(item => item.mes === mesAtual);
        } else {
          // Filtrar apenas meses com dados válidos ou que já passaram
          const mesAtualReal = new Date().getMonth() + 1;
          const anoAtualReal = new Date().getFullYear();
          
          // Se estamos vendo o ano atual, mostrar apenas meses que já passaram ou com dados
          if (anoAtual === anoAtualReal) {
            dadosParaExibir = dadosMensais.filter(item => 
              item.mes <= mesAtualReal || item.mensal > 0 || item.acumulada > 0
            );
          }
        }

        setData(dadosParaExibir);
        setMeta(metaAnual);
      } catch (error) {
        console.error("Erro ao carregar dados AC SPD:", error);
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
        <p className="text-muted-foreground">Nenhum dado disponível para AC SPD</p>
      </div>
    );
  }

  // Obter a taxa acumulada mais recente
  const ultimosDados = data[data.length - 1];
  const taxaAcumuladaAtual = ultimosDados?.acumulada || 0;

  return (
    <div className="relative">
      {/* Flag do indicador no canto superior direito */}
      <IndicadorFlag 
        taxaAcumulada={taxaAcumuladaAtual}
        meta={meta}
        className="absolute top-2 right-2 z-10"
      />
      
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data} margin={{ top: 20, right: 130, left: 20, bottom: 60 }}>
          <XAxis 
            dataKey="mes" 
            tick={{ fontSize: 14 }}
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
            fill="#16a34a"
            name="Taxa Mensal"
          >
            <LabelList 
              dataKey="mensal" 
              position="top" 
              fontSize={14} 
              formatter={(value: any) => value > 0 ? value.toFixed(2) : ''} 
            />
          </Bar>
          <Line 
            type="monotone" 
            dataKey="acumulada" 
            stroke="#15803d"
            strokeWidth={2}
            name="Taxa Acumulada"
          />
          {meta > 0 && (
            <ReferenceLine 
              y={meta} 
              stroke="#059669" 
              strokeDasharray="5 5"
              label={{ 
                value: `Meta: ${meta.toFixed(2)}`, 
                position: "right", 
                style: { fontSize: '16px' },
                offset: 10 
              }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaxaFrequenciaAcSpdChart;
