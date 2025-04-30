
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Eye, Trash } from "lucide-react";
import { AuthUser } from "@/types/users";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface AuthUsersTableProps {
  users: AuthUser[];
  isLoading: boolean;
  currentPage: number;
  totalUsers: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onViewClick: (user: AuthUser) => void;
  onDeleteClick: (user: AuthUser) => void;
}

export const AuthUsersTable = ({
  users,
  isLoading,
  currentPage,
  totalUsers,
  perPage,
  onPageChange,
  onViewClick,
  onDeleteClick,
}: AuthUsersTableProps) => {
  const totalPages = Math.ceil(totalUsers / perPage);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch (e) {
      return "Data inválida";
    }
  };

  const getUserStatus = (user: AuthUser) => {
    if (user.banned_until) {
      return "Bloqueado";
    } else if (user.email_confirmed_at) {
      return "Confirmado";
    } else {
      return "Pendente";
    }
  };

  const getStatusClassName = (user: AuthUser) => {
    if (user.banned_until) {
      return "bg-red-100 text-red-800";
    } else if (user.email_confirmed_at) {
      return "bg-green-100 text-green-800";
    } else {
      return "bg-yellow-100 text-yellow-800";
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p>Carregando usuários...</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">E-mail</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead>Último Login</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell>{formatDate(user.created_at)}</TableCell>
                <TableCell>{formatDate(user.last_sign_in_at)}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClassName(
                      user
                    )}`}
                  >
                    {getUserStatus(user)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewClick(user)}
                    >
                      <Eye className="h-4 w-4" />
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
      
      {totalPages > 1 && (
        <div className="py-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) onPageChange(currentPage - 1);
                  }} 
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                // Show first page, current page, and last page
                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          onPageChange(page);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                // Show ellipsis if needed
                } else if (page === 2 || page === totalPages - 1) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return null;
              })}
              
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) onPageChange(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
};
