
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getStatusColor } from "@/utils/treinamentosUtils";
import { CertificadoLink } from "./CertificadoLink";

interface HistoricoTreinamento {
  id: string;
  treinamento_nome: string;
  tipo: string;
  data_realizacao: string;
  data_validade: string;
  certificado_url?: string;
  status?: string;
}

interface Props {
  historico: HistoricoTreinamento[];
}

// Função para formatar data sem problemas de fuso horário
const formatarData = (dateString: string) => {
  if (!dateString) return "";
  const [ano, mes, dia] = dateString.split('-');
  return `${dia}/${mes}/${ano}`;
};

export const TabelaHistoricoTreinamentos: React.FC<Props> = ({ historico }) => (
  <div className="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Treinamento</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Data Realização</TableHead>
          <TableHead>Data Validade</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-center">Certificado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {historico.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
              Nenhum registro no histórico
            </TableCell>
          </TableRow>
        ) : (
          historico.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.treinamento_nome}</TableCell>
              <TableCell>{item.tipo}</TableCell>
              <TableCell>{formatarData(item.data_realizacao)}</TableCell>
              <TableCell>{formatarData(item.data_validade)}</TableCell>
              <TableCell>
                <span
                  className={`font-semibold px-3 py-1 rounded-full ${getStatusColor(item.status || "")}`}
                  style={{
                    backgroundColor:
                      item.status === "Válido"
                        ? "#D1FADF"
                        : item.status === "Próximo ao vencimento"
                        ? "#FDEFC6"
                        : item.status === "Vencido"
                        ? "#FCD7D7"
                        : "#F3F4F6",
                    color:
                      item.status === "Válido"
                        ? "#027A48"
                        : item.status === "Próximo ao vencimento"
                        ? "#B54708"
                        : item.status === "Vencido"
                        ? "#B42318"
                        : "#6B7280",
                  }}
                >
                  {item.status || "-"}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <CertificadoLink certificadoUrl={item.certificado_url} />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </div>
);
