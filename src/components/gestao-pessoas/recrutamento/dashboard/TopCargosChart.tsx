import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vaga } from "@/types/gestao-pessoas/vaga";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface TopCargosChartProps {
  vagas: Vaga[];
}

export function TopCargosChart({ vagas }: TopCargosChartProps) {
  const cargosCont: Record<string, number> = {};
  
  vagas.forEach(vaga => {
    cargosCont[vaga.cargo] = (cargosCont[vaga.cargo] || 0) + 1;
  });

  const dados = Object.entries(cargosCont)
    .map(([cargo, quantidade]) => ({ cargo, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 cargos mais solicitados</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={dados} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="cargo" type="category" width={200} />
            <Tooltip />
            <Bar dataKey="quantidade" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
