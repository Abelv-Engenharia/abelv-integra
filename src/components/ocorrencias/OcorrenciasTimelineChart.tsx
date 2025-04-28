
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { name: 'Jan', comAfastamento: 1, semAfastamento: 2, quaseAcidente: 2 },
  { name: 'Fev', comAfastamento: 0, semAfastamento: 3, quaseAcidente: 1 },
  { name: 'Mar', comAfastamento: 2, semAfastamento: 1, quaseAcidente: 3 },
  { name: 'Abr', comAfastamento: 0, semAfastamento: 2, quaseAcidente: 1 },
  { name: 'Mai', comAfastamento: 1, semAfastamento: 3, quaseAcidente: 0 },
  { name: 'Jun', comAfastamento: 0, semAfastamento: 1, quaseAcidente: 2 },
  { name: 'Jul', comAfastamento: 1, semAfastamento: 2, quaseAcidente: 1 },
  { name: 'Ago', comAfastamento: 0, semAfastamento: 4, quaseAcidente: 2 },
  { name: 'Set', comAfastamento: 2, semAfastamento: 1, quaseAcidente: 0 },
  { name: 'Out', comAfastamento: 0, semAfastamento: 2, quaseAcidente: 3 },
  { name: 'Nov', comAfastamento: 1, semAfastamento: 2, quaseAcidente: 0 },
  { name: 'Dez', comAfastamento: 0, semAfastamento: 1, quaseAcidente: 1 },
];

const OcorrenciasTimelineChart = () => {
  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="comAfastamento" name="Com Afastamento" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
          <Area type="monotone" dataKey="semAfastamento" name="Sem Afastamento" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
          <Area type="monotone" dataKey="quaseAcidente" name="Quase Acidente" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OcorrenciasTimelineChart;
