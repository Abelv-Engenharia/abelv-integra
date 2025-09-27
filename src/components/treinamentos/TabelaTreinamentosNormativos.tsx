
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { getStatusColor } from "@/utils/treinamentosUtils";
import { CertificadoLink } from "./CertificadoLink";
import { PermissionGuard } from "@/components/security/PermissionGuard";

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
  onExcluir?: (id: string) => void;
}

// Função para formatar data sem problemas de fuso horário
const formatarData = (dateString: string) => {
  if (!dateString) return "";
  const [ano, mes, dia] = dateString.split('-');
  return `${dia}/${mes}/${ano}`;
};

export const TabelaTreinamentosNormativos: React.FC<Props> = ({ treinamentos, onExcluir }) => (
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
          {onExcluir && <TableHead className="text-center">Ações</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {treinamentos.length === 0 ? (
          <TableRow>
            <TableCell colSpan={onExcluir ? 7 : 6} className="text-center py-8 text-muted-foreground">
              Nenhum treinamento encontrado
            </TableCell>
          </TableRow>
        ) : (
          treinamentos.map((tr) => (
            <TableRow key={tr.id}>
              <TableCell>{tr.treinamento_nome}</TableCell>
              <TableCell>{tr.tipo}</TableCell>
              <TableCell>{formatarData(tr.data_realizacao)}</TableCell>
              <TableCell>{formatarData(tr.data_validade)}</TableCell>
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
              <TableCell className="text-center">
                <CertificadoLink certificadoUrl={tr.certificado_url} />
              </TableCell>
              {onExcluir && (
                <TableCell className="text-center">
                  <PermissionGuard requiredPermissions={["treinamentos_excluir", "admin_funcionarios"]}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onExcluir(tr.id)}
                      title="Excluir treinamento"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </PermissionGuard>
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </div>
);
