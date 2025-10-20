import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit } from "lucide-react";
import { Vaga, EtapaProcesso, PrioridadeVaga } from "@/types/gestao-pessoas/vaga";
import { IndicadorPrazoVaga } from "./IndicadorPrazoVaga";
import { format } from "date-fns";

interface TabelaAcompanhamentoProps {
  vagas: Vaga[];
  onViewDetails: (vaga: Vaga) => void;
}

export function TabelaAcompanhamento({ vagas, onViewDetails }: TabelaAcompanhamentoProps) {
  const getNomeEtapa = (etapa?: EtapaProcesso) => {
    if (!etapa) return "N/A";
    const etapas = {
      [EtapaProcesso.TRIAGEM_CURRICULOS]: "Triagem",
      [EtapaProcesso.ENTREVISTA_RH]: "Entrevista RH",
      [EtapaProcesso.ENVIO_GESTOR]: "Envio Gestor",
      [EtapaProcesso.DEVOLUTIVA_GESTOR]: "Devolutiva",
      [EtapaProcesso.AGENDAMENTO]: "Agendamento",
      [EtapaProcesso.TESTES_PROFILE]: "Testes",
      [EtapaProcesso.ENTREVISTAS_FINAIS]: "Entrevistas Finais",
    };
    return etapas[etapa];
  };

  const getPrioridadeColor = (prioridade: PrioridadeVaga) => {
    switch (prioridade) {
      case PrioridadeVaga.ALTA:
        return "bg-red-100 text-red-800 border-red-300";
      case PrioridadeVaga.MEDIA:
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case PrioridadeVaga.BAIXA:
        return "bg-green-100 text-green-800 border-green-300";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nº Vaga</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Unidade/Obra</TableHead>
            <TableHead>Etapa Atual</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Data Solicitação</TableHead>
            <TableHead>Prazo</TableHead>
            <TableHead>Gestor</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vagas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">
                Nenhuma vaga encontrada
              </TableCell>
            </TableRow>
          ) : (
            vagas.map((vaga) => (
              <TableRow key={vaga.id}>
                <TableCell className="font-medium">{vaga.numeroVaga}</TableCell>
                <TableCell>{vaga.cargo}</TableCell>
                <TableCell>{vaga.localTrabalho}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getNomeEtapa(vaga.etapaAtual)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPrioridadeColor(vaga.prioridade)}>
                    {vaga.prioridade}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(vaga.dataCriacao), "dd/MM/yyyy")}
                </TableCell>
                <TableCell>
                  {vaga.diasRestantes !== undefined && vaga.atrasado !== undefined ? (
                    <IndicadorPrazoVaga
                      diasRestantes={vaga.diasRestantes}
                      atrasado={vaga.atrasado}
                    />
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </TableCell>
                <TableCell>{vaga.gestor}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewDetails(vaga)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
