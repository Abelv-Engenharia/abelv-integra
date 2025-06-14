
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TreinamentoNormativo, Funcionario } from "@/types/treinamentos";
import { formatarData, getStatusColor, calcularStatusTreinamento } from "@/utils/treinamentosUtils";

interface Props {
  funcionario: Funcionario | null;
  treinamentosValidos: TreinamentoNormativo[];
  isLoading: boolean;
}

const FuncionarioTreinamentosValidosCard: React.FC<Props> = ({
  funcionario,
  treinamentosValidos,
  isLoading,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Treinamentos Válidos</CardTitle>
      <CardDescription>
        Lista de treinamentos válidos do funcionário selecionado.
      </CardDescription>
    </CardHeader>
    <CardContent>
      {isLoading && funcionario ? (
        <div className="flex justify-center items-center py-8">
          <p>Carregando treinamentos...</p>
        </div>
      ) : funcionario ? (
        treinamentosValidos && treinamentosValidos.length > 0 ? (
          <div className="overflow-auto max-h-[320px] min-w-[220px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Treinamento</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {treinamentosValidos.map((treinamento) => {
                  const status = calcularStatusTreinamento(
                    new Date(treinamento.data_validade)
                  );
                  return (
                    <TableRow key={treinamento.id}>
                      <TableCell>
                        {treinamento.treinamentoNome}
                      </TableCell>
                      <TableCell>
                        {formatarData(treinamento.data_validade)}
                      </TableCell>
                      <TableCell>
                        <span className={getStatusColor(status)}>
                          {status}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-10">
            Nenhum treinamento válido encontrado.
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground">
            Selecione um funcionário para ver os treinamentos.
          </p>
        </div>
      )}
    </CardContent>
  </Card>
);

export default FuncionarioTreinamentosValidosCard;
