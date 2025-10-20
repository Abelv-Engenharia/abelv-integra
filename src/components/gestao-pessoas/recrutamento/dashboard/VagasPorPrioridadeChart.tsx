import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vaga, PrioridadeVaga } from "@/types/gestao-pessoas/vaga";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface VagasPorPrioridadeChartProps {
  vagas: Vaga[];
}

const prioridadeLabels: Record<PrioridadeVaga, string> = {
  [PrioridadeVaga.ALTA]: "Alta",
  [PrioridadeVaga.MEDIA]: "Média",
  [PrioridadeVaga.BAIXA]: "Baixa"
};

const prioridadeColors: Record<PrioridadeVaga, string> = {
  [PrioridadeVaga.ALTA]: "hsl(0, 84%, 60%)",
  [PrioridadeVaga.MEDIA]: "hsl(48, 96%, 53%)",
  [PrioridadeVaga.BAIXA]: "hsl(142, 76%, 36%)"
};

export function VagasPorPrioridadeChart({ vagas }: VagasPorPrioridadeChartProps) {
  const dados = Object.values(PrioridadeVaga).map(prioridade => ({
    prioridade: prioridadeLabels[prioridade],
    quantidade: vagas.filter(v => v.prioridade === prioridade).length,
    fill: prioridadeColors[prioridade]
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vagas por prioridade</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dados} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="prioridade" type="category" width={80} />
            <Tooltip />
            <Bar dataKey="quantidade" radius={[0, 8, 8, 0]}>
              {dados.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
