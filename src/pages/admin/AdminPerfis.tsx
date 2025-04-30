
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PencilIcon, PlusCircle, Search, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchPerfis, createPerfil, updatePerfil, deletePerfil, type Perfil, type Permissoes } from "@/services/perfisService";

// Permission groups for UI organization
const permissionGroups = [
  {
    name: "Gestão de SMS",
    permissions: [
      { id: "desvios", label: "Desvios" },
      { id: "treinamentos", label: "Treinamentos" },
      { id: "hora_seguranca", label: "Hora da Segurança" },
      { id: "ocorrencias", label: "Ocorrências" },
      { id: "medidas_disciplinares", label: "Medidas Disciplinares" },
    ]
  },
  {
    name: "Tarefas",
    permissions: [
      { id: "tarefas", label: "Tarefas" },
    ]
  },
  {
    name: "Relatórios",
    permissions: [
      { id: "relatorios", label: "Relatórios" },
    ]
  },
  {
    name: "Administração",
    permissions: [
      { id: "admin_usuarios", label: "Usuários" },
      { id: "admin_perfis", label: "Perfis de Acesso" },
      { id: "admin_funcionarios", label: "Funcionários" },
      { id: "admin_hht", label: "Registro HHT" },
      { id: "admin_templates", label: "Templates" },
    ]
  }
];

const formSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  descricao: z.string().optional(),
  permissoes: z.object({
    desvios: z.boolean().default(false),
    treinamentos: z.boolean().default(false),
    hora_seguranca: z.boolean().default(false),
    ocorrencias: z.boolean().default(false),
    medidas_disciplinares: z.boolean().default(false),
    tarefas: z.boolean().default(false),
    relatorios: z.boolean().default(false),
    admin_usuarios: z.boolean().default(false),
    admin_perfis: z.boolean().default(false),
    admin_funcionarios: z.boolean().default(false),
    admin_hht: z.boolean().default(false),
    admin_templates: z.boolean().default(false),
  })
});

