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
import { Edit, Trash2 } from "lucide-react";
import { TipoDocumento } from "@/services/admin/tipoDocumentoService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PermissionGuard } from "@/components/security/PermissionGuard";

interface TiposDocumentosTableProps {
  documentos: TipoDocumento[];
  isLoading: boolean;
  onEdit: (documento: TipoDocumento) => void;
  onDelete: (documento: TipoDocumento) => void;
}

export const TiposDocumentosTable: React.FC<TiposDocumentosTableProps> = ({
  documentos,
  isLoading,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando tipos de documentos...</p>
        </div>
      </div>
    );
  }

  if (documentos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Nenhum tipo de documento encontrado</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Data Criação</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documentos.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="font-medium">{doc.codigo}</TableCell>
              <TableCell>{doc.descricao}</TableCell>
              <TableCell>
                {doc.created_at ? 
                  format(new Date(doc.created_at), "dd/MM/yyyy", { locale: ptBR }) : 
                  '-'
                }
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center space-x-2">
                  <PermissionGuard requiredPermission="admin_empresas">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(doc)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </PermissionGuard>
                  <PermissionGuard requiredPermission="admin_empresas">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(doc)}
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
