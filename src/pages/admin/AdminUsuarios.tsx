
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PermissionsAlert } from "@/components/admin/usuarios/PermissionsAlert";
import { UsersManagementCard } from "@/components/admin/usuarios/UsersManagementCard";
import { UserDialogManager } from "@/components/admin/usuarios/UserDialogManager";
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

      <PermissionsAlert 
        canManageUsers={canManageUsers} 
        permissions={permissions} 
      />

      <UsersManagementCard
        filteredUsers={filteredUsers}
        loadingUsuarios={loadingUsuarios}
        canManageUsers={canManageUsers}
        onSearch={onSearchSubmit}
        onCreateClick={handleCreateClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />

      <UserDialogManager
        isCreateDialogOpen={isCreateDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        canManageUsers={canManageUsers}
        selectedUser={selectedUser}
        profiles={profiles}
        isCreating={createUsuarioMutation.isPending}
        onCreateDialogChange={setIsCreateDialogOpen}
        onEditDialogChange={setIsEditDialogOpen}
        onDeleteDialogChange={setIsDeleteDialogOpen}
        onCreateSubmit={onAuthUserSubmit}
        onEditSubmit={onUserSubmit}
        onDeleteConfirm={handleDeleteUser}
      />
    </div>
  );
};

export default AdminUsuarios;
