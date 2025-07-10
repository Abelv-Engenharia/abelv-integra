
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Edit, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Encarregado {
  id: string;
  nome: string;
  funcao: string;
  matricula: string;
  email: string;
  ativo: boolean;
  encarregado_ccas?: { cca: { id: number; codigo: string; nome: string } }[];
}

const AdminEncarregados = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Buscar encarregados com seus CCAs relacionados
  const { data: encarregados = [], isLoading: loadingEncarregados } = useQuery({
    queryKey: ['admin-encarregados'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('encarregados')
        .select(`
          id,
          nome,
          funcao,
          matricula,
          email,
          ativo,
          encarregado_ccas!inner(
            cca:ccas(id, codigo, nome)
          )
        `)
        .order('nome');
      if (error) throw error;
      return data || [];
    }
  });

  // Mutation para deletar encarregado
  const deleteEncarregadoMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('encarregados')
        .update({ ativo: false })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-encarregados'] });
      toast({
        title: "Sucesso",
        description: "Encarregado desativado com sucesso!",
      });
    }
  });

  const handleEdit = (encarregado: Encarregado) => {
    navigate(`/admin/encarregados/${encarregado.id}/editar`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Administração de Encarregados</h1>
        <Button onClick={() => navigate('/admin/encarregados/novo')}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Encarregado
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Encarregados Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingEncarregados ? (
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
                  {encarregados.map((encarregado) => (
                    <tr key={encarregado.id}>
                      <td className="border border-gray-300 p-2">{encarregado.nome}</td>
                      <td className="border border-gray-300 p-2">{encarregado.funcao}</td>
                      <td className="border border-gray-300 p-2">{encarregado.matricula || "-"}</td>
                      <td className="border border-gray-300 p-2">{encarregado.email || "-"}</td>
                      <td className="border border-gray-300 p-2">
                        {encarregado.encarregado_ccas && encarregado.encarregado_ccas.length > 0
                          ? encarregado.encarregado_ccas.map((ec, index) => (
                              <span key={ec.cca.id} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                                {ec.cca.codigo} - {ec.cca.nome}
                              </span>
                            ))
                          : "Nenhum CCA"
                        }
                      </td>
                      <td className="border border-gray-300 p-2">
                        <span className={`px-2 py-1 rounded text-xs ${encarregado.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {encarregado.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        <div className="flex justify-center space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(encarregado)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          {encarregado.ativo && (
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => deleteEncarregadoMutation.mutate(encarregado.id)}
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

export default AdminEncarregados;
