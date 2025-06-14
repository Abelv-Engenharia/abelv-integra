
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TreinamentoHistorico {
  id: string;
  treinamento_nome: string;
  tipo: string;
  data_realizacao: string;
  data_validade: string;
  certificado_url?: string;
  status?: string;
  arquivado?: boolean;
}

interface Props {
  historico: TreinamentoHistorico[];
}

export const TabelaHistoricoTreinamentos: React.FC<Props> = ({ historico }) => {
  // Agora mostra TODO treinamento arquivado (independente do status)
  const historicoFiltrado = historico.filter((tr) => tr.arquivado);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Treinamento</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Data Realização</TableHead>
            <TableHead>Data Validade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Certificado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {historicoFiltrado.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Nenhum registro histórico encontrado
              </TableCell>
            </TableRow>
          ) : (
            historicoFiltrado.map((tr) => (
              <TableRow key={tr.id}>
                <TableCell>{tr.treinamento_nome}</TableCell>
                <TableCell>{tr.tipo}</TableCell>
                <TableCell>{new Date(tr.data_realizacao).toLocaleDateString("pt-BR")}</TableCell>
                <TableCell>{new Date(tr.data_validade).toLocaleDateString("pt-BR")}</TableCell>
                <TableCell>
                  {tr.status === "Excluído" && (
                    <span className="text-red-600 font-semibold">Excluído</span>
                  )}
                  {tr.status === "Reciclado" && (
                    <span className="text-amber-700 font-semibold">Reciclado</span>
                  )}
                  {!tr.status && <span>-</span>}
                  {tr.status !== "Reciclado" && tr.status !== "Excluído" && tr.status && <span>{tr.status}</span>}
                </TableCell>
                <TableCell>
                  {tr.certificado_url ? (
                    <a
                      href={tr.certificado_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Abrir PDF
                    </a>
                  ) : (
                    <span className="text-muted-foreground text-xs">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

