
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const mockData = [
  { name: 'João Silva', desvios: 8 },
  { name: 'Maria Oliveira', desvios: 12 },
  { name: 'Carlos Santos', desvios: 5 },
  { name: 'Ana Costa', desvios: 15 },
  { name: 'Pedro Souza', desvios: 7 },
];

export function DesviosResponsaveisChart() {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={mockData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 80,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={80}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="desvios" name="Desvios Identificados" fill="#f97316" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
