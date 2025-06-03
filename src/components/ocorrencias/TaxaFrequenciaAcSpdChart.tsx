
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { fetchTaxaFrequenciaAcSpd } from "@/services/ocorrencias/ocorrenciasStatsService";

const TaxaFrequenciaAcSpdChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const taxa = await fetchTaxaFrequenciaAcSpd();

        const chartData = [
          {
            name: "TX AC SPD",
            value: Number(taxa.toFixed(2)),
          }
        ];

        setData(chartData);
      } catch (error) {
        console.error("Error loading taxa AC SPD data:", error);
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
          fill="#16a34a"
          name="Taxa AC SPD"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TaxaFrequenciaAcSpdChart;
