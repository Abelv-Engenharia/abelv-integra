
import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatarData, getStatusColor } from "@/utils/treinamentosUtils";
import { fetchFuncionariosComTreinamentos } from "@/services/treinamentosDashboardService";

export const TreinamentoStatusTable = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [funcionariosComTreinamentos, setFuncionariosComTreinamentos] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchFuncionariosComTreinamentos();
        setFuncionariosComTreinamentos(data);
      } catch (error) {
        console.error("Error loading training status data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-24">
        <p className="text-muted-foreground">Carregando dados...</p>
      </div>
    );
  }

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
            funcionario.treinamentos.map((treinamento: any, idx: number) => (
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
                <TableCell>{formatarData(treinamento.data_validade)}</TableCell>
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
