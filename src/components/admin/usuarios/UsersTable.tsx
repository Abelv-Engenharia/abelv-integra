
import { Edit, Trash } from "lucide-react";
import { User } from "@/types/users";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  onEditClick: (user: User) => void;
  onDeleteClick: (user: User) => void;
}

export const UsersTable = ({ users, isLoading, onEditClick, onDeleteClick }: UsersTableProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p>Carregando usuários...</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>E-mail</TableHead>
          <TableHead>Perfil</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length > 0 ? (
          users.map((user) => (
            <TableRow key={user.id.toString()}>
              <TableCell className="font-medium">{user.nome}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.perfil}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  user.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}>
                  {user.status}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onEditClick(user)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => onDeleteClick(user)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center">
              Nenhum usuário encontrado.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
