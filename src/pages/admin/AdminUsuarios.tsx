
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, AlertCircle, Lock, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserSearchForm } from "@/components/admin/usuarios/UserSearchForm";
import { UsersTable } from "@/components/admin/usuarios/UsersTable";
import { CreateUserDialog } from "@/components/admin/usuarios/CreateUserDialog";
import { EditUserDialog } from "@/components/admin/usuarios/EditUserDialog";
import { DeleteUserDialog } from "@/components/admin/usuarios/DeleteUserDialog";
import { User, SearchFormValues, UserFormValues, AuthUserCreateValues, Permissoes } from "@/types/users";
import { useUsuarios } from "@/hooks/useUsuarios";

const AdminUsuarios = () => {
  const navigate = useNavigate();
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const {
    usuarios,
    profiles,
    loadingUsuarios,
    usersError,
    canManageUsers,
    userPermissions,
    createUsuarioMutation,
    updateUsuarioMutation,
    deleteUsuarioMutation
  } = useUsuarios();

  // Update filtered users when usuarios data changes
  useEffect(() => {
    if (usuarios && usuarios.length >= 0) {
      setFilteredUsers(usuarios);
    }
  }, [usuarios]);

  const onSearchSubmit = (data: SearchFormValues) => {
    if (!data.search) {
      setFilteredUsers(usuarios);
      return;
    }

    const searchTerm = data.search.toLowerCase();
    const filtered = usuarios.filter(
      (user) => 
        user.nome.toLowerCase().includes(searchTerm) || 
        user.email.toLowerCase().includes(searchTerm) ||
        user.perfil.toLowerCase().includes(searchTerm)
    );
    
    setFilteredUsers(filtered);
  };

  const onUserSubmit = async (data: UserFormValues) => {
    if (selectedUser) {
      updateUsuarioMutation.mutate({ 
        userId: selectedUser.id.toString(), 
        userData: data 
      });
      setIsEditDialogOpen(false);
    }
  };

  const onAuthUserSubmit = async (data: AuthUserCreateValues) => {
    createUsuarioMutation.mutate(data);
    setIsCreateDialogOpen(false);
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      deleteUsuarioMutation.mutate(selectedUser.id.toString());
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedUser(null);
    setIsCreateDialogOpen(true);
  };

  // Cast userPermissions para o tipo correto
  const permissions = (userPermissions as unknown) as Permissoes;

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Administrar Usuários</h1>
        <p className="text-muted-foreground">
          Gerencie os usuários do sistema
        </p>
      </div>

      {/* Mostrar status das permissões */}
      {canManageUsers ? (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Você tem permissões de administrador para gerenciar usuários.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive">
          <Lock className="h-4 w-4" />
          <AlertDescription>
            Você não tem permissão para gerenciar usuários. Entre em contato com o administrador do sistema para obter as permissões necessárias.
          </AlertDescription>
        </Alert>
      )}

      {!canManageUsers && permissions && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Suas permissões atuais: 
            {permissions.admin_perfis ? " Gerenciar perfis." : ""}
            {permissions.admin_funcionarios ? " Gerenciar funcionários." : ""}
            {permissions.desvios ? " Desvios." : ""}
            {permissions.ocorrencias ? " Ocorrências." : ""}
            {permissions.treinamentos ? " Treinamentos." : ""}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Usuários</CardTitle>
            <Button 
              size="sm" 
              onClick={handleCreateClick}
              disabled={!canManageUsers}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <UserSearchForm onSearch={onSearchSubmit} />

          <Separator className="my-4" />

          <div className="relative overflow-x-auto rounded-md border">
            <UsersTable
              users={filteredUsers}
              isLoading={loadingUsuarios}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
            />
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateUserDialog
        open={isCreateDialogOpen && canManageUsers}
        onOpenChange={setIsCreateDialogOpen}
        profiles={profiles}
        onSubmit={onAuthUserSubmit}
        isSubmitting={createUsuarioMutation.isPending}
      />

      <EditUserDialog
        open={isEditDialogOpen && canManageUsers}
        onOpenChange={setIsEditDialogOpen}
        profiles={profiles}
        selectedUser={selectedUser}
        onSubmit={onUserSubmit}
      />

      <DeleteUserDialog
        open={isDeleteDialogOpen && canManageUsers}
        onOpenChange={setIsDeleteDialogOpen}
        selectedUser={selectedUser}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
};

export default AdminUsuarios;
