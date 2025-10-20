import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AverageAdvanceChartProps {
  antecedencia: {
    aereo: number;
    hotel: number;
    onibus: number;
  };
}

export const AverageAdvanceChart = ({ antecedencia }: AverageAdvanceChartProps) => {
  const data = [
    { modal: 'Aéreo', dias: antecedencia.aereo, minimo: 5 },
    { modal: 'Hotel', dias: antecedencia.hotel, minimo: 15 },
    { modal: 'Rodoviário', dias: antecedencia.onibus, minimo: 3 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Antecedência Média de Compra</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="modal" />
            <YAxis label={{ value: 'Dias', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="dias" stroke="#10b981" name="Antecedência Média" strokeWidth={2} />
            <Line type="monotone" dataKey="minimo" stroke="#ef4444" name="Mínimo Recomendado" strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
