
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useNavigate, useParams } from "react-router-dom";

interface Encarregado {
  id: string;
  nome: string;
  funcao: string;
  matricula: string;
  email: string;
  ativo: boolean;
  encarregado_ccas?: { cca: { id: number; codigo: string; nome: string } }[];
}

interface CCA {
  id: number;
  codigo: string;
  nome: string;
}

const EditarEncarregado = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    nome: "",
    funcao: "",
    matricula: "",
    email: "",
    ativo: true,
    cca_ids: [] as number[]
  });

  // Buscar encarregado específico com CCAs
  const { data: encarregado, isLoading: loadingEncarregado } = useQuery({
    queryKey: ['encarregado', id],
    queryFn: async () => {
      if (!id) throw new Error('ID não fornecido');
      const { data, error } = await supabase
        .from('encarregados')
        .select(`
          id,
          nome,
          funcao,
          matricula,
          email,
          ativo,
          encarregado_ccas(
            cca:ccas(id, codigo, nome)
          )
        `)
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Encarregado;
    },
    enabled: !!id
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

  // Preencher formulário quando dados são carregados
  useEffect(() => {
    if (encarregado) {
      const ccaIds = encarregado.encarregado_ccas?.map(ec => ec.cca.id) || [];
      setFormData({
        nome: encarregado.nome,
        funcao: encarregado.funcao,
        matricula: encarregado.matricula || "",
        email: encarregado.email || "",
        ativo: encarregado.ativo,
        cca_ids: ccaIds
      });
    }
  }, [encarregado]);

  // Mutation para atualizar encarregado
  const updateEncarregadoMutation = useMutation({
    mutationFn: async (encarregado: { nome: string; funcao: string; matricula: string; email: string; ativo: boolean; cca_ids: number[] }) => {
      if (!id) throw new Error('ID não fornecido');
      
      // Atualizar dados do encarregado
      const { error: updateError } = await supabase
        .from('encarregados')
        .update({ 
          nome: encarregado.nome, 
          funcao: encarregado.funcao,
          matricula: encarregado.matricula,
          email: encarregado.email,
          ativo: encarregado.ativo
        })
        .eq('id', id);
      
      if (updateError) throw updateError;

      // Remover relacionamentos existentes
      const { error: deleteError } = await supabase
        .from('encarregado_ccas')
        .delete()
        .eq('encarregado_id', id);

      if (deleteError) throw deleteError;

      // Criar novos relacionamentos se houver CCAs selecionados
      if (encarregado.cca_ids.length > 0) {
        const relacionamentos = encarregado.cca_ids.map(ccaId => ({
          encarregado_id: id,
          cca_id: ccaId
        }));

        const { error: insertError } = await supabase
          .from('encarregado_ccas')
          .insert(relacionamentos);

        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-encarregados'] });
      queryClient.invalidateQueries({ queryKey: ['encarregado', id] });
      toast({
        title: "Sucesso",
        description: "Encarregado atualizado com sucesso!",
      });
      navigate('/admin/encarregados');
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar encarregado",
        variant: "destructive",
      });
      console.error('Erro:', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.funcao) {
      toast({
        title: "Erro",
        description: "Nome e função são obrigatórios",
        variant: "destructive",
      });
      return;
    }
    updateEncarregadoMutation.mutate(formData);
  };

  const handleCcaChange = (ccaId: number, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      cca_ids: checked 
        ? [...prev.cca_ids, ccaId]
        : prev.cca_ids.filter(id => id !== ccaId)
    }));
  };

  if (loadingEncarregado) {
    return <div>Carregando...</div>;
  }

  if (!encarregado) {
    return <div>Encarregado não encontrado</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/admin/encarregados')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold">Editar Encarregado</h1>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Editar Encarregado: {encarregado.nome}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="funcao">Função *</Label>
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
              <Label>CCAs</Label>
              <div className="mt-2 space-y-2 max-h-48 overflow-y-auto border rounded p-3">
                {ccas.map((cca) => (
                  <div key={cca.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cca-${cca.id}`}
                      checked={formData.cca_ids.includes(cca.id)}
                      onCheckedChange={(checked) => handleCcaChange(cca.id, checked as boolean)}
                    />
                    <Label htmlFor={`cca-${cca.id}`} className="text-sm">
                      {cca.codigo} - {cca.nome}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="ativo"
                checked={formData.ativo}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ativo: checked }))}
              />
              <Label htmlFor="ativo">Ativo</Label>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/encarregados')}>
                Cancelar
              </Button>
              <Button type="submit" disabled={updateEncarregadoMutation.isPending}>
                {updateEncarregadoMutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditarEncarregado;
