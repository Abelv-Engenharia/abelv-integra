
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

// Função utilitária para deduplicar treinamentos, mantendo somente o mais recente para cada tipo/nome de treinamento
const getTreinamentosMaisRecentes = (
  treinamentos: TreinamentoNormativo[]
): TreinamentoNormativo[] => {
  // Usar um Map para associar nome do treinamento ao registro com a data de realização mais recente
  const map = new Map<string, TreinamentoNormativo>();

  for (const t of treinamentos) {
    // Chave pode ser pelo nome do treinamento (treinamentoNome) ou id, mas nome é mais legível
    const key = t.treinamentoNome || t.treinamento_id;
    const existente = map.get(key);
    if (
      !existente ||
      new Date(t.data_realizacao).getTime() > new Date(existente.data_realizacao).getTime()
    ) {
      map.set(key, t);
    }
  }

  // Retorna apenas um por nome/treinamento, ordenados por validade
  return Array.from(map.values()).sort(
    (a, b) => new Date(a.data_validade).getTime() - new Date(b.data_validade).getTime()
  );
};

const FuncionarioTreinamentosValidosCard: React.FC<Props> = ({
  funcionario,
  treinamentosValidos,
  isLoading,
}) => {
  // aplicar filtro para mostrar apenas o treinamento com data de realização mais recente por tipo
  const treinamentosFiltrados = getTreinamentosMaisRecentes(treinamentosValidos);

  return (
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
          treinamentosFiltrados && treinamentosFiltrados.length > 0 ? (
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
                  {treinamentosFiltrados.map((treinamento) => {
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
};

export default FuncionarioTreinamentosValidosCard;

