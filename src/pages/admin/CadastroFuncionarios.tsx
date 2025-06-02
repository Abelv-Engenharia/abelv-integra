import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Edit, Plus, Upload, UserRound } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Funcionario {
  id: string;
  nome: string;
  funcao: string;
  matricula: string;
  foto?: string;
  ativo: boolean;
  cca_id?: number;
  ccas?: { id: number; codigo: string; nome: string };
}

interface CCA {
  id: number;
  codigo: string;
  nome: string;
}

const CadastroFuncionarios = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFuncionario, setEditingFuncionario] = useState<Funcionario | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    funcao: "",
    matricula: "",
    cca_id: "none"
  });

  // Buscar funcionários
  const { data: funcionarios = [], isLoading: loadingFuncionarios } = useQuery({
    queryKey: ['admin-funcionarios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('funcionarios')
        .select(`
          id,
          nome,
          funcao,
          matricula,
          foto,
          ativo,
          cca_id,
          ccas:cca_id(id, codigo, nome)
        `)
        .order('nome');
      if (error) throw error;
      return data || [];
    }
  });

  // Buscar CCAs
  const { data: ccas = [] } = useQuery({
    queryKey: ['ccas-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ccas')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('codigo');
      if (error) throw error;
      return data || [];
    }
  });

  // Upload de foto para o storage
  const uploadFoto = async (file: File, funcionarioId: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${funcionarioId}.${fileExt}`;
      const filePath = `funcionarios/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('funcionarios-fotos')
        .upload(filePath, file, { 
          upsert: true // Permite substituir a foto existente
        });

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        throw uploadError;
      }

      // Obter URL pública da imagem
      const { data: publicData } = supabase.storage
        .from('funcionarios-fotos')
        .getPublicUrl(filePath);

      return publicData.publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
      return null;
    }
  };

  // Mutation para criar/editar funcionário
  const createFuncionarioMutation = useMutation({
    mutationFn: async (funcionario: { nome: string; funcao: string; matricula: string; cca_id: string }) => {
      const ccaId = funcionario.cca_id === "none" ? null : parseInt(funcionario.cca_id);
      
      if (editingFuncionario) {
        // Atualizar funcionário
        let fotoUrl = editingFuncionario.foto;
        
        // Se há uma nova foto, fazer upload
        if (photoFile) {
          const uploadedUrl = await uploadFoto(photoFile, editingFuncionario.id);
          if (uploadedUrl) {
            fotoUrl = uploadedUrl;
          }
        }

        const { error: updateError } = await supabase
          .from('funcionarios')
          .update({ 
            nome: funcionario.nome, 
            funcao: funcionario.funcao,
            matricula: funcionario.matricula,
            cca_id: ccaId,
            foto: fotoUrl
          })
          .eq('id', editingFuncionario.id);
        
        if (updateError) throw updateError;
      } else {
        // Criar novo funcionário
        const { data: novoFuncionario, error: createError } = await supabase
          .from('funcionarios')
          .insert({ 
            nome: funcionario.nome, 
            funcao: funcionario.funcao,
            matricula: funcionario.matricula,
            cca_id: ccaId
          })
          .select()
          .single();
        
        if (createError) throw createError;

        // Se há foto, fazer upload após criar o funcionário
        if (photoFile && novoFuncionario) {
          const uploadedUrl = await uploadFoto(photoFile, novoFuncionario.id);
          if (uploadedUrl) {
            const { error: updatePhotoError } = await supabase
              .from('funcionarios')
              .update({ foto: uploadedUrl })
              .eq('id', novoFuncionario.id);
            
            if (updatePhotoError) {
              console.error('Erro ao atualizar URL da foto:', updatePhotoError);
            }
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-funcionarios'] });
      toast({
        title: "Sucesso",
        description: editingFuncionario ? "Funcionário atualizado com sucesso!" : "Funcionário criado com sucesso!",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao salvar funcionário",
        variant: "destructive",
      });
      console.error('Erro:', error);
    }
  });

  // Mutation para deletar funcionário
  const deleteFuncionarioMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('funcionarios')
        .update({ ativo: false })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-funcionarios'] });
      toast({
        title: "Sucesso",
        description: "Funcionário desativado com sucesso!",
      });
    }
  });

  const resetForm = () => {
    setFormData({ nome: "", funcao: "", matricula: "", cca_id: "none" });
    setEditingFuncionario(null);
    setPhotoPreview(null);
    setPhotoFile(null);
  };

  const handleEdit = (funcionario: Funcionario) => {
    setEditingFuncionario(funcionario);
    setFormData({
      nome: funcionario.nome,
      funcao: funcionario.funcao,
      matricula: funcionario.matricula,
      cca_id: funcionario.cca_id?.toString() || "none"
    });
    setPhotoPreview(funcionario.foto || null);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createFuncionarioMutation.mutate(formData);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erro",
          description: "Por favor, selecione apenas arquivos de imagem",
          variant: "destructive",
        });
        return;
      }

      // Validar tamanho do arquivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "A imagem deve ter no máximo 5MB",
          variant: "destructive",
        });
        return;
      }

      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Administração de Funcionários</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Funcionário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingFuncionario ? "Editar Funcionário" : "Novo Funcionário"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col items-center sm:items-start mb-6">
                <Label className="mb-2">Foto</Label>
                <Avatar className="size-32 mb-3">
                  <AvatarImage src={photoPreview || ""} />
                  <AvatarFallback>
                    <UserRound className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  >
                    <Upload className="h-4 w-4" />
                    Selecionar imagem
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                  {photoPreview && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setPhotoPreview(null);
                        setPhotoFile(null);
                      }}
                    >
                      Remover
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="funcao">Função</Label>
                  <Input
                    id="funcao"
                    value={formData.funcao}
                    onChange={(e) => setFormData(prev => ({ ...prev, funcao: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="matricula">Matrícula</Label>
                  <Input
                    id="matricula"
                    value={formData.matricula}
                    onChange={(e) => setFormData(prev => ({ ...prev, matricula: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cca">CCA</Label>
                  <Select 
                    value={formData.cca_id} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, cca_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um CCA" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum CCA</SelectItem>
                      {ccas.map((cca) => (
                        <SelectItem key={cca.id} value={cca.id.toString()}>
                          {cca.codigo} - {cca.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createFuncionarioMutation.isPending}>
                  {createFuncionarioMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Funcionários Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingFuncionarios ? (
            <p>Carregando...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-2 text-left">Foto</th>
                    <th className="border border-gray-300 p-2 text-left">Nome</th>
                    <th className="border border-gray-300 p-2 text-left">Função</th>
                    <th className="border border-gray-300 p-2 text-left">Matrícula</th>
                    <th className="border border-gray-300 p-2 text-left">CCA</th>
                    <th className="border border-gray-300 p-2 text-left">Status</th>
                    <th className="border border-gray-300 p-2 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {funcionarios.map((funcionario) => (
                    <tr key={funcionario.id}>
                      <td className="border border-gray-300 p-2">
                        <Avatar className="size-8">
                          <AvatarImage src={funcionario.foto || ""} />
                          <AvatarFallback>
                            <UserRound className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      </td>
                      <td className="border border-gray-300 p-2">{funcionario.nome}</td>
                      <td className="border border-gray-300 p-2">{funcionario.funcao}</td>
                      <td className="border border-gray-300 p-2">{funcionario.matricula}</td>
                      <td className="border border-gray-300 p-2">
                        {funcionario.ccas ? `${funcionario.ccas.codigo} - ${funcionario.ccas.nome}` : "Nenhum"}
                      </td>
                      <td className="border border-gray-300 p-2">
                        <span className={`px-2 py-1 rounded text-xs ${funcionario.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {funcionario.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        <div className="flex justify-center space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(funcionario)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          {funcionario.ativo && (
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => deleteFuncionarioMutation.mutate(funcionario.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CadastroFuncionarios;
