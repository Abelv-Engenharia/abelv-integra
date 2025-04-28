
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Search, ShieldCheck, Plus, Edit, Trash } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
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

// Form schemas using zod
const searchFormSchema = z.object({
  search: z.string().optional(),
});

const perfilFormSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  descricao: z.string().min(3, "A descrição deve ter pelo menos 3 caracteres"),
  permissoes: z.record(z.boolean()).optional(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;
type PerfilFormValues = z.infer<typeof perfilFormSchema>;

// Mock data for profiles
const mockPerfis = [
  { 
    id: 1, 
    nome: "Administrador", 
    descricao: "Acesso completo ao sistema", 
    permissoes: {
      "desvios": true,
      "treinamentos": true,
      "hora_seguranca": true,
      "ocorrencias": true,
      "medidas_disciplinares": true,
      "tarefas": true,
      "relatorios": true,
      "admin_usuarios": true,
      "admin_perfis": true,
      "admin_funcionarios": true,
      "admin_hht": true,
      "admin_templates": true,
    }
  },
  { 
    id: 2, 
    nome: "Gestor", 
    descricao: "Acesso a gestão e relatórios",
    permissoes: {
      "desvios": true,
      "treinamentos": true,
      "hora_seguranca": true,
      "ocorrencias": true,
      "medidas_disciplinares": false,
      "tarefas": true,
      "relatorios": true,
      "admin_usuarios": false,
      "admin_perfis": false,
      "admin_funcionarios": true,
      "admin_hht": true,
      "admin_templates": false,
    }
  },
  { 
    id: 3, 
    nome: "Operador", 
    descricao: "Acesso básico para operação",
    permissoes: {
      "desvios": true,
      "treinamentos": false,
      "hora_seguranca": true,
      "ocorrencias": true,
      "medidas_disciplinares": false,
      "tarefas": true,
      "relatorios": false,
      "admin_usuarios": false,
      "admin_perfis": false,
      "admin_funcionarios": false,
      "admin_hht": false,
      "admin_templates": false,
    }
  }
];

// Lista de permissões disponíveis
const permissoesDisponiveis = [
  { id: "desvios", label: "Desvios" },
  { id: "treinamentos", label: "Treinamentos" },
  { id: "hora_seguranca", label: "Hora da Segurança" },
  { id: "ocorrencias", label: "Ocorrências" },
  { id: "medidas_disciplinares", label: "Medidas Disciplinares" },
  { id: "tarefas", label: "Tarefas" },
  { id: "relatorios", label: "Relatórios" },
  { id: "admin_usuarios", label: "Administrar Usuários" },
  { id: "admin_perfis", label: "Perfis de Acesso" },
  { id: "admin_funcionarios", label: "Cadastro de Funcionários" },
  { id: "admin_hht", label: "Registro de HHT" },
  { id: "admin_templates", label: "Templates de Importação" },
];

const AdminPerfis = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [perfis, setPerfis] = useState(mockPerfis);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPerfil, setSelectedPerfil] = useState<typeof mockPerfis[0] | null>(null);

  // Initialize search form
  const searchForm = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      search: "",
    },
  });

  // Initialize profile form
  const perfilForm = useForm<PerfilFormValues>({
    resolver: zodResolver(perfilFormSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      permissoes: permissoesDisponiveis.reduce((acc, permissao) => {
        acc[permissao.id] = false;
        return acc;
      }, {} as Record<string, boolean>),
    },
  });

  const onSearchSubmit = (data: SearchFormValues) => {
    if (!data.search) {
      setPerfis(mockPerfis);
      return;
    }

    const filteredPerfis = mockPerfis.filter(
      (perfil) => 
        perfil.nome.toLowerCase().includes(data.search!.toLowerCase()) || 
        perfil.descricao.toLowerCase().includes(data.search!.toLowerCase())
    );
    
    setPerfis(filteredPerfis);
  };

  const onPerfilSubmit = (data: PerfilFormValues) => {
    if (selectedPerfil) {
      // Edit existing profile
      const updatedPerfis = perfis.map(perfil => 
        perfil.id === selectedPerfil.id ? { ...perfil, ...data } : perfil
      );
      setPerfis(updatedPerfis);

      toast({
        title: "Perfil atualizado",
        description: `${data.nome} foi atualizado com sucesso.`,
      });
      
      setIsEditDialogOpen(false);
    } else {
      // Create new profile
      const newPerfil = {
        id: perfis.length + 1,
        nome: data.nome,
        descricao: data.descricao,
        permissoes: data.permissoes || {},
      };
      
      setPerfis([...perfis, newPerfil]);
      
      toast({
        title: "Perfil criado",
        description: `${data.nome} foi criado com sucesso.`,
      });
      
      setIsCreateDialogOpen(false);
    }
    
    perfilForm.reset();
  };

  const handleDeletePerfil = () => {
    if (selectedPerfil) {
      const updatedPerfis = perfis.filter(perfil => perfil.id !== selectedPerfil.id);
      setPerfis(updatedPerfis);
      
      toast({
        title: "Perfil excluído",
        description: `${selectedPerfil.nome} foi excluído com sucesso.`,
      });
      
      setIsDeleteDialogOpen(false);
      setSelectedPerfil(null);
    }
  };

  const handleEditClick = (perfil: typeof mockPerfis[0]) => {
    setSelectedPerfil(perfil);
    perfilForm.reset({
      nome: perfil.nome,
      descricao: perfil.descricao,
      permissoes: perfil.permissoes,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (perfil: typeof mockPerfis[0]) => {
    setSelectedPerfil(perfil);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateClick = () => {
    perfilForm.reset({
      nome: "",
      descricao: "",
      permissoes: permissoesDisponiveis.reduce((acc, permissao) => {
        acc[permissao.id] = false;
        return acc;
      }, {} as Record<string, boolean>),
    });
    setSelectedPerfil(null);
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
        <h1 className="text-2xl font-bold tracking-tight">Perfis de Acesso</h1>
        <p className="text-muted-foreground">
          Gerencie os perfis de acesso do sistema
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Perfis</CardTitle>
            <Button size="sm" onClick={handleCreateClick}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Perfil
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
                          placeholder="Buscar perfis..."
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
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {perfis.length > 0 ? (
                  perfis.map((perfil) => (
                    <TableRow key={perfil.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <ShieldCheck className="mr-2 h-4 w-4 text-muted-foreground" />
                          {perfil.nome}
                        </div>
                      </TableCell>
                      <TableCell>{perfil.descricao}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleEditClick(perfil)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleDeleteClick(perfil)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      Nenhum perfil encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Profile Dialog */}
      {(isCreateDialogOpen || isEditDialogOpen) && (
        <Dialog 
          open={isCreateDialogOpen || isEditDialogOpen} 
          onOpenChange={(open) => {
            if (!open) {
              setIsCreateDialogOpen(false);
              setIsEditDialogOpen(false);
            }
          }}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {isCreateDialogOpen ? "Criar Novo Perfil" : "Editar Perfil"}
              </DialogTitle>
              <DialogDescription>
                {isCreateDialogOpen 
                  ? "Preencha as informações para criar um novo perfil."
                  : "Atualize as informações do perfil."
                }
              </DialogDescription>
            </DialogHeader>
            <Form {...perfilForm}>
              <form onSubmit={perfilForm.handleSubmit(onPerfilSubmit)} className="space-y-4">
                <FormField
                  control={perfilForm.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do perfil" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={perfilForm.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input placeholder="Descrição do perfil" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <h4 className="text-sm font-medium mb-3">Permissões</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {permissoesDisponiveis.map((permissao) => (
                      <FormField
                        key={permissao.id}
                        control={perfilForm.control}
                        name={`permissoes.${permissao.id}`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value || false}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="!mt-0">{permissao.label}</FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsCreateDialogOpen(false);
                      setIsEditDialogOpen(false);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {isCreateDialogOpen ? "Criar Perfil" : "Salvar Alterações"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Profile Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Excluir Perfil</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este perfil? Esta ação não poderá ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-4 py-4">
            <div className="bg-muted p-2 rounded-full">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
              <p className="font-medium">{selectedPerfil?.nome}</p>
              <p className="text-sm text-muted-foreground">{selectedPerfil?.descricao}</p>
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
              onClick={handleDeletePerfil}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPerfis;
