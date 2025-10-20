import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vaga, TipoContrato } from "@/types/gestao-pessoas/vaga";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface VagasPorContratoChartProps {
  vagas: Vaga[];
}

const contratoLabels: Record<TipoContrato, string> = {
  [TipoContrato.CLT]: "Clt",
  [TipoContrato.PJ]: "Pj",
  [TipoContrato.APRENDIZ]: "Aprendiz",
  [TipoContrato.ESTAGIO]: "Estágio"
};

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))"
];

export function VagasPorContratoChart({ vagas }: VagasPorContratoChartProps) {
  const dados = Object.values(TipoContrato).map((tipo, index) => ({
    name: contratoLabels[tipo],
    value: vagas.filter(v => v.tipoContrato === tipo).length,
    fill: COLORS[index % COLORS.length]
  })).filter(item => item.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vagas por tipo de contrato</CardTitle>
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
