
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getStatusColor } from "@/utils/treinamentosUtils";

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
              <TableCell>
                <span
                  className={`font-semibold px-3 py-1 rounded-full ${getStatusColor(tr.status || "")}`}
                  style={{
                    backgroundColor:
                      tr.status === "Válido"
                        ? "#D1FADF"
                        : tr.status === "Próximo ao vencimento"
                        ? "#FDEFC6"
                        : tr.status === "Vencido"
                        ? "#FCD7D7"
                        : "#F3F4F6",
                    color:
                      tr.status === "Válido"
                        ? "#027A48"
                        : tr.status === "Próximo ao vencimento"
                        ? "#B54708"
                        : tr.status === "Vencido"
                        ? "#B42318"
                        : "#6B7280",
                  }}
                >
                  {tr.status || "-"}
                </span>
              </TableCell>
              <TableCell>
                {tr.certificado_url ? (
                  <a
                    href={tr.certificado_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Visualizar certificado
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
