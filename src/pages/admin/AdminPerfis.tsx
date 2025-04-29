
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Pencil, Plus, Save, Trash, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Permissoes } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";

// Define the shape of our perfil (role) data
interface PerfilData {
  id: number;
  nome: string;
  descricao: string;
  permissoes: Permissoes;
}

// Mock data - would be replaced with actual Supabase data
const mockPerfis: PerfilData[] = [
  {
    id: 1,
    nome: "Administrador",
    descricao: "Acesso total ao sistema",
    permissoes: {
      desvios: true,
      treinamentos: true,
      ocorrencias: true,
      tarefas: true,
      relatorios: true,
      hora_seguranca: true,
      medidas_disciplinares: true,
      admin_usuarios: true,
      admin_perfis: true,
      admin_funcionarios: true,
      admin_hht: true,
      admin_templates: true,
    }
  },
  {
    id: 2,
    nome: "Supervisor",
    descricao: "Acesso de supervisão",
    permissoes: {
      desvios: true,
      treinamentos: true,
      ocorrencias: true,
      tarefas: true,
      relatorios: true,
      hora_seguranca: true,
      medidas_disciplinares: true,
      admin_usuarios: false,
      admin_perfis: false,
      admin_funcionarios: true,
      admin_hht: true,
      admin_templates: false,
    }
  },
  {
    id: 3,
    nome: "Técnico",
    descricao: "Acesso operacional",
    permissoes: {
      desvios: true,
      treinamentos: true,
      ocorrencias: true,
      tarefas: true,
      relatorios: false,
      hora_seguranca: true,
      medidas_disciplinares: false,
      admin_usuarios: false,
      admin_perfis: false,
      admin_funcionarios: false,
      admin_hht: false,
      admin_templates: false,
    }
  },
];

