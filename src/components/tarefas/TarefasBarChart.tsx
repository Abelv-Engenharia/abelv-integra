
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Jan', programadas: 40, concluidas: 24, pendentes: 16 },
  { name: 'Fev', programadas: 30, concluidas: 20, pendentes: 10 },
  { name: 'Mar', programadas: 45, concluidas: 35, pendentes: 10 },
  { name: 'Abr', programadas: 50, concluidas: 32, pendentes: 18 },
  { name: 'Mai', programadas: 35, concluidas: 25, pendentes: 10 },
  { name: 'Jun', programadas: 60, concluidas: 45, pendentes: 15 },
];

const TarefasBarChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="programadas" fill="#8884d8" />
        <Bar dataKey="concluidas" fill="#82ca9d" />
        <Bar dataKey="pendentes" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TarefasBarChart;
