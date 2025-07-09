import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, Search, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CriarUsuarioForm } from "@/components/admin/usuarios/CriarUsuarioForm";
import { EditarUsuarioForm } from "@/components/admin/usuarios/EditarUsuarioForm";
import { ExcluirUsuarioDialog } from "@/components/admin/usuarios/ExcluirUsuarioDialog";
import { useGerenciarUsuarios } from "@/hooks/useGerenciarUsuarios";

const GerenciarUsuarios = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const {
    usuarios,
    perfis,
    isLoading,
    canManageUsers,
    createUser,
    updateUser,
    deleteUser,
    isCreating,
    isUpdating,
    isDeleting
  } = useGerenciarUsuarios();

  const filteredUsers = usuarios.filter(user => 
    user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.perfil.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedUser = usuarios.find(u => u.id === selectedUserId);

  const handleCreateUser = async (data: any) => {
    const success = await createUser(data);
    if (success) {
      setIsCreateDialogOpen(false);
    }
  };

  const handleEditUser = async (data: any) => {
    if (selectedUserId) {
      const success = await updateUser(selectedUserId, data);
      if (success) {
        setIsEditDialogOpen(false);
        setSelectedUserId(null);
      }
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUserId) {
      const success = await deleteUser(selectedUserId);
      if (success) {
        setIsDeleteDialogOpen(false);
        setSelectedUserId(null);
      }
    }
  };

  const openEditDialog = (userId: string | number) => {
    setSelectedUserId(userId.toString());
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (userId: string | number) => {
    setSelectedUserId(userId.toString());
    setIsDeleteDialogOpen(true);
  };

  if (!canManageUsers) {
    return (
      <div className="space-y-6">
        <div>
          <Button variant="ghost" size="sm" className="mb-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciar Usuários</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground">
                Você não tem permissão para gerenciar usuários.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" className="mb-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Gerenciar Usuários</h1>
        <p className="text-muted-foreground">
          Crie novos usuários e gerencie os usuários existentes
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Usuários do Sistema</CardTitle>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Novo Usuário
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Criar Novo Usuário</DialogTitle>
                </DialogHeader>
                <CriarUsuarioForm
                  perfis={perfis}
                  onSubmit={handleCreateUser}
                  isSubmitting={isCreating}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email ou perfil..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        <span>Carregando usuários...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="text-muted-foreground">
                        {searchTerm ? "Nenhum usuário encontrado para a busca." : "Nenhum usuário cadastrado."}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.nome}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.perfil}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === "Ativo" ? "default" : "secondary"}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(user.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => openDeleteDialog(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <EditarUsuarioForm
              user={selectedUser}
              perfis={perfis}
              onSubmit={handleEditUser}
              isSubmitting={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <ExcluirUsuarioDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        user={selectedUser}
        onConfirm={handleDeleteUser}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default GerenciarUsuarios;
