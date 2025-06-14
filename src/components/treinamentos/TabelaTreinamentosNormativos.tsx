
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TreinamentoNormativo {
  id: string;
  treinamento_nome: string;
  tipo: string;
  data_realizacao: string;
  data_validade: string;
  certificado_url?: string;
  status?: string;
}

interface Props {
  treinamentos: TreinamentoNormativo[];
}

export const TabelaTreinamentosNormativos: React.FC<Props> = ({ treinamentos }) => (
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
        {treinamentos.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
              Nenhum treinamento encontrado
            </TableCell>
          </TableRow>
        ) : (
          treinamentos.map((tr) => (
            <TableRow key={tr.id}>
              <TableCell>{tr.treinamento_nome}</TableCell>
              <TableCell>{tr.tipo}</TableCell>
              <TableCell>{new Date(tr.data_realizacao).toLocaleDateString("pt-BR")}</TableCell>
              <TableCell>{new Date(tr.data_validade).toLocaleDateString("pt-BR")}</TableCell>
              <TableCell>{tr.status}</TableCell>
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
