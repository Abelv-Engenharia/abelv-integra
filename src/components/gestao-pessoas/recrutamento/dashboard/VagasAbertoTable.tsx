import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Vaga, StatusVaga, EtapaProcesso } from "@/types/gestao-pessoas/vaga";
import { Badge } from "@/components/ui/badge";
import { differenceInDays } from "date-fns";

interface VagasAbertoTableProps {
  vagas: Vaga[];
}

const etapaLabels: Record<EtapaProcesso, string> = {
  [EtapaProcesso.TRIAGEM_CURRICULOS]: "Triagem currículos",
  [EtapaProcesso.ENVIO_CURRICULOS_GESTOR]: "Envio gestor",
  [EtapaProcesso.AGENDAMENTO_ENTREVISTAS]: "Agendamento",
  [EtapaProcesso.ENTREVISTAS_AGENDADAS]: "Entrevistas agendadas",
  [EtapaProcesso.ENVIO_PROFILE]: "Profile",
  [EtapaProcesso.ENVIO_TESTES]: "Testes",
  [EtapaProcesso.ENTREVISTA_FINAL]: "Entrevista final",
  [EtapaProcesso.PESQUISA_DACO]: "Pesquisa daco",
  [EtapaProcesso.ENVIO_PROPOSTA]: "Proposta",
  [EtapaProcesso.ENTREVISTA_RH]: "Entrevista rh",
  [EtapaProcesso.ENVIO_GESTOR]: "Envio gestor",
  [EtapaProcesso.DEVOLUTIVA_GESTOR]: "Devolutiva gestor",
  [EtapaProcesso.AGENDAMENTO]: "Agendamento",
  [EtapaProcesso.TESTES_PROFILE]: "Testes/profile",
  [EtapaProcesso.ENTREVISTAS_FINAIS]: "Entrevistas finais"
};

export function VagasAbertoTable({ vagas }: VagasAbertoTableProps) {
  const vagasAbertas = vagas
    .filter(v => v.status !== StatusVaga.FINALIZADA)
    .map(v => ({
      ...v,
      diasAberto: differenceInDays(new Date(), v.dataCriacao)
    }))
    .sort((a, b) => b.diasAberto - a.diasAberto)
    .slice(0, 10);

  const getPrioridadeBadge = (prioridade: string) => {
    const variants: Record<string, "destructive" | "default" | "secondary"> = {
      alta: "destructive",
      media: "default",
      baixa: "secondary"
    };
    return variants[prioridade] || "default";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 vagas com maior tempo em aberto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número da vaga</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Área</TableHead>
                <TableHead>Dias em aberto</TableHead>
                <TableHead>Etapa atual</TableHead>
                <TableHead>Prioridade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vagasAbertas.map((vaga) => (
                <TableRow key={vaga.id}>
                  <TableCell className="font-medium">{vaga.numeroVaga}</TableCell>
                  <TableCell>{vaga.cargo}</TableCell>
                  <TableCell>{vaga.area}</TableCell>
                  <TableCell>{vaga.diasAberto} dias</TableCell>
                  <TableCell>
                    {vaga.etapaAtual ? etapaLabels[vaga.etapaAtual] : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPrioridadeBadge(vaga.prioridade)}>
                      {vaga.prioridade.charAt(0).toUpperCase() + vaga.prioridade.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
