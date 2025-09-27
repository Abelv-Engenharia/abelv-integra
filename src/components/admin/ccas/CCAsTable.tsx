
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { CCA } from "@/services/admin/ccaService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PermissionGuard } from "@/components/security/PermissionGuard";

interface CCAsTableProps {
  ccas: CCA[];
  isLoading: boolean;
  onEdit: (cca: CCA) => void;
  onDelete: (cca: CCA) => void;
}

export const CCAsTable: React.FC<CCAsTableProps> = ({
  ccas,
  isLoading,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando CCAs...</p>
        </div>
      </div>
    );
  }

  if (ccas.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Nenhum CCA encontrado</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data Criação</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ccas.map((cca) => (
            <TableRow key={cca.id}>
              <TableCell className="font-medium">{cca.codigo}</TableCell>
              <TableCell>{cca.nome}</TableCell>
              <TableCell>
                <Badge variant="secondary">{cca.tipo}</Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={cca.ativo ? "default" : "destructive"}
                  className="flex items-center gap-1 w-fit"
                >
                  {cca.ativo ? (
                    <>
                      <CheckCircle className="h-3 w-3" />
                      Ativo
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3" />
                      Inativo
                    </>
                  )}
                </Badge>
              </TableCell>
              <TableCell>
                {cca.created_at ? 
                  format(new Date(cca.created_at), "dd/MM/yyyy", { locale: ptBR }) : 
                  '-'
                }
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center space-x-2">
                  <PermissionGuard requiredPermission="admin_empresas">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(cca)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </PermissionGuard>
                  <PermissionGuard requiredPermission="admin_empresas">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(cca)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </PermissionGuard>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
