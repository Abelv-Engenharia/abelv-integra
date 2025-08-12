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

  // Debug logs mais detalhados
  console.log("=== DEBUG AdminUsuarios ===");
  console.log("AdminUsuarios - usuarios:", usuarios);
  console.log("AdminUsuarios - usuarios.length:", usuarios?.length);
  console.log("AdminUsuarios - loadingUsuarios:", loadingUsuarios);
  console.log("AdminUsuarios - canManageUsers:", canManageUsers);
  console.log("AdminUsuarios - usersError:", usersError);
  console.log("AdminUsuarios - profiles:", profiles);

  // Update filtered users when usuarios data changes
  useEffect(() => {
    console.log("AdminUsuarios - useEffect - usuarios recebidos:", usuarios);
    console.log("AdminUsuarios - useEffect - tipo de usuarios:", typeof usuarios);
    console.log("AdminUsuarios - useEffect - é array:", Array.isArray(usuarios));
    
    if (usuarios && usuarios.length >= 0) {
      console.log("AdminUsuarios - useEffect - setando filteredUsers com:", usuarios);
      setFilteredUsers(usuarios);
    } else {
      console.log("AdminUsuarios - useEffect - usuarios está vazio ou null");
    }
  }, [usuarios]);

  console.log("AdminUsuarios - filteredUsers final:", filteredUsers);

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

      {/* DEBUG: Vamos mostrar informações de debug na tela temporariamente */}
      <div className="bg-yellow-100 border border-yellow-400 p-4 rounded-md">
        <h3 className="font-bold">DEBUG INFO:</h3>
        <p>canManageUsers: {String(canManageUsers)}</p>
        <p>loadingUsuarios: {String(loadingUsuarios)}</p>
        <p>usuarios.length: {usuarios?.length || 0}</p>
        <p>filteredUsers.length: {filteredUsers?.length || 0}</p>
        <p>usersError: {String(usersError)}</p>
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
