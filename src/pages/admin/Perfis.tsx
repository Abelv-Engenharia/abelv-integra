import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Search, Shield } from "lucide-react";
import { AdminSistemaGuard } from "@/components/security/AdminSistemaGuard";
import { COMPLETE_PERMISSIONS } from "@/services/permissionsService";

interface Perfil {
  id: number;
  nome: string;
  descricao: string | null;
  telas_liberadas: string[];
}

export default function Perfis() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPerfil, setEditingPerfil] = useState<Perfil | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    telas_liberadas: [] as string[]
  });

  // Buscar todos os perfis
  const { data: perfis = [], isLoading } = useQuery({
    queryKey: ['perfis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('perfis')
        .select('*')
        .order('nome');
      
      if (error) throw error;
      return data as Perfil[];
    }
  });

  // Mutation para criar perfil
  const createPerfil = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('perfis')
        .insert({
          nome: data.nome,
          descricao: data.descricao || null,
          telas_liberadas: data.telas_liberadas
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfis'] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Perfil criado",
        description: "O perfil foi criado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar perfil",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation para atualizar perfil
  const updatePerfil = useMutation({
    mutationFn: async (data: typeof formData & { id: number }) => {
      const { error } = await supabase
        .from('perfis')
        .update({
          nome: data.nome,
          descricao: data.descricao || null,
          telas_liberadas: data.telas_liberadas
        })
        .eq('id', data.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfis'] });
      setIsDialogOpen(false);
      setEditingPerfil(null);
      resetForm();
      toast({
        title: "Perfil atualizado",
        description: "O perfil foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation para excluir perfil
  const deletePerfil = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('perfis')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfis'] });
      toast({
        title: "Perfil excluído",
        description: "O perfil foi excluído com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir perfil",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({ nome: "", descricao: "", telas_liberadas: [] });
    setEditingPerfil(null);
  };

  const handleOpenDialog = (perfil?: Perfil) => {
    if (perfil) {
      setEditingPerfil(perfil);
      setFormData({
        nome: perfil.nome,
        descricao: perfil.descricao || "",
        telas_liberadas: perfil.telas_liberadas || []
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPerfil) {
      updatePerfil.mutate({ ...formData, id: editingPerfil.id });
    } else {
      createPerfil.mutate(formData);
    }
  };

  const togglePermission = (permissionKey: string) => {
    setFormData(prev => ({
      ...prev,
      telas_liberadas: prev.telas_liberadas.includes(permissionKey)
        ? prev.telas_liberadas.filter(p => p !== permissionKey)
        : [...prev.telas_liberadas, permissionKey]
    }));
  };

  const toggleCategoryPermissions = (categoryName: string) => {
    const category = COMPLETE_PERMISSIONS.find(c => c.name === categoryName);
    if (!category) return;

    const categoryPermissions = category.permissions.map(p => p.key);
    const allSelected = categoryPermissions.every(p => formData.telas_liberadas.includes(p));

    setFormData(prev => ({
      ...prev,
      telas_liberadas: allSelected
        ? prev.telas_liberadas.filter(p => !categoryPermissions.includes(p))
        : [...new Set([...prev.telas_liberadas, ...categoryPermissions])]
    }));
  };

  const filteredPerfis = perfis.filter(perfil =>
    perfil.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminSistemaGuard>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gerenciamento de Perfis</h1>
            <p className="text-muted-foreground">
              Crie e gerencie perfis de acesso para usuários
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Perfil
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPerfil ? "Editar Perfil" : "Novo Perfil"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nome">Nome do Perfil *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                      required
                      placeholder="Ex: Gerente de Obra"
                    />
                  </div>
                  <div>
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      value={formData.descricao}
                      onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                      placeholder="Descreva as responsabilidades deste perfil"
                    />
                  </div>
                  <div>
                    <Label>Telas Liberadas ({formData.telas_liberadas.length})</Label>
                    <div className="mt-4 space-y-4 border rounded-lg p-4">
                      {COMPLETE_PERMISSIONS.map((category) => {
                        const categoryPermissions = category.permissions.map(p => p.key);
                        const allSelected = categoryPermissions.every(p => formData.telas_liberadas.includes(p));
                        const someSelected = categoryPermissions.some(p => formData.telas_liberadas.includes(p));

                        return (
                          <div key={category.name} className="space-y-2">
                            <div className="flex items-center space-x-2 font-semibold">
                              <Checkbox
                                checked={allSelected}
                                onCheckedChange={() => toggleCategoryPermissions(category.name)}
                                className={someSelected && !allSelected ? "opacity-50" : ""}
                              />
                              <Label className="cursor-pointer" onClick={() => toggleCategoryPermissions(category.name)}>
                                {category.name}
                              </Label>
                            </div>
                            <div className="ml-6 grid grid-cols-2 gap-2">
                              {category.permissions.map((permission) => (
                                <div key={permission.key} className="flex items-center space-x-2">
                                  <Checkbox
                                    checked={formData.telas_liberadas.includes(permission.key)}
                                    onCheckedChange={() => togglePermission(permission.key)}
                                  />
                                  <Label className="cursor-pointer text-sm" onClick={() => togglePermission(permission.key)}>
                                    {permission.label}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createPerfil.isPending || updatePerfil.isPending}>
                    {editingPerfil ? "Salvar Alterações" : "Criar Perfil"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar perfil..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : (
          <div className="grid gap-4">
            {filteredPerfis.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  Nenhum perfil encontrado
                </CardContent>
              </Card>
            ) : (
              filteredPerfis.map((perfil) => (
                <Card key={perfil.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          {perfil.nome}
                        </CardTitle>
                        <CardDescription>{perfil.descricao}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(perfil)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (confirm("Tem certeza que deseja excluir este perfil?")) {
                              deletePerfil.mutate(perfil.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <p className="text-sm font-medium mb-2">
                        Telas Liberadas ({perfil.telas_liberadas?.length || 0})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {perfil.telas_liberadas?.slice(0, 10).map((tela) => (
                          <Badge key={tela} variant="secondary" className="text-xs">
                            {tela}
                          </Badge>
                        ))}
                        {perfil.telas_liberadas?.length > 10 && (
                          <Badge variant="outline" className="text-xs">
                            +{perfil.telas_liberadas.length - 10} mais
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </AdminSistemaGuard>
  );
}
