import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface TrainingData {
  name: string;
  value: number;
}

const chartData: TrainingData[] = [
  { name: "Concluídos", value: 400 },
  { name: "Pendentes", value: 300 },
  { name: "Em Andamento", value: 200 },
  { name: "Não Iniciados", value: 100 },
];

const RelatoriosTreinamentos = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatório de Treinamentos</CardTitle>
        {/* You can add a description or subtitle here if needed */}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8">
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.name === "Concluídos" ? "#28a745" : "#dc3545"} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RelatoriosTreinamentos;
