
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  MOCK_FUNCIONARIOS, 
  MOCK_TREINAMENTOS, 
  MOCK_TREINAMENTOS_NORMATIVOS, 
  Funcionario, 
  TreinamentoNormativo 
} from "@/types/treinamentos";
import { 
  calcularStatusTreinamento, 
  formatarData, 
  getStatusColor 
} from "@/utils/treinamentosUtils";

export const TreinamentoStatusTable = () => {
  // Get funcionarios with their trainings
  const funcionariosComTreinamentos = MOCK_FUNCIONARIOS.map(funcionario => {
    const treinamentos = MOCK_TREINAMENTOS_NORMATIVOS
      .filter(t => t.funcionarioId === funcionario.id && !t.arquivado)
      .map(t => ({
        ...t,
        status: calcularStatusTreinamento(t.dataValidade),
        treinamentoNome: MOCK_TREINAMENTOS.find(tr => tr.id === t.treinamentoId)?.nome || "Desconhecido"
      }));

    return {
      ...funcionario,
      treinamentos
    };
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Funcionário</TableHead>
            <TableHead>Matrícula</TableHead>
            <TableHead>Função</TableHead>
            <TableHead className="w-[200px]">Treinamento</TableHead>
            <TableHead>Validade</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {funcionariosComTreinamentos.map(funcionario => 
            funcionario.treinamentos.map((treinamento, idx) => (
              <TableRow key={`${funcionario.id}-${treinamento.id}`}>
                {idx === 0 ? (
                  <>
                    <TableCell 
                      rowSpan={funcionario.treinamentos.length} 
                      className="align-top font-medium"
                    >
                      {funcionario.nome}
                    </TableCell>
                    <TableCell 
                      rowSpan={funcionario.treinamentos.length}
                      className="align-top"
                    >
                      {funcionario.matricula}
                    </TableCell>
                    <TableCell 
                      rowSpan={funcionario.treinamentos.length}
                      className="align-top"
                    >
                      {funcionario.funcao}
                    </TableCell>
                  </>
                ) : null}
                <TableCell>{treinamento.treinamentoNome}</TableCell>
                <TableCell>{formatarData(treinamento.dataValidade)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      treinamento.status === "Válido"
                        ? "outline"
                        : treinamento.status === "Próximo ao vencimento"
                        ? "secondary"
                        : "destructive"
                    }
                    className={getStatusColor(treinamento.status)}
                  >
                    {treinamento.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
          {funcionariosComTreinamentos.flatMap(f => f.treinamentos).length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Não há registros de treinamentos.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
