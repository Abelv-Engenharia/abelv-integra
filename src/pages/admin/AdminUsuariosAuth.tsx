
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AuthUsersTable } from "@/components/admin/auth/AuthUsersTable";
import { AuthUserSearchForm } from "@/components/admin/auth/AuthUserSearchForm";
import { CreateAuthUserDialog } from "@/components/admin/auth/CreateAuthUserDialog";
import { ViewAuthUserDialog } from "@/components/admin/auth/ViewAuthUserDialog";
import { DeleteAuthUserDialog } from "@/components/admin/auth/DeleteAuthUserDialog";
import { AuthUserStatusSelect } from "@/components/admin/auth/AuthUserStatusSelect";
import { fetchUsers, fetchProfiles } from "@/services/usuariosService";
import { AuthUser, Profile } from "@/types/users";

const AdminUsuariosAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const perPage = 10;

  // Fetch data from service
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch profiles
        const profileData = await fetchProfiles();
        setProfiles(profileData);
        
        // Fetch users
        const { users, total } = await fetchUsers(currentPage, perPage, searchQuery, statusFilter);
        setUsers(users);
        setTotalUsers(total);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Ocorreu um erro ao carregar os dados de usuários.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast, currentPage, perPage, searchQuery, statusFilter]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { users, total } = await fetchUsers(currentPage, perPage, searchQuery, statusFilter);
        setUsers(users);
        setTotalUsers(total);
      } catch (error) {
        console.error('Erro ao atualizar dados:', error);
        toast({
          title: "Erro ao atualizar",
          description: "Ocorreu um erro ao atualizar os dados.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  };

  const handleViewClick = (user: AuthUser) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const handleDeleteClick = (user: AuthUser) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateClick = () => {
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
        <h1 className="text-2xl font-bold tracking-tight">Usuários do Sistema</h1>
        <p className="text-muted-foreground">
          Gerencie os usuários autenticados no sistema
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Usuários Autenticados</CardTitle>
            <Button size="sm" onClick={handleCreateClick}>
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
            <div className="flex-1">
              <AuthUserSearchForm onSearch={handleSearch} />
            </div>
            <div className="md:w-48">
              <AuthUserStatusSelect onChange={handleStatusChange} />
            </div>
          </div>

          <Separator className="my-4" />

          <div className="relative overflow-x-auto rounded-md border">
            <AuthUsersTable
              users={users}
              isLoading={isLoading}
              currentPage={currentPage}
              totalUsers={totalUsers}
              perPage={perPage}
              onPageChange={handlePageChange}
              onViewClick={handleViewClick}
              onDeleteClick={handleDeleteClick}
            />
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateAuthUserDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        profiles={profiles}
        onSuccess={handleRefresh}
      />

      <ViewAuthUserDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        user={selectedUser}
        profiles={profiles}
        onUserUpdated={handleRefresh}
      />

      <DeleteAuthUserDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        user={selectedUser}
        onSuccess={handleRefresh}
      />
    </div>
  );
};

export default AdminUsuariosAuth;
