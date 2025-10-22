import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus } from "lucide-react";
import Layout from "@/components/Layout";

const CadastroFluidos = () => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  // Buscar fluidos existentes
  const { data: fluidos, isLoading: isLoadingFluidos } = useQuery({
    queryKey: ["fluidos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fluidos")
        .select("id, nome, descricao")
        .order("nome");
      
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      toast.error("Por favor, digite o nome do fluido");
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from("fluidos")
        .insert([{ nome: nome.trim(), descricao: descricao.trim() || null }]);

      if (error) throw error;

      toast.success("Fluido cadastrado com sucesso!");
      setNome("");
      setDescricao("");
      queryClient.invalidateQueries({ queryKey: ["fluidos"] });
    } catch (error) {
      console.error("Erro ao cadastrar fluido:", error);
      toast.error("Erro ao cadastrar fluido");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("fluidos")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Fluido removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["fluidos"] });
    } catch (error) {
      console.error("Erro ao remover fluido:", error);
      toast.error("Erro ao remover fluido");
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cadastro de Fluidos</h1>
          <p className="text-muted-foreground">
            Gerencie os fluidos disponíveis no sistema
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulário de cadastro */}
          <Card>
            <CardHeader>
              <CardTitle>Novo Fluido</CardTitle>
              <CardDescription>
                Adicione um novo fluido ao sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Fluido</Label>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Ex: Água, Vapor, Óleo..."
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição (opcional)</Label>
                  <Textarea
                    id="descricao"
                    placeholder="Descrição do fluido..."
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  {isLoading ? "Cadastrando..." : "Cadastrar Fluido"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Lista de fluidos */}
          <Card>
            <CardHeader>
              <CardTitle>Fluidos Cadastrados</CardTitle>
              <CardDescription>
                Lista de todos os fluidos no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingFluidos ? (
                <p className="text-muted-foreground">Carregando...</p>
              ) : fluidos && fluidos.length > 0 ? (
                <div className="space-y-2">
                  {fluidos.map((fluido) => (
                    <div
                      key={fluido.id}
                      className="flex items-start justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <span className="font-medium">{fluido.nome}</span>
                        {fluido.descricao && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {fluido.descricao}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(fluido.id)}
                        className="text-destructive hover:text-destructive ml-3"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhum fluido cadastrado</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CadastroFluidos;