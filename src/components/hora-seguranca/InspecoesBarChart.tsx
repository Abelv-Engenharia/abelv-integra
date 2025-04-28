
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for the bar charts
const mockDataCCA = [
  { name: 'CCA 001', realizadas: 12, naoProgramadas: 5, naoRealizadas: 2, canceladas: 1 },
  { name: 'CCA 002', realizadas: 8, naoProgramadas: 3, naoRealizadas: 3, canceladas: 0 },
  { name: 'CCA 003', realizadas: 15, naoProgramadas: 2, naoRealizadas: 1, canceladas: 2 },
];

const mockDataResponsible = [
  { name: 'João Silva', realizadas: 10, naoProgramadas: 4, naoRealizadas: 1, canceladas: 0 },
  { name: 'Maria Oliveira', realizadas: 8, naoProgramadas: 2, naoRealizadas: 2, canceladas: 1 },
  { name: 'Carlos Santos', realizadas: 6, naoProgramadas: 3, naoRealizadas: 1, canceladas: 1 },
  { name: 'Ana Costa', realizadas: 7, naoProgramadas: 1, naoRealizadas: 2, canceladas: 0 },
  { name: 'Pedro Souza', realizadas: 4, naoProgramadas: 0, naoRealizadas: 0, canceladas: 1 },
];

interface InspecoesBarChartProps {
  dataType: 'cca' | 'responsible';
}

export function InspecoesBarChart({ dataType }: InspecoesBarChartProps) {
  const data = dataType === 'cca' ? mockDataCCA : mockDataResponsible;
  
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
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
          <Bar dataKey="realizadas" name="Realizadas" fill="#22c55e" />
          <Bar dataKey="naoProgramadas" name="Não Programadas" fill="#3b82f6" />
          <Bar dataKey="naoRealizadas" name="Não Realizadas" fill="#ef4444" />
          <Bar dataKey="canceladas" name="Canceladas" fill="#94a3b8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
