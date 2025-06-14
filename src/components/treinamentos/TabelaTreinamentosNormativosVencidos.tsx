import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { treinamentosNormativosService } from "@/services/treinamentos/treinamentosNormativosService";
import { Funcionario, TreinamentoNormativo } from "@/types/treinamentos";
import { format } from "date-fns";
import { fetchFuncionarios } from "@/utils/treinamentosUtils";

export const TabelaTreinamentosNormativosVencidos: React.FC = () => {
  const [treinamentos, setTreinamentos] = useState<TreinamentoNormativo[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      treinamentosNormativosService.getAll(),
      fetchFuncionarios()
    ]).then(([treinamentos, funcionarios]) => {
      setTreinamentos(treinamentos);
      setFuncionarios(funcionarios);
    }).finally(() => setLoading(false));
  }, []);

  // Pega todos os registros vencidos e próximos ao vencimento
  const treinamentosFiltrados = treinamentos.filter(t =>
    t.status === "Vencido" || t.status === "Próximo ao vencimento"
  );

  function getFuncionarioInfo(id: string) {
    return funcionarios.find(f => f.id === id);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-24 w-full">
        <p className="text-muted-foreground">Carregando registros...</p>
      </div>
    );
  }

  return (
    <div className="mt-4 w-full">
      <h3 className="font-semibold text-lg mb-2 px-6 pt-6">
        Treinamentos Vencidos e Próximos ao Vencimento
      </h3>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Funcionário</TableHead>
            <TableHead>Matrícula</TableHead>
            <TableHead>Treinamento</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Data de Realização</TableHead>
            <TableHead>Data de Validade</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {treinamentosFiltrados.length > 0 ? (
            treinamentosFiltrados.map((t) => {
              const funcionario = getFuncionarioInfo(t.funcionario_id);
              return (
                <TableRow key={t.id}>
                  <TableCell>{funcionario?.nome || "-"}</TableCell>
                  <TableCell>{funcionario?.matricula || "-"}</TableCell>
                  <TableCell>{t.treinamentoNome || "-"}</TableCell>
                  <TableCell>{t.tipo || "-"}</TableCell>
                  <TableCell>
                    {t.data_realizacao
                      ? format(new Date(t.data_realizacao), "dd/MM/yyyy")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {t.data_validade
                      ? format(new Date(t.data_validade), "dd/MM/yyyy")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        t.status === "Vencido"
                          ? "text-red-600 font-semibold"
                          : "text-amber-600 font-semibold"
                      }
                    >
                      {t.status}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-16 text-center text-muted-foreground">
                Nenhum treinamento vencido ou próximo ao vencimento encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
