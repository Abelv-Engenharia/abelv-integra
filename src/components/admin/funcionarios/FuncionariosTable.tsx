
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Trash2 } from "lucide-react";
import { Funcionario } from "@/types/funcionarios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PermissionGuard } from "@/components/security/PermissionGuard";

interface FuncionariosTableProps {
  funcionarios: Funcionario[];
  isLoading: boolean;
  onEdit: (funcionario: Funcionario) => void;
  onDelete: (id: string) => void;
}

export const FuncionariosTable: React.FC<FuncionariosTableProps> = ({
  funcionarios,
  isLoading,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return <div className="text-center py-4">Carregando funcionários...</div>;
  }

  if (funcionarios.length === 0) {
    return <div className="text-center py-4">Nenhum funcionário encontrado.</div>;
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Foto</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Matrícula</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>CCA</TableHead>
            <TableHead>Data Admissão</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {funcionarios.map((funcionario) => (
            <TableRow key={funcionario.id}>
              <TableCell>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={funcionario.foto} alt={funcionario.nome} />
                  <AvatarFallback>
                    {funcionario.nome.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{funcionario.nome}</TableCell>
              <TableCell>{funcionario.funcao}</TableCell>
              <TableCell>{funcionario.matricula}</TableCell>
              <TableCell>{funcionario.cpf || "-"}</TableCell>
              <TableCell>
                {funcionario.ccas ? (
                  <span className="text-sm">
                    {funcionario.ccas.codigo} - {funcionario.ccas.nome}
                  </span>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>{formatDate(funcionario.data_admissao)}</TableCell>
              <TableCell>
                <Badge variant={funcionario.ativo ? "default" : "secondary"}>
                  {funcionario.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <PermissionGuard requiredPermission="admin_funcionarios">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(funcionario)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </PermissionGuard>
                  <PermissionGuard requiredPermission="admin_funcionarios">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(funcionario.id)}
                      className="text-red-600 hover:text-red-700"
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
