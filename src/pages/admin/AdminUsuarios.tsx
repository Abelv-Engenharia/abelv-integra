
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AdminOnlySection } from "@/components/security/AdminOnlySection";
import { SecurityGuard } from "@/components/security/SecurityGuard";
import { UsersManagementCard } from "@/components/admin/usuarios/UsersManagementCard";
import { UserDialogManager } from "@/components/admin/usuarios/UserDialogManager";
import { User, SearchFormValues, UserFormValues, AuthUserCreateValues } from "@/types/users";
import { useUsuarios } from "@/hooks/useUsuarios";
import { useSecurityValidation } from "@/hooks/useSecurityValidation";

const AdminUsuarios = () => {
  const navigate = useNavigate();
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { validateAction } = useSecurityValidation();

  const {
    usuarios,
    profiles,
    loadingUsuarios,
    usersError,
    canManageUsers,
    createUsuarioMutation,
    updateUsuarioMutation,
    deleteUsuarioMutation
  } = useUsuarios();

  // Debug logs
  console.log("AdminUsuarios - usuarios:", usuarios);
  console.log("AdminUsuarios - loadingUsuarios:", loadingUsuarios);
  console.log("AdminUsuarios - canManageUsers:", canManageUsers);
  console.log("AdminUsuarios - usersError:", usersError);

  // Update filtered users when usuarios data changes
  useEffect(() => {
    console.log("AdminUsuarios - useEffect - usuarios:", usuarios);
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
    const isValid = await validateAction('update_user', 'admin_usuarios');
    if (!isValid) return;

    if (selectedUser) {
      updateUsuarioMutation.mutate({ 
        userId: selectedUser.id.toString(), 
        userData: data 
      });
      setIsEditDialogOpen(false);
    }
  };

  const onAuthUserSubmit = async (data: AuthUserCreateValues) => {
    const isValid = await validateAction('create_user', 'admin_usuarios');
    if (!isValid) return;

    createUsuarioMutation.mutate(data);
    setIsCreateDialogOpen(false);
  };

  const handleDeleteUser = async () => {
    const isValid = await validateAction('delete_user', 'admin_usuarios');
    if (!isValid) return;

    if (selectedUser) {
      deleteUsuarioMutation.mutate(selectedUser.id.toString());
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleEditClick = async (user: User) => {
    const isValid = await validateAction('edit_user', 'admin_usuarios');
    if (!isValid) return;

    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = async (user: User) => {
    const isValid = await validateAction('delete_user_intent', 'admin_usuarios');
    if (!isValid) return;

    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateClick = async () => {
    const isValid = await validateAction('create_user_intent', 'admin_usuarios');
    if (!isValid) return;

    setSelectedUser(null);
    setIsCreateDialogOpen(true);
  };

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

      <SecurityGuard requiredPermission="admin_usuarios" requiredSecurityLevel="high">
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
      </SecurityGuard>
    </div>
  );
};

export default AdminUsuarios;
