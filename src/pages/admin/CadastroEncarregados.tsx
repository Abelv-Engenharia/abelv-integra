
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";

interface CCA {
  id: number;
  codigo: string;
  nome: string;
}

const CadastroEncarregados = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    nome: "",
    funcao: "",
    matricula: "",
    email: "",
    cca_ids: [] as number[]
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

  // Mutation para criar encarregado
  const createEncarregadoMutation = useMutation({
    mutationFn: async (encarregado: { nome: string; funcao: string; matricula: string; email: string; cca_ids: number[] }) => {
      // Criar o encarregado
      const { data: newEncarregado, error: encarregadoError } = await supabase
        .from('encarregados')
        .insert({ 
          nome: encarregado.nome, 
          funcao: encarregado.funcao,
          matricula: encarregado.matricula,
          email: encarregado.email
        })
        .select()
        .single();
      
      if (encarregadoError) throw encarregadoError;

      // Criar relacionamentos com CCAs se houver
      if (encarregado.cca_ids.length > 0) {
        const relacionamentos = encarregado.cca_ids.map(ccaId => ({
          encarregado_id: newEncarregado.id,
          cca_id: ccaId
        }));

        const { error: relacionamentoError } = await supabase
          .from('encarregado_ccas')
          .insert(relacionamentos);

        if (relacionamentoError) throw relacionamentoError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-encarregados'] });
      toast({
        title: "Sucesso",
        description: "Encarregado criado com sucesso!",
      });
      navigate('/admin/encarregados');
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar encarregado",
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
    createEncarregadoMutation.mutate(formData);
  };

  const handleCcaChange = (ccaId: number, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      cca_ids: checked 
        ? [...prev.cca_ids, ccaId]
        : prev.cca_ids.filter(id => id !== ccaId)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/admin/encarregados')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold">Cadastrar Encarregado</h1>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Novo Encarregado</CardTitle>
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
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/encarregados')}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createEncarregadoMutation.isPending}>
                {createEncarregadoMutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CadastroEncarregados;
