
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { name: 'Empresa A', ocorrencias: 18 },
  { name: 'Empresa B', ocorrencias: 12 },
  { name: 'Empresa C', ocorrencias: 9 },
  { name: 'Empresa D', ocorrencias: 6 },
  { name: 'Empresa E', ocorrencias: 3 },
];

const OcorrenciasByEmpresaChart = () => {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value} ocorrências`, 'Quantidade']} />
          <Legend />
          <Bar dataKey="ocorrencias" name="Ocorrências" fill="#9b87f5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OcorrenciasByEmpresaChart;
