import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vaga, EtapaProcesso } from "@/types/gestao-pessoas/vaga";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

interface FunilConversaoChartProps {
  vagas: Vaga[];
}

const etapasOrdem = [
  { key: EtapaProcesso.TRIAGEM_CURRICULOS, label: "Triagem" },
  { key: EtapaProcesso.ENVIO_GESTOR, label: "Análise gestor" },
  { key: EtapaProcesso.AGENDAMENTO, label: "Agendamento" },
  { key: EtapaProcesso.ENTREVISTAS_AGENDADAS, label: "Entrevistas" },
  { key: EtapaProcesso.TESTES_PROFILE, label: "Testes" },
  { key: EtapaProcesso.ENTREVISTA_FINAL, label: "Avaliação final" },
  { key: EtapaProcesso.PESQUISA_DACO, label: "Pesquisa daco" },
  { key: EtapaProcesso.ENVIO_PROPOSTA, label: "Proposta" }
];

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))"
];

export function FunilConversaoChart({ vagas }: FunilConversaoChartProps) {
  const dados = etapasOrdem.map((etapa, index) => {
    const count = vagas.filter(v => v.etapaAtual === etapa.key).length;
    return {
      etapa: etapa.label,
      quantidade: count,
      fill: COLORS[index % COLORS.length]
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funil de conversão do processo seletivo</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="etapa" 
              angle={-45}
              textAnchor="end"
              height={100}
              fontSize={12}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantidade" radius={[8, 8, 0, 0]}>
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
