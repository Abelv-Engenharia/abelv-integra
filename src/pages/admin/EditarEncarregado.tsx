
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";

interface Encarregado {
  id: string;
  nome: string;
  funcao: string;
  matricula: string;
  email: string;
  ativo: boolean;
  cca_id: number | null;
  cca?: { id: number; codigo: string; nome: string };
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
    cca_id: null as number | null
  });

  // Buscar encarregado específico
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
          cca_id,
          cca:cca_id(id, codigo, nome)
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
      setFormData({
        nome: encarregado.nome,
        funcao: encarregado.funcao,
        matricula: encarregado.matricula || "",
        email: encarregado.email || "",
        cca_id: encarregado.cca_id
      });
    }
  }, [encarregado]);

  // Mutation para atualizar encarregado
  const updateEncarregadoMutation = useMutation({
    mutationFn: async (encarregado: { nome: string; funcao: string; matricula: string; email: string; cca_id: number | null }) => {
      if (!id) throw new Error('ID não fornecido');
      const { error } = await supabase
        .from('encarregados')
        .update({ 
          nome: encarregado.nome, 
          funcao: encarregado.funcao,
          matricula: encarregado.matricula,
          email: encarregado.email,
          cca_id: encarregado.cca_id
        })
        .eq('id', id);
      
      if (error) throw error;
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
              <Label htmlFor="cca">CCA</Label>
              <Select 
                value={formData.cca_id?.toString() || ""} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, cca_id: value ? parseInt(value) : null }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um CCA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum CCA</SelectItem>
                  {ccas.map((cca) => (
                    <SelectItem key={cca.id} value={cca.id.toString()}>
                      {cca.codigo} - {cca.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
