
import { useState, useEffect } from "react";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { fetchTaxaGravidadePorMes, fetchMetaIndicador } from "@/services/ocorrencias/ocorrenciasStatsService";

const TaxaGravidadeChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [meta, setMeta] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const anoAtual = new Date().getFullYear();
        
        const [dadosMensais, metaAnual] = await Promise.all([
          fetchTaxaGravidadePorMes(anoAtual),
          fetchMetaIndicador(anoAtual, 'meta_taxa_gravidade')
        ]);

        setData(dadosMensais);
        setMeta(metaAnual);
      } catch (error) {
        console.error("Error loading taxa gravidade data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
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
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
          formatter={(value: any, name: string) => [
            Number(value).toFixed(2), 
            name === 'mensal' ? 'Taxa Mensal' : 'Taxa Acumulada'
          ]}
        />
        <Bar 
          dataKey="mensal" 
          fill="#ea580c"
          name="Taxa Mensal"
        />
        <Line 
          type="monotone" 
          dataKey="acumulada" 
          stroke="#c2410c"
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

export default TaxaGravidadeChart;
