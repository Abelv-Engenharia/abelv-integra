import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Candidato, OrigemCandidato } from "@/types/gestao-pessoas/candidato";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface OrigemCandidatosChartProps {
  candidatos: Candidato[];
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(217, 91%, 60%)",
  "hsl(142, 76%, 36%)"
];

export function OrigemCandidatosChart({ candidatos }: OrigemCandidatosChartProps) {
  const dados = Object.values(OrigemCandidato).map((origem, index) => ({
    name: origem,
    value: candidatos.filter(c => c.origemCandidato === origem).length,
    fill: COLORS[index % COLORS.length]
  })).filter(item => item.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Origem dos candidatos</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dados}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {dados.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
