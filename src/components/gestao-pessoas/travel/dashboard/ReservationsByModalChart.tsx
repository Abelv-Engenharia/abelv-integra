import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ReservationsByModalChartProps {
  reservas: {
    aereo: number;
    hotel: number;
    onibus: number;
    automovel: number;
  };
}

export const ReservationsByModalChart = ({ reservas }: ReservationsByModalChartProps) => {
  const data = [
    { modal: 'Aéreo', quantidade: reservas.aereo },
    { modal: 'Hotel', quantidade: reservas.hotel },
    { modal: 'Rodoviário', quantidade: reservas.onibus },
    { modal: 'Automóvel', quantidade: reservas.automovel }
  ].filter(item => item.quantidade > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Número de Reservas por Modal</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="modal" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantidade" fill="#3b82f6" name="Reservas" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
