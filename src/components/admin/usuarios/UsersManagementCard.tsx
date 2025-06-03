
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserSearchForm } from "@/components/admin/usuarios/UserSearchForm";
import { UsersTable } from "@/components/admin/usuarios/UsersTable";
import { User, SearchFormValues } from "@/types/users";

interface UsersManagementCardProps {
  filteredUsers: User[];
  loadingUsuarios: boolean;
  canManageUsers: boolean;
  onSearch: (data: SearchFormValues) => void;
  onCreateClick: () => void;
  onEditClick: (user: User) => void;
  onDeleteClick: (user: User) => void;
}

export const UsersManagementCard = ({
  filteredUsers,
  loadingUsuarios,
  canManageUsers,
  onSearch,
  onCreateClick,
  onEditClick,
  onDeleteClick,
}: UsersManagementCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Usuários</CardTitle>
          <Button 
            size="sm" 
            onClick={onCreateClick}
            disabled={!canManageUsers}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Usuário
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <UserSearchForm onSearch={onSearch} />

        <Separator className="my-4" />

        <div className="relative overflow-x-auto rounded-md border">
          <UsersTable
            users={filteredUsers}
            isLoading={loadingUsuarios}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
          />
        </div>
      </CardContent>
    </Card>
  );
};
