
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Mock data for the donut chart
const data = [
  { name: 'A realizar', value: 15, color: '#facc15' },
  { name: 'Realizadas não programadas', value: 8, color: '#3b82f6' },
  { name: 'Realizadas', value: 20, color: '#22c55e' },
  { name: 'Não realizadas', value: 5, color: '#ef4444' },
  { name: 'Canceladas', value: 3, color: '#94a3b8' },
];

const COLORS = data.map(item => item.color);

export function InspecaoStatusDonutChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value} inspeções`, name]}
            labelFormatter={() => ''}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
