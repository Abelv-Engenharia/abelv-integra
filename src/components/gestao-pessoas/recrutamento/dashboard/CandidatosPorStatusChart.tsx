import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Candidato, StatusCandidato } from "@/types/candidato";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface CandidatosPorStatusChartProps {
  candidatos: Candidato[];
}

const statusLabels: Record<StatusCandidato, string> = {
  [StatusCandidato.DISPONIVEL]: "Disponível",
  [StatusCandidato.EM_OUTRO_PROCESSO]: "Em outro processo",
  [StatusCandidato.CONTRATADO]: "Contratado",
  [StatusCandidato.NAO_DISPONIVEL]: "Não disponível"
};

const COLORS = [
  "hsl(142, 76%, 36%)",
  "hsl(48, 96%, 53%)",
  "hsl(217, 91%, 60%)",
  "hsl(0, 84%, 60%)"
];

export function CandidatosPorStatusChart({ candidatos }: CandidatosPorStatusChartProps) {
  const dados = Object.values(StatusCandidato).map((status, index) => ({
    status: statusLabels[status],
    quantidade: candidatos.filter(c => c.statusCandidato === status).length,
    fill: COLORS[index % COLORS.length]
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidatos por status</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="status" 
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
