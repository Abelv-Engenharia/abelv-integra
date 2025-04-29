
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, ChevronDown, Edit, Pencil, Plus, Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Perfil, Permissoes } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";

// Schema for profile creation/editing
const perfilSchema = z.object({
  nome: z.string().min(1, { message: "Nome é obrigatório" }),
  descricao: z.string().optional(),
  permissoes: z.object({
    desvios: z.boolean().default(true),
    tarefas: z.boolean().default(true),
    admin_hht: z.boolean().default(false),
    relatorios: z.boolean().default(true),
    ocorrencias: z.boolean().default(true),
    admin_perfis: z.boolean().default(false),
    treinamentos: z.boolean().default(true),
    admin_usuarios: z.boolean().default(false),
    hora_seguranca: z.boolean().default(true),
    admin_templates: z.boolean().default(false),
    admin_funcionarios: z.boolean().default(false),
    medidas_disciplinares: z.boolean().default(true),
  })
});

type PerfilFormData = z.infer<typeof perfilSchema>;

// Mapping for permission display names
const permissionLabels: Record<keyof Permissoes, string> = {
  desvios: "Desvios",
  tarefas: "Tarefas",
  admin_hht: "Admin HHT",
  relatorios: "Relatórios",
  ocorrencias: "Ocorrências",
  admin_perfis: "Admin Perfis",
  treinamentos: "Treinamentos",
  admin_usuarios: "Admin Usuários",
  hora_seguranca: "Hora Segurança",
  admin_templates: "Admin Templates",
  admin_funcionarios: "Admin Funcionários",
  medidas_disciplinares: "Medidas Disciplinares",
};

// Group permissions for better display
const permissionGroups = [
  {
    title: "Módulos Gerais",
    permissions: ["desvios", "tarefas", "ocorrencias", "relatorios", "treinamentos", "hora_seguranca", "medidas_disciplinares"]
  },
  {
    title: "Módulos Administrativos",
    permissions: ["admin_hht", "admin_perfis", "admin_usuarios", "admin_templates", "admin_funcionarios"]
  },
];

