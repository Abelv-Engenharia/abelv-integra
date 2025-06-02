
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Edit, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface Engenheiro {
  id: string;
  nome: string;
  funcao: string;
  matricula: string;
  email: string;
  ativo: boolean;
  engenheiro_ccas?: { ccas: { id: number; codigo: string; nome: string } }[];
}

interface CCA {
  id: number;
  codigo: string;
  nome: string;
}

const AdminEngenheiros = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEngenheiro, setEditingEngenheiro] = useState<Engenheiro | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    funcao: "",
    matricula: "",
    email: "",
    ccaIds: [] as number[]
  });

  // Buscar engenheiros
  const { data: engenheiros = [], isLoading: loadingEngenheiros } = useQuery({
    queryKey: ['admin-engenheiros'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('engenheiros')
        .select(`
          id,
          nome,
          funcao,
          matricula,
          email,
          ativo,
          engenheiro_ccas(
            ccas:cca_id(id, codigo, nome)
          )
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

  // Mutation para criar/editar engenheiro
  const createEngenheiroMutation = useMutation({
    mutationFn: async (engenheiro: { nome: string; funcao: string; matricula: string; email: string; ccaIds: number[] }) => {
      if (editingEngenheiro) {
        // Atualizar engenheiro
        const { error: updateError } = await supabase
          .from('engenheiros')
          .update({ 
            nome: engenheiro.nome, 
            funcao: engenheiro.funcao,
            matricula: engenheiro.matricula,
            email: engenheiro.email
          })
          .eq('id', editingEngenheiro.id);
        
        if (updateError) throw updateError;

        // Remover relacionamentos existentes
        const { error: deleteError } = await supabase
          .from('engenheiro_ccas')
          .delete()
          .eq('engenheiro_id', editingEngenheiro.id);
        
        if (deleteError) throw deleteError;

        // Adicionar novos relacionamentos
        if (engenheiro.ccaIds.length > 0) {
          const { error: insertError } = await supabase
            .from('engenheiro_ccas')
            .insert(engenheiro.ccaIds.map(ccaId => ({ engenheiro_id: editingEngenheiro.id, cca_id: ccaId })));
          
          if (insertError) throw insertError;
        }
      } else {
        // Criar novo engenheiro
        const { data: newEngenheiro, error: createError } = await supabase
          .from('engenheiros')
          .insert({ 
            nome: engenheiro.nome, 
            funcao: engenheiro.funcao,
            matricula: engenheiro.matricula,
            email: engenheiro.email
          })
          .select()
          .single();
        
        if (createError) throw createError;

        // Adicionar relacionamentos com CCAs
        if (engenheiro.ccaIds.length > 0) {
          const { error: insertError } = await supabase
            .from('engenheiro_ccas')
            .insert(engenheiro.ccaIds.map(ccaId => ({ engenheiro_id: newEngenheiro.id, cca_id: ccaId })));
          
          if (insertError) throw insertError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-engenheiros'] });
      toast({
        title: "Sucesso",
        description: editingEngenheiro ? "Engenheiro atualizado com sucesso!" : "Engenheiro criado com sucesso!",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao salvar engenheiro",
        variant: "destructive",
      });
      console.error('Erro:', error);
    }
  });

  // Mutation para deletar engenheiro
  const deleteEngenheiroMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('engenheiros')
        .update({ ativo: false })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-engenheiros'] });
      toast({
        title: "Sucesso",
        description: "Engenheiro desativado com sucesso!",
      });
    }
  });

  const resetForm = () => {
    setFormData({ nome: "", funcao: "", matricula: "", email: "", ccaIds: [] });
    setEditingEngenheiro(null);
  };

  const handleEdit = (engenheiro: Engenheiro) => {
    setEditingEngenheiro(engenheiro);
    setFormData({
      nome: engenheiro.nome,
      funcao: engenheiro.funcao,
      matricula: engenheiro.matricula || "",
      email: engenheiro.email || "",
      ccaIds: engenheiro.engenheiro_ccas?.map(ec => ec.ccas.id) || []
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEngenheiroMutation.mutate(formData);
  };

  const handleCCAChange = (ccaId: number, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({ ...prev, ccaIds: [...prev.ccaIds, ccaId] }));
    } else {
      setFormData(prev => ({ ...prev, ccaIds: prev.ccaIds.filter(id => id !== ccaId) }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Administração de Engenheiros</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Engenheiro
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingEngenheiro ? "Editar Engenheiro" : "Novo Engenheiro"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <div>
                <Label htmlFor="matricula">Matrícula</Label>
                <Input
                  id="matricula"
                  value={formData.matricula}
                  onChange={(e) => setFormData(prev => ({ ...prev, matricula: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label>CCAs Vinculados</Label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto mt-2">
                  {ccas.map((cca) => (
                    <div key={cca.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cca-${cca.id}`}
                        checked={formData.ccaIds.includes(cca.id)}
                        onCheckedChange={(checked) => handleCCAChange(cca.id, checked as boolean)}
                      />
                      <Label htmlFor={`cca-${cca.id}`} className="text-sm">
                        {cca.codigo} - {cca.nome}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createEngenheiroMutation.isPending}>
                  {createEngenheiroMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Engenheiros Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingEngenheiros ? (
            <p>Carregando...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-2 text-left">Nome</th>
                    <th className="border border-gray-300 p-2 text-left">Função</th>
                    <th className="border border-gray-300 p-2 text-left">Matrícula</th>
                    <th className="border border-gray-300 p-2 text-left">Email</th>
                    <th className="border border-gray-300 p-2 text-left">CCAs</th>
                    <th className="border border-gray-300 p-2 text-left">Status</th>
                    <th className="border border-gray-300 p-2 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {engenheiros.map((engenheiro) => (
                    <tr key={engenheiro.id}>
                      <td className="border border-gray-300 p-2">{engenheiro.nome}</td>
                      <td className="border border-gray-300 p-2">{engenheiro.funcao}</td>
                      <td className="border border-gray-300 p-2">{engenheiro.matricula || "-"}</td>
                      <td className="border border-gray-300 p-2">{engenheiro.email || "-"}</td>
                      <td className="border border-gray-300 p-2">
                        {engenheiro.engenheiro_ccas?.map(ec => ec.ccas.codigo).join(", ") || "Nenhum"}
                      </td>
                      <td className="border border-gray-300 p-2">
                        <span className={`px-2 py-1 rounded text-xs ${engenheiro.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {engenheiro.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        <div className="flex justify-center space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(engenheiro)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          {engenheiro.ativo && (
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => deleteEngenheiroMutation.mutate(engenheiro.id)}
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

export default AdminEngenheiros;
