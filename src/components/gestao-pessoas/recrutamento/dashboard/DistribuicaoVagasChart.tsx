import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vaga, StatusVaga } from "@/types/gestao-pessoas/vaga";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface DistribuicaoVagasChartProps {
  vagas: Vaga[];
}

const statusLabels: Record<StatusVaga, string> = {
  [StatusVaga.SOLICITACAO_ABERTA]: "Solicitação aberta",
  [StatusVaga.APROVADA]: "Aprovada",
  [StatusVaga.DIVULGACAO_FEITA]: "Divulgação feita",
  [StatusVaga.EM_SELECAO]: "Em seleção",
  [StatusVaga.FINALIZADA]: "Finalizada"
};

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))"
];

export function DistribuicaoVagasChart({ vagas }: DistribuicaoVagasChartProps) {
  const dados = Object.values(StatusVaga).map((status, index) => ({
    name: statusLabels[status],
    value: vagas.filter(v => v.status === status).length,
    fill: COLORS[index % COLORS.length]
  })).filter(item => item.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de vagas por status</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dados}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
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
