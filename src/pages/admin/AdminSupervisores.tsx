
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

interface Supervisor {
  id: string;
  nome: string;
  funcao: string;
  matricula: string;
  email: string;
  ativo: boolean;
  supervisor_ccas?: { ccas: { id: number; codigo: string; nome: string } }[];
}

interface CCA {
  id: number;
  codigo: string;
  nome: string;
}

const AdminSupervisores = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupervisor, setEditingSupervisor] = useState<Supervisor | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    funcao: "",
    matricula: "",
    email: "",
    ccaIds: [] as number[]
  });

  // Buscar supervisores
  const { data: supervisores = [], isLoading: loadingSupervisores } = useQuery({
    queryKey: ['admin-supervisores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supervisores')
        .select(`
          id,
          nome,
          funcao,
          matricula,
          email,
          ativo,
          supervisor_ccas(
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

  // Mutation para criar/editar supervisor
  const createSupervisorMutation = useMutation({
    mutationFn: async (supervisor: { nome: string; funcao: string; matricula: string; email: string; ccaIds: number[] }) => {
      if (editingSupervisor) {
        // Atualizar supervisor
        const { error: updateError } = await supabase
          .from('supervisores')
          .update({ 
            nome: supervisor.nome, 
            funcao: supervisor.funcao,
            matricula: supervisor.matricula,
            email: supervisor.email
          })
          .eq('id', editingSupervisor.id);
        
        if (updateError) throw updateError;

        // Remover relacionamentos existentes
        const { error: deleteError } = await supabase
          .from('supervisor_ccas')
          .delete()
          .eq('supervisor_id', editingSupervisor.id);
        
        if (deleteError) throw deleteError;

        // Adicionar novos relacionamentos
        if (supervisor.ccaIds.length > 0) {
          const { error: insertError } = await supabase
            .from('supervisor_ccas')
            .insert(supervisor.ccaIds.map(ccaId => ({ supervisor_id: editingSupervisor.id, cca_id: ccaId })));
          
          if (insertError) throw insertError;
        }
      } else {
        // Criar novo supervisor
        const { data: newSupervisor, error: createError } = await supabase
          .from('supervisores')
          .insert({ 
            nome: supervisor.nome, 
            funcao: supervisor.funcao,
            matricula: supervisor.matricula,
            email: supervisor.email
          })
          .select()
          .single();
        
        if (createError) throw createError;

        // Adicionar relacionamentos com CCAs
        if (supervisor.ccaIds.length > 0) {
          const { error: insertError } = await supabase
            .from('supervisor_ccas')
            .insert(supervisor.ccaIds.map(ccaId => ({ supervisor_id: newSupervisor.id, cca_id: ccaId })));
          
          if (insertError) throw insertError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-supervisores'] });
      toast({
        title: "Sucesso",
        description: editingSupervisor ? "Supervisor atualizado com sucesso!" : "Supervisor criado com sucesso!",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao salvar supervisor",
        variant: "destructive",
      });
      console.error('Erro:', error);
    }
  });

  // Mutation para deletar supervisor
  const deleteSupervisorMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('supervisores')
        .update({ ativo: false })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-supervisores'] });
      toast({
        title: "Sucesso",
        description: "Supervisor desativado com sucesso!",
      });
    }
  });

  const resetForm = () => {
    setFormData({ nome: "", funcao: "", matricula: "", email: "", ccaIds: [] });
    setEditingSupervisor(null);
  };

  const handleEdit = (supervisor: Supervisor) => {
    setEditingSupervisor(supervisor);
    setFormData({
      nome: supervisor.nome,
      funcao: supervisor.funcao,
      matricula: supervisor.matricula || "",
      email: supervisor.email || "",
      ccaIds: supervisor.supervisor_ccas?.map(sc => sc.ccas.id) || []
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSupervisorMutation.mutate(formData);
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
        <h1 className="text-3xl font-bold">Administração de Supervisores</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Supervisor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSupervisor ? "Editar Supervisor" : "Novo Supervisor"}
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
                <Button type="submit" disabled={createSupervisorMutation.isPending}>
                  {createSupervisorMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supervisores Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingSupervisores ? (
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
                  {supervisores.map((supervisor) => (
                    <tr key={supervisor.id}>
                      <td className="border border-gray-300 p-2">{supervisor.nome}</td>
                      <td className="border border-gray-300 p-2">{supervisor.funcao}</td>
                      <td className="border border-gray-300 p-2">{supervisor.matricula || "-"}</td>
                      <td className="border border-gray-300 p-2">{supervisor.email || "-"}</td>
                      <td className="border border-gray-300 p-2">
                        {supervisor.supervisor_ccas?.map(sc => sc.ccas.codigo).join(", ") || "Nenhum"}
                      </td>
                      <td className="border border-gray-300 p-2">
                        <span className={`px-2 py-1 rounded text-xs ${supervisor.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {supervisor.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        <div className="flex justify-center space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(supervisor)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          {supervisor.ativo && (
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => deleteSupervisorMutation.mutate(supervisor.id)}
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

export default AdminSupervisores;
