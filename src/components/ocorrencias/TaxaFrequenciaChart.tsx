
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { 
  fetchTaxaFrequenciaAcCpd, 
  fetchTaxaFrequenciaAcSpd, 
  fetchTaxaGravidade 
} from "@/services/ocorrencias/ocorrenciasStatsService";

const TaxaFrequenciaChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [taxaAcCpd, taxaAcSpd, taxaGravidade] = await Promise.all([
          fetchTaxaFrequenciaAcCpd(),
          fetchTaxaFrequenciaAcSpd(),
          fetchTaxaGravidade()
        ]);

        const chartData = [
          {
            name: "Taxa Freq. AC CPD",
            value: Number(taxaAcCpd.toFixed(2)),
            color: "#8884d8"
          },
          {
            name: "Taxa Freq. AC SPD", 
            value: Number(taxaAcSpd.toFixed(2)),
            color: "#82ca9d"
          },
          {
            name: "Taxa Gravidade",
            value: Number(taxaGravidade.toFixed(2)),
            color: "#ffc658"
          }
        ];

        setData(chartData);
      } catch (error) {
        console.error("Error loading taxa data:", error);
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
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 11 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
          formatter={(value: any) => [value, 'Taxa']}
        />
        <Bar 
          dataKey="value" 
          fill="#8884d8"
          name="Taxa"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TaxaFrequenciaChart;
