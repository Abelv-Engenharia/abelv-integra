
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const mockData = [
  { name: 'Programada', desvios: 15 },
  { name: 'Não Programada', desvios: 8 },
  { name: 'Extraordinária', desvios: 5 },
];

export function DesviosTipoInspecaoChart() {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={mockData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="desvios" name="Desvios Identificados" fill="#f97316" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
