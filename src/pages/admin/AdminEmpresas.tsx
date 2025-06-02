
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

interface Empresa {
  id: number;
  nome: string;
  cnpj: string;
  ativo: boolean;
  empresa_ccas?: { ccas: { id: number; codigo: string; nome: string } }[];
}

interface CCA {
  id: number;
  codigo: string;
  nome: string;
}

const AdminEmpresas = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    ccaIds: [] as number[]
  });

  // Buscar empresas
  const { data: empresas = [], isLoading: loadingEmpresas } = useQuery({
    queryKey: ['admin-empresas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('empresas')
        .select(`
          id,
          nome,
          cnpj,
          ativo,
          empresa_ccas(
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

  // Mutation para criar/editar empresa
  const createEmpresaMutation = useMutation({
    mutationFn: async (empresa: { nome: string; cnpj: string; ccaIds: number[] }) => {
      if (editingEmpresa) {
        // Atualizar empresa
        const { error: updateError } = await supabase
          .from('empresas')
          .update({ nome: empresa.nome, cnpj: empresa.cnpj })
          .eq('id', editingEmpresa.id);
        
        if (updateError) throw updateError;

        // Remover relacionamentos existentes
        const { error: deleteError } = await supabase
          .from('empresa_ccas')
          .delete()
          .eq('empresa_id', editingEmpresa.id);
        
        if (deleteError) throw deleteError;

        // Adicionar novos relacionamentos
        if (empresa.ccaIds.length > 0) {
          const { error: insertError } = await supabase
            .from('empresa_ccas')
            .insert(empresa.ccaIds.map(ccaId => ({ empresa_id: editingEmpresa.id, cca_id: ccaId })));
          
          if (insertError) throw insertError;
        }
      } else {
        // Criar nova empresa
        const { data: newEmpresa, error: createError } = await supabase
          .from('empresas')
          .insert({ nome: empresa.nome, cnpj: empresa.cnpj })
          .select()
          .single();
        
        if (createError) throw createError;

        // Adicionar relacionamentos com CCAs
        if (empresa.ccaIds.length > 0) {
          const { error: insertError } = await supabase
            .from('empresa_ccas')
            .insert(empresa.ccaIds.map(ccaId => ({ empresa_id: newEmpresa.id, cca_id: ccaId })));
          
          if (insertError) throw insertError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-empresas'] });
      toast({
        title: "Sucesso",
        description: editingEmpresa ? "Empresa atualizada com sucesso!" : "Empresa criada com sucesso!",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao salvar empresa",
        variant: "destructive",
      });
      console.error('Erro:', error);
    }
  });

  // Mutation para deletar empresa
  const deleteEmpresaMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('empresas')
        .update({ ativo: false })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-empresas'] });
      toast({
        title: "Sucesso",
        description: "Empresa desativada com sucesso!",
      });
    }
  });

  const resetForm = () => {
    setFormData({ nome: "", cnpj: "", ccaIds: [] });
    setEditingEmpresa(null);
  };

  const handleEdit = (empresa: Empresa) => {
    setEditingEmpresa(empresa);
    setFormData({
      nome: empresa.nome,
      cnpj: empresa.cnpj,
      ccaIds: empresa.empresa_ccas?.map(ec => ec.ccas.id) || []
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEmpresaMutation.mutate(formData);
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
        <h1 className="text-3xl font-bold">Administração de Empresas</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Empresa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingEmpresa ? "Editar Empresa" : "Nova Empresa"}
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
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => setFormData(prev => ({ ...prev, cnpj: e.target.value }))}
                  required
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
                <Button type="submit" disabled={createEmpresaMutation.isPending}>
                  {createEmpresaMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Empresas Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingEmpresas ? (
            <p>Carregando...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-2 text-left">Nome</th>
                    <th className="border border-gray-300 p-2 text-left">CNPJ</th>
                    <th className="border border-gray-300 p-2 text-left">CCAs</th>
                    <th className="border border-gray-300 p-2 text-left">Status</th>
                    <th className="border border-gray-300 p-2 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {empresas.map((empresa) => (
                    <tr key={empresa.id}>
                      <td className="border border-gray-300 p-2">{empresa.nome}</td>
                      <td className="border border-gray-300 p-2">{empresa.cnpj}</td>
                      <td className="border border-gray-300 p-2">
                        {empresa.empresa_ccas?.map(ec => ec.ccas.codigo).join(", ") || "Nenhum"}
                      </td>
                      <td className="border border-gray-300 p-2">
                        <span className={`px-2 py-1 rounded text-xs ${empresa.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {empresa.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        <div className="flex justify-center space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(empresa)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          {empresa.ativo && (
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => deleteEmpresaMutation.mutate(empresa.id)}
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

export default AdminEmpresas;
