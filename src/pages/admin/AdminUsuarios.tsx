
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Search, UserRound, UserPlus, Edit, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Form schema using zod
const searchFormSchema = z.object({
  search: z.string().optional(),
});

const userFormSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Digite um email válido"),
  perfil: z.string().min(1, "Selecione um perfil"),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;
type UserFormValues = z.infer<typeof userFormSchema>;

// Mock data for users
const mockUsers = [
  { id: 1, nome: "João Silva", email: "joao.silva@empresa.com", perfil: "Administrador", status: "Ativo" },
  { id: 2, nome: "Maria Souza", email: "maria.souza@empresa.com", perfil: "Operador", status: "Ativo" },
  { id: 3, nome: "Carlos Oliveira", email: "carlos.oliveira@empresa.com", perfil: "Gestor", status: "Inativo" },
  { id: 4, nome: "Ana Pereira", email: "ana.pereira@empresa.com", perfil: "Operador", status: "Ativo" },
];

// Mock data for profiles
const mockProfiles = [
  { id: 1, nome: "Administrador" },
  { id: 2, nome: "Gestor" },
  { id: 3, nome: "Operador" },
];

const AdminUsuarios = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState(mockUsers);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);

  // Initialize search form
  const searchForm = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      search: "",
    },
  });

  // Initialize user form
  const userForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      nome: "",
      email: "",
      perfil: "",
    },
  });

  const onSearchSubmit = (data: SearchFormValues) => {
    if (!data.search) {
      setUsers(mockUsers);
      return;
    }

    const filteredUsers = mockUsers.filter(
      (user) => 
        user.nome.toLowerCase().includes(data.search!.toLowerCase()) || 
        user.email.toLowerCase().includes(data.search!.toLowerCase()) ||
        user.perfil.toLowerCase().includes(data.search!.toLowerCase())
    );
    
    setUsers(filteredUsers);
  };

  const onUserSubmit = (data: UserFormValues) => {
    if (selectedUser) {
      // Edit existing user
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? { ...user, ...data } : user
      );
      setUsers(updatedUsers);

      toast({
        title: "Usuário atualizado",
        description: `${data.nome} foi atualizado com sucesso.`,
      });
      
      setIsEditDialogOpen(false);
    } else {
      // Create new user
      const newUser = {
        id: users.length + 1,
        nome: data.nome,
        email: data.email,
        perfil: data.perfil,
        status: "Ativo"
      };
      
      setUsers([...users, newUser]);
      
      toast({
        title: "Usuário criado",
        description: `${data.nome} foi criado com sucesso.`,
      });
      
      setIsCreateDialogOpen(false);
    }
    
    userForm.reset();
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      const updatedUsers = users.filter(user => user.id !== selectedUser.id);
      setUsers(updatedUsers);
      
      toast({
        title: "Usuário excluído",
        description: `${selectedUser.nome} foi excluído com sucesso.`,
      });
      
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleEditClick = (user: typeof mockUsers[0]) => {
    setSelectedUser(user);
    userForm.reset({
      nome: user.nome,
      email: user.email,
      perfil: user.perfil,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (user: typeof mockUsers[0]) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateClick = () => {
    userForm.reset({
      nome: "",
      email: "",
      perfil: "",
    });
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
          <Form {...searchForm}>
            <form 
              onSubmit={searchForm.handleSubmit(onSearchSubmit)} 
              className="flex space-x-2 mb-6"
            >
              <FormField
                control={searchForm.control}
                name="search"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Buscar usuários..."
                          className="pl-8"
                          {...field}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">Buscar</Button>
            </form>
          </Form>

          <Separator className="my-4" />

          <div className="relative overflow-x-auto rounded-md border">
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
                    <TableRow key={user.id}>
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
                            onClick={() => handleEditClick(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleDeleteClick(user)}
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
          </div>
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Criar Novo Usuário</DialogTitle>
            <DialogDescription>
              Preencha as informações para criar um novo usuário.
            </DialogDescription>
          </DialogHeader>
          <Form {...userForm}>
            <form onSubmit={userForm.handleSubmit(onUserSubmit)} className="space-y-4">
              <FormField
                control={userForm.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do usuário" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userForm.control}
                name="perfil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perfil de Acesso</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um perfil" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockProfiles.map((profile) => (
                          <SelectItem key={profile.id} value={profile.nome}>
                            {profile.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Criar Usuário</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize as informações do usuário.
            </DialogDescription>
          </DialogHeader>
          <Form {...userForm}>
            <form onSubmit={userForm.handleSubmit(onUserSubmit)} className="space-y-4">
              <FormField
                control={userForm.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do usuário" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userForm.control}
                name="perfil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perfil de Acesso</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um perfil" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockProfiles.map((profile) => (
                          <SelectItem key={profile.id} value={profile.nome}>
                            {profile.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Salvar Alterações</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Excluir Usuário</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este usuário? Esta ação não poderá ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-4 py-4">
            <div className="bg-muted p-2 rounded-full">
              <UserRound className="h-8 w-8" />
            </div>
            <div>
              <p className="font-medium">{selectedUser?.nome}</p>
              <p className="text-sm text-muted-foreground">{selectedUser?.email}</p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="button" 
              variant="destructive"
              onClick={handleDeleteUser}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsuarios;
