
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserSearchForm } from "@/components/admin/usuarios/UserSearchForm";
import { UsersTable } from "@/components/admin/usuarios/UsersTable";
import { CreateUserDialog } from "@/components/admin/usuarios/CreateUserDialog";
import { EditUserDialog } from "@/components/admin/usuarios/EditUserDialog";
import { DeleteUserDialog } from "@/components/admin/usuarios/DeleteUserDialog";
import { fetchProfiles, fetchUsers } from "@/services/usuariosService";
import { User, Profile, SearchFormValues, UserFormValues } from "@/types/users";

const AdminUsuarios = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch profiles
        const profileData = await fetchProfiles();
        setProfiles(profileData);
        
        // Fetch users
        const userData = await fetchUsers();
        setUsers(userData);
        setAllUsers(userData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const onSearchSubmit = (data: SearchFormValues) => {
    if (!data.search) {
      setUsers(allUsers);
      return;
    }

    const searchTerm = data.search.toLowerCase();
    const filteredUsers = allUsers.filter(
      (user) => 
        user.nome.toLowerCase().includes(searchTerm) || 
        user.email.toLowerCase().includes(searchTerm) ||
        user.perfil.toLowerCase().includes(searchTerm)
    );
    
    setUsers(filteredUsers);
  };

  const onUserSubmit = async (data: UserFormValues) => {
    try {
      if (selectedUser) {
        // Edit existing user
        // Note: In a real system, you would implement the update in Supabase
        // This is just a simulated example
        const updatedUsers = users.map(user => 
          user.id === selectedUser.id ? { ...user, ...data } : user
        );
        setUsers(updatedUsers);
        setAllUsers(allUsers.map(user => 
          user.id === selectedUser.id ? { ...user, ...data } : user
        ));

        toast({
          title: "Usuário atualizado",
          description: `${data.nome} foi atualizado com sucesso.`,
        });
        
        setIsEditDialogOpen(false);
      } else {
        // Create new user (simulated)
        // Note: In a real system, you would implement the registration in Supabase
        const newUser = {
          id: Date.now().toString(),
          nome: data.nome,
          email: data.email,
          perfil: data.perfil,
          status: "Ativo"
        };
        
        setUsers([...users, newUser]);
        setAllUsers([...allUsers, newUser]);
        
        toast({
          title: "Usuário criado",
          description: `${data.nome} foi criado com sucesso.`,
        });
        
        setIsCreateDialogOpen(false);
      }
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      toast({
        title: "Erro ao salvar usuário",
        description: "Não foi possível salvar as alterações. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      // Simulation of deletion
      // In a real system, you would implement the deletion in Supabase
      try {
        const updatedUsers = users.filter(user => user.id !== selectedUser.id);
        setUsers(updatedUsers);
        setAllUsers(allUsers.filter(user => user.id !== selectedUser.id));
        
        toast({
          title: "Usuário excluído",
          description: `${selectedUser.nome} foi excluído com sucesso.`,
        });
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        toast({
          title: "Erro ao excluir usuário",
          description: "Não foi possível excluir o usuário. Tente novamente mais tarde.",
          variant: "destructive",
        });
      } finally {
        setIsDeleteDialogOpen(false);
        setSelectedUser(null);
      }
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

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Usuários</CardTitle>
            <Button size="sm" onClick={handleCreateClick}>
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
              users={users}
              isLoading={isLoading}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
            />
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateUserDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        profiles={profiles}
        onSubmit={onUserSubmit}
      />

      <EditUserDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        profiles={profiles}
        selectedUser={selectedUser}
        onSubmit={onUserSubmit}
      />

      <DeleteUserDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        selectedUser={selectedUser}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
};

export default AdminUsuarios;