const AdminPerfis = () => {
  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPerfil, setCurrentPerfil] = useState<Perfil | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      permissoes: {
        desvios: false,
        treinamentos: false,
        hora_seguranca: false,
        ocorrencias: false,
        medidas_disciplinares: false,
        tarefas: false,
        relatorios: false,
        admin_usuarios: false,
        admin_perfis: false,
        admin_funcionarios: false,
        admin_hht: false,
        admin_templates: false,
      }
    }
  });

  // Fetch profiles from Supabase
  useEffect(() => {
    const loadPerfis = async () => {
      setIsLoading(true);
      try {
        const data = await fetchPerfis();
        setPerfis(data);
      } catch (error) {
        console.error("Erro ao carregar perfis:", error);
        toast({
          title: "Erro ao carregar perfis",
          description: "Não foi possível carregar os perfis de acesso.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPerfis();
  }, [toast]);

  const filteredPerfis = perfis.filter(perfil => 
    perfil.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (perfil.descricao && perfil.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (isAddDialogOpen) {
        // Add new profile
        setIsLoading(true);
        const newPerfil = await createPerfil({
          nome: data.nome,
          descricao: data.descricao || "",
          permissoes: data.permissoes
        });
        
        if (newPerfil) {
          setPerfis([...perfis, newPerfil]);
          toast({
            title: "Perfil criado",
            description: `O perfil ${data.nome} foi criado com sucesso.`
          });
        }
        setIsAddDialogOpen(false);
      } else if (isEditDialogOpen && currentPerfil) {
        // Edit existing profile
        setIsLoading(true);
        const success = await updatePerfil(currentPerfil.id, {
          nome: data.nome,
          descricao: data.descricao || "",
          permissoes: data.permissoes
        });
        
        if (success) {
          setPerfis(perfis.map(perfil => 
            perfil.id === currentPerfil.id 
              ? { 
                  ...perfil, 
                  nome: data.nome, 
                  descricao: data.descricao || "", 
                  permissoes: data.permissoes
                }
              : perfil
          ));
          toast({
            title: "Perfil atualizado",
            description: `O perfil ${data.nome} foi atualizado com sucesso.`
          });
        }
        setIsEditDialogOpen(false);
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao processar o perfil.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (currentPerfil) {
      try {
        setIsLoading(true);
        const success = await deletePerfil(currentPerfil.id);
        
        if (success) {
          setPerfis(perfis.filter(perfil => perfil.id !== currentPerfil.id));
          toast({
            title: "Perfil excluído",
            description: `O perfil ${currentPerfil.nome} foi excluído com sucesso.`
          });
          setIsDeleteDialogOpen(false);
          setCurrentPerfil(null);
        }
      } catch (error: any) {
        toast({
          title: "Erro ao excluir",
          description: error.message || "Não foi possível excluir o perfil.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const openEditDialog = (perfil: Perfil) => {
    setCurrentPerfil(perfil);
    form.reset({
      nome: perfil.nome,
      descricao: perfil.descricao,
      permissoes: { ...perfil.permissoes }
    });
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (perfil: Perfil) => {
    setCurrentPerfil(perfil);
    setIsDeleteDialogOpen(true);
  };
  
  const openAddDialog = () => {
    form.reset({
      nome: "",
      descricao: "",
      permissoes: {
        desvios: false,
        treinamentos: false,
        hora_seguranca: false,
        ocorrencias: false,
        medidas_disciplinares: false,
        tarefas: false,
        relatorios: false,
        admin_usuarios: false,
        admin_perfis: false,
        admin_funcionarios: false,
        admin_hht: false,
        admin_templates: false,
      }
    });
    setIsAddDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Perfis de Acesso</h2>
        <p className="text-muted-foreground">
          Gerenciamento de perfis de acesso e permissões.
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar perfis..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={openAddDialog}>
          <PlusCircle className="mr-2 h-4 w-4" /> Novo Perfil
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Perfis de Acesso</CardTitle>
          <CardDescription>
            Lista de perfis de acesso e suas permissões
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Permissões</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Carregando perfis...
                  </TableCell>
                </TableRow>
              ) : filteredPerfis.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Nenhum perfil encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPerfis.map((perfil) => (
                  <TableRow key={perfil.id}>
                    <TableCell className="font-medium">{perfil.nome}</TableCell>
                    <TableCell>{perfil.descricao}</TableCell>
                    <TableCell>
                      {Object.entries(perfil.permissoes).filter(([_, value]) => value).length} permissões
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(perfil)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(perfil)}
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
        </CardContent>
      </Card>
      
      {/* Formulário para adicionar/editar perfil */}
      <Dialog 
        open={isAddDialogOpen || isEditDialogOpen} 
        onOpenChange={(open) => open ? null : (isAddDialogOpen ? setIsAddDialogOpen(false) : setIsEditDialogOpen(false))}
      >
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {isAddDialogOpen ? "Adicionar novo perfil" : "Editar perfil"}
            </DialogTitle>
            <DialogDescription>
              {isAddDialogOpen
                ? "Crie um novo perfil de acesso e defina suas permissões."
                : "Atualize as informações e permissões deste perfil."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1 overflow-hidden">
              <Tabs defaultValue="informacoes" className="w-full h-full">
                <TabsList>
                  <TabsTrigger value="informacoes">Informações</TabsTrigger>
                  <TabsTrigger value="permissoes">Permissões</TabsTrigger>
                </TabsList>
                
                <TabsContent value="informacoes" className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Perfil</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="descricao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="permissoes" className="space-y-4 mt-4 max-h-[400px]">
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-6">
                      {permissionGroups.map((group) => (
                        <div key={group.name} className="space-y-4">
                          <h3 className="font-medium text-sm">{group.name}</h3>
                          <Separator />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {group.permissions.map((permission) => (
                              <FormField
                                key={permission.id}
                                control={form.control}
                                name={`permissoes.${permission.id}` as "permissoes.desvios" | "permissoes.treinamentos" | "permissoes.hora_seguranca" | 
                                      "permissoes.ocorrencias" | "permissoes.medidas_disciplinares" | "permissoes.tarefas" | "permissoes.relatorios" | 
                                      "permissoes.admin_usuarios" | "permissoes.admin_perfis" | "permissoes.admin_funcionarios" | 
                                      "permissoes.admin_hht" | "permissoes.admin_templates"}
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                      <Checkbox 
                                        checked={Boolean(field.value)} 
                                        onCheckedChange={field.onChange} 
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="cursor-pointer">
                                        {permission.label}
                                      </FormLabel>
                                      <FormDescription>
                                        Permissão para {permission.label.toLowerCase()}
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button" disabled={isLoading}>Cancelar</Button>
                </DialogClose>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Processando..." : isAddDialogOpen ? "Criar Perfil" : "Salvar Alterações"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Dialog de confirmação para exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o perfil{" "}
              <span className="font-medium">{currentPerfil?.nome}</span>?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isLoading}>Cancelar</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "Processando..." : "Sim, excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPerfis;