const AdminPerfis = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isTableExpanded, setIsTableExpanded] = useState(false);

  const form = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      permissoes: {
        desvios: true,
        tarefas: true,
        admin_hht: false,
        relatorios: true,
        ocorrencias: true,
        admin_perfis: false,
        treinamentos: true,
        admin_usuarios: false,
        hora_seguranca: true,
        admin_templates: false,
        admin_funcionarios: false,
        medidas_disciplinares: true,
      }
    }
  });
  
  // Fetch all profiles
  const fetchPerfis = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('perfis')
        .select('*')
        .order('nome');
        
      if (error) {
        throw error;
      }
      
      setPerfis(data || []);
    } catch (error) {
      console.error('Error fetching perfis:', error);
      toast({
        title: "Erro ao carregar perfis",
        description: "Não foi possível carregar os perfis. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Edit existing profile
  const handleEdit = (perfil: Perfil) => {
    form.reset({
      nome: perfil.nome,
      descricao: perfil.descricao || "",
      permissoes: perfil.permissoes
    });
    setEditingId(perfil.id);
    setIsCreating(false);
  };
  
  // Start creating new profile
  const handleCreateNew = () => {
    form.reset({
      nome: "",
      descricao: "",
      permissoes: {
        desvios: true,
        tarefas: true,
        admin_hht: false,
        relatorios: true,
        ocorrencias: true,
        admin_perfis: false,
        treinamentos: true,
        admin_usuarios: false,
        hora_seguranca: true,
        admin_templates: false,
        admin_funcionarios: false,
        medidas_disciplinares: true,
      }
    });
    setEditingId(null);
    setIsCreating(true);
  };
  
  // Cancel edit/create
  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
  };
  
  // Delete profile
  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este perfil?")) return;
    
    try {
      const { error } = await supabase
        .from('perfis')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Perfil excluído",
        description: "O perfil foi excluído com sucesso.",
      });
      
      // Refresh data
      fetchPerfis();
    } catch (error) {
      console.error('Error deleting perfil:', error);
      toast({
        title: "Erro ao excluir perfil",
        description: "Não foi possível excluir o perfil. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };
  
  // Save profile (create or update)
  const onSubmit = async (data: PerfilFormData) => {
    try {
      if (isCreating) {
        // Create new profile
        const { error } = await supabase
          .from('perfis')
          .insert({
            nome: data.nome,
            descricao: data.descricao,
            permissoes: data.permissoes
          });
          
        if (error) {
          throw error;
        }
        
        toast({
          title: "Perfil criado",
          description: "O novo perfil foi criado com sucesso.",
        });
      } else if (editingId !== null) {
        // Update existing profile
        const { error } = await supabase
          .from('perfis')
          .update({
            nome: data.nome,
            descricao: data.descricao,
            permissoes: data.permissoes
          })
          .eq('id', editingId);
          
        if (error) {
          throw error;
        }
        
        toast({
          title: "Perfil atualizado",
          description: "O perfil foi atualizado com sucesso.",
        });
      }
      
      // Reset state and refresh data
      setIsCreating(false);
      setEditingId(null);
      fetchPerfis();
    } catch (error) {
      console.error('Error saving perfil:', error);
      toast({
        title: "Erro ao salvar perfil",
        description: "Não foi possível salvar o perfil. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPerfis();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Perfis</h2>
          <p className="text-muted-foreground">
            Crie e edite perfis de usuários do sistema
          </p>
        </div>
        <Button onClick={handleCreateNew} disabled={isCreating || editingId !== null}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Perfil
        </Button>
      </div>
      
      {/* Form for creating/editing profile */}
      {(isCreating || editingId !== null) && (
        <Card>
          <CardHeader className="font-bold">
            {isCreating ? "Criar Novo Perfil" : "Editar Perfil"}
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Perfil</Label>
                  <Input
                    id="nome"
                    placeholder="Nome do perfil"
                    {...form.register("nome")}
                  />
                  {form.formState.errors.nome && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.nome.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input
                    id="descricao"
                    placeholder="Descrição do perfil"
                    {...form.register("descricao")}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Permissões</h3>
                
                {permissionGroups.map((group) => (
                  <div key={group.title} className="space-y-2">
                    <h4 className="text-md font-medium border-b pb-1">{group.title}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {group.permissions.map((perm) => (
                        <div key={perm} className="flex items-center space-x-2">
                          <Controller
                            name={`permissoes.${perm}` as any}
                            control={form.control}
                            render={({ field }) => (
                              <Checkbox
                                id={`perm-${perm}`}
                                checked={field.value}
                                onCheckedChange={(checked) => field.onChange(checked)}
                              />
                            )}
                          />
                          <Label 
                            htmlFor={`perm-${String(perm)}`} 
                            className="text-sm font-normal"
                          >
                            {permissionLabels[perm as keyof Permissoes]}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" type="button" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {isCreating ? "Criar Perfil" : "Salvar Alterações"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Table with all profiles */}
      <Card>
        <CardHeader className="border-b pb-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Perfis de Usuários</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTableExpanded(!isTableExpanded)}
            >
              {isTableExpanded ? "Ocultar Detalhes" : "Mostrar Detalhes"}
              <ChevronDown
                className={`ml-1 h-4 w-4 transition-transform ${
                  isTableExpanded ? "rotate-180" : ""
                }`}
              />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 text-sm">
                  <tr>
                    <th className="px-4 py-3 text-left">Nome</th>
                    <th className="px-4 py-3 text-left">Descrição</th>
                    {isTableExpanded && (
                      <th className="px-4 py-3 text-left">Permissões</th>
                    )}
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {perfis.length === 0 ? (
                    <tr>
                      <td
                        colSpan={isTableExpanded ? 4 : 3}
                        className="px-4 py-3 text-center text-muted-foreground"
                      >
                        Nenhum perfil encontrado
                      </td>
                    </tr>
                  ) : (
                    perfis.map((perfil) => (
                      <tr key={perfil.id} className="border-b hover:bg-muted/20">
                        <td className="px-4 py-3 font-medium">{perfil.nome}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {perfil.descricao || "-"}
                        </td>
                        {isTableExpanded && (
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(perfil.permissoes)
                                .filter(([_, value]) => value)
                                .map(([key]) => (
                                  <span
                                    key={key}
                                    className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                                  >
                                    {permissionLabels[key as keyof Permissoes]}
                                  </span>
                                ))}
                            </div>
                          </td>
                        )}
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(perfil)}
                              disabled={isCreating || editingId !== null}
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(perfil.id)}
                              disabled={isCreating || editingId !== null}
                            >
                              <Trash className="h-4 w-4 text-destructive" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPerfis;