const AdminPerfis = () => {
  const [perfis, setPerfis] = useState<PerfilData[]>(mockPerfis);
  const [editing, setEditing] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<PerfilData, "id">>({
    nome: "",
    descricao: "",
    permissoes: {
      desvios: true,
      treinamentos: true,
      ocorrencias: true,
      tarefas: true,
      relatorios: true,
      hora_seguranca: true,
      medidas_disciplinares: true,
      admin_usuarios: false,
      admin_perfis: false,
      admin_funcionarios: false,
      admin_hht: false,
      admin_templates: false,
    }
  });

  useEffect(() => {
    // This would be replaced with a Supabase fetch
    // Example: 
    // const fetchPerfis = async () => {
    //   const { data, error } = await supabase.from('perfis').select('*');
    //   if (error) {
    //     toast({
    //       title: "Erro ao carregar perfis",
    //       description: error.message,
    //       variant: "destructive"
    //     });
    //   } else {
    //     setPerfis(data);
    //   }
    // };
    // fetchPerfis();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePermissionChange = (permission: keyof Permissoes, value: boolean) => {
    setFormData({
      ...formData,
      permissoes: {
        ...formData.permissoes,
        [permission]: value,
      },
    });
  };

  const handleEditPermissionChange = (id: number, permission: keyof Permissoes, value: boolean) => {
    setPerfis(
      perfis.map((perfil) =>
        perfil.id === id
          ? {
              ...perfil,
              permissoes: {
                ...perfil.permissoes,
                [permission]: value,
              },
            }
          : perfil
      )
    );
  };

  const handleEditInputChange = (
    id: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPerfis(
      perfis.map((perfil) =>
        perfil.id === id
          ? {
              ...perfil,
              [name]: value,
            }
          : perfil
      )
    );
  };

  const handleAddPerfil = () => {
    if (!formData.nome.trim()) {
      toast({
        title: "Erro ao adicionar perfil",
        description: "O nome do perfil é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    // This would be replaced with a Supabase insert
    // Example:
    // const addPerfil = async () => {
    //   const { data, error } = await supabase.from('perfis').insert([formData]).select();
    //   if (error) {
    //     toast({
    //       title: "Erro ao adicionar perfil",
    //       description: error.message,
    //       variant: "destructive"
    //     });
    //   } else {
    //     setPerfis([...perfis, data[0]]);
    //     setDialogOpen(false);
    //     setFormData({
    //       nome: "",
    //       descricao: "",
    //       permissoes: {
    //         ...formData.permissoes
    //       }
    //     });
    //     toast({
    //       title: "Perfil adicionado",
    //       description: "O perfil foi adicionado com sucesso.",
    //     });
    //   }
    // };
    // addPerfil();

    // For now, simulating with mock data
    const newPerfil: PerfilData = {
      id: perfis.length + 1,
      ...formData,
    };

    setPerfis([...perfis, newPerfil]);
    setDialogOpen(false);
    setFormData({
      nome: "",
      descricao: "",
      permissoes: {
        desvios: true,
        treinamentos: true,
        ocorrencias: true,
        tarefas: true,
        relatorios: true,
        hora_seguranca: true,
        medidas_disciplinares: true,
        admin_usuarios: false,
        admin_perfis: false,
        admin_funcionarios: false,
        admin_hht: false,
        admin_templates: false,
      }
    });

    toast({
      title: "Perfil adicionado",
      description: "O perfil foi adicionado com sucesso.",
    });
  };

  const handleSaveEdit = (id: number) => {
    // This would be replaced with a Supabase update
    // Example:
    // const updatePerfil = async () => {
    //   const perfilToUpdate = perfis.find(perfil => perfil.id === id);
    //   const { error } = await supabase.from('perfis').update(perfilToUpdate).eq('id', id);
    //   if (error) {
    //     toast({
    //       title: "Erro ao atualizar perfil",
    //       description: error.message,
    //       variant: "destructive"
    //     });
    //   } else {
    //     setEditing(null);
    //     toast({
    //       title: "Perfil atualizado",
    //       description: "O perfil foi atualizado com sucesso.",
    //     });
    //   }
    // };
    // updatePerfil();

    // For now, just simulate
    setEditing(null);
    toast({
      title: "Perfil atualizado",
      description: "O perfil foi atualizado com sucesso.",
    });
  };

  const handleDeletePerfil = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este perfil?")) {
      // This would be replaced with a Supabase delete
      // Example:
      // const deletePerfil = async () => {
      //   const { error } = await supabase.from('perfis').delete().eq('id', id);
      //   if (error) {
      //     toast({
      //       title: "Erro ao excluir perfil",
      //       description: error.message,
      //       variant: "destructive"
      //     });
      //   } else {
      //     setPerfis(perfis.filter((perfil) => perfil.id !== id));
      //     toast({
      //       title: "Perfil excluído",
      //       description: "O perfil foi excluído com sucesso.",
      //     });
      //   }
      // };
      // deletePerfil();

      // For now, just simulate
      setPerfis(perfis.filter((perfil) => perfil.id !== id));
      toast({
        title: "Perfil excluído",
        description: "O perfil foi excluído com sucesso.",
      });
    }
  };

  // Helper function to render checkbox
  const renderCheckbox = (
    label: string,
    permissionKey: keyof Permissoes,
    isChecked: boolean,
    onChange: (value: boolean) => void
  ) => (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id={`perm-${permissionKey}`} 
        checked={isChecked} 
        onCheckedChange={onChange} 
      />
      <label 
        htmlFor={`perm-${permissionKey}`}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Perfis de Acesso</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Perfil
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Perfil</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome do Perfil</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Ex: Gestor, Supervisor, etc."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  placeholder="Descreva brevemente o propósito deste perfil"
                />
              </div>
              <div className="grid gap-2">
                <Label>Permissões</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border rounded-md p-4">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Módulos</h4>
                    {renderCheckbox(
                      "Desvios",
                      "desvios",
                      formData.permissoes.desvios,
                      (value) => handlePermissionChange("desvios", value)
                    )}
                    {renderCheckbox(
                      "Treinamentos",
                      "treinamentos",
                      formData.permissoes.treinamentos,
                      (value) => handlePermissionChange("treinamentos", value)
                    )}
                    {renderCheckbox(
                      "Ocorrências",
                      "ocorrencias",
                      formData.permissoes.ocorrencias,
                      (value) => handlePermissionChange("ocorrencias", value)
                    )}
                    {renderCheckbox(
                      "Tarefas",
                      "tarefas",
                      formData.permissoes.tarefas,
                      (value) => handlePermissionChange("tarefas", value)
                    )}
                    {renderCheckbox(
                      "Relatórios",
                      "relatorios",
                      formData.permissoes.relatorios,
                      (value) => handlePermissionChange("relatorios", value)
                    )}
                    {renderCheckbox(
                      "Hora da Segurança",
                      "hora_seguranca",
                      formData.permissoes.hora_seguranca,
                      (value) => handlePermissionChange("hora_seguranca", value)
                    )}
                    {renderCheckbox(
                      "Medidas Disciplinares",
                      "medidas_disciplinares",
                      formData.permissoes.medidas_disciplinares,
                      (value) => handlePermissionChange("medidas_disciplinares", value)
                    )}
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Administração</h4>
                    {renderCheckbox(
                      "Gerenciar Usuários",
                      "admin_usuarios",
                      formData.permissoes.admin_usuarios,
                      (value) => handlePermissionChange("admin_usuarios", value)
                    )}
                    {renderCheckbox(
                      "Gerenciar Perfis",
                      "admin_perfis",
                      formData.permissoes.admin_perfis,
                      (value) => handlePermissionChange("admin_perfis", value)
                    )}
                    {renderCheckbox(
                      "Cadastro de Funcionários",
                      "admin_funcionarios",
                      formData.permissoes.admin_funcionarios,
                      (value) => handlePermissionChange("admin_funcionarios", value)
                    )}
                    {renderCheckbox(
                      "Registro de HHT",
                      "admin_hht",
                      formData.permissoes.admin_hht,
                      (value) => handlePermissionChange("admin_hht", value)
                    )}
                    {renderCheckbox(
                      "Templates de Importação",
                      "admin_templates",
                      formData.permissoes.admin_templates,
                      (value) => handlePermissionChange("admin_templates", value)
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddPerfil}>Adicionar Perfil</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perfis Cadastrados</CardTitle>
          <CardDescription>
            Gerencie os perfis de acesso ao sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {perfis.map((perfil) => (
              <Card key={perfil.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
                    <div>
                      {editing === perfil.id ? (
                        <Input
                          name="nome"
                          value={perfil.nome}
                          onChange={(e) => handleEditInputChange(perfil.id, e)}
                          className="font-medium w-full max-w-[300px]"
                        />
                      ) : (
                        <h3 className="font-medium">{perfil.nome}</h3>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {editing === perfil.id ? (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditing(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleSaveEdit(perfil.id)}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditing(perfil.id)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeletePerfil(perfil.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    {editing === perfil.id ? (
                      <Textarea
                        name="descricao"
                        value={perfil.descricao}
                        onChange={(e) => handleEditInputChange(perfil.id, e)}
                        className="w-full"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {perfil.descricao}
                      </p>
                    )}

                    <div>
                      <h4 className="text-sm font-medium mb-2">Permissões:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.entries(perfil.permissoes).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center space-x-2"
                          >
                            {editing === perfil.id ? (
                              <Checkbox
                                id={`perm-${perfil.id}-${key}`}
                                checked={value}
                                onCheckedChange={(checked) =>
                                  handleEditPermissionChange(
                                    perfil.id,
                                    key as keyof Permissoes,
                                    checked as boolean
                                  )
                                }
                              />
                            ) : (
                              <div
                                className={`h-4 w-4 rounded border flex items-center justify-center ${
                                  value
                                    ? "bg-primary border-primary"
                                    : "bg-background border-input"
                                }`}
                              >
                                {value && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-3 w-3 text-primary-foreground"
                                  >
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                )}
                              </div>
                            )}
                            <label
                              htmlFor={`perm-${perfil.id}-${key}`}
                              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {key
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (char) => char.toUpperCase())}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPerfis;
