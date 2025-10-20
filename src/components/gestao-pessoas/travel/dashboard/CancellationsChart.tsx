import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle } from "lucide-react";

interface CancellationsChartProps {
  cancelamentos: {
    aereo: number;
    hotel: number;
    onibus: number;
  };
}

export const CancellationsChart = ({ cancelamentos }: CancellationsChartProps) => {
  const data = [
    { modal: 'Aéreo', quantidade: cancelamentos.aereo },
    { modal: 'Hotel', quantidade: cancelamentos.hotel },
    { modal: 'Rodoviário', quantidade: cancelamentos.onibus }
  ].filter(item => item.quantidade > 0);

  const total = cancelamentos.aereo + cancelamentos.hotel + cancelamentos.onibus;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-orange-600" />
          Cancelamentos Realizados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-orange-600 mb-4">
          {total} cancelamentos
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="modal" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantidade" fill="#f59e0b" name="Cancelamentos" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
