import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Minus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";

interface TipoInfraestrutura {
  id: string;
  nome: string;
  dimensoes_padrao: string[] | any;
  descricao?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

interface FormData {
  nome: string;
  dimensoes_padrao: string[];
  descricao: string;
}

export default function EletricaTiposInfraestrutura() {
  const [tipos, setTipos] = useState<TipoInfraestrutura[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [novaDimensao, setNovaDimensao] = useState("");
  
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    dimensoes_padrao: [],
    descricao: "",
  });

  const { toast } = useToast();

  const carregarTipos = async () => {
    try {
      const { data, error } = await supabase
        .from("tipos_infraestrutura_eletrica")
        .select("*")
        .eq("ativo", true)
        .order("nome");

      if (error) throw error;
      setTipos((data || []).map(item => ({
        ...item,
        dimensoes_padrao: Array.isArray(item.dimensoes_padrao) ? item.dimensoes_padrao : []
      })));
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar tipos de infraestrutura",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarTipos();
  }, []);

  const resetForm = () => {
    setFormData({
      nome: "",
      dimensoes_padrao: [],
      descricao: "",
    });
    setNovaDimensao("");
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      toast({
        title: "Erro",
        description: "Nome é obrigatório",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isEditing && editingId) {
        const { error } = await supabase
          .from("tipos_infraestrutura_eletrica")
          .update({
            nome: formData.nome,
            dimensoes_padrao: formData.dimensoes_padrao,
            descricao: formData.descricao || null,
          })
          .eq("id", editingId);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Tipo de infraestrutura atualizado com sucesso",
        });
      } else {
        const { error } = await supabase
          .from("tipos_infraestrutura_eletrica")
          .insert({
            nome: formData.nome,
            dimensoes_padrao: formData.dimensoes_padrao,
            descricao: formData.descricao || null,
          });

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Tipo de infraestrutura criado com sucesso",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      carregarTipos();
    } catch (error) {
      toast({
        title: "Erro",
        description: isEditing ? "Erro ao atualizar tipo" : "Erro ao criar tipo",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (tipo: TipoInfraestrutura) => {
    setFormData({
      nome: tipo.nome,
      dimensoes_padrao: tipo.dimensoes_padrao || [],
      descricao: tipo.descricao || "",
    });
    setIsEditing(true);
    setEditingId(tipo.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("tipos_infraestrutura_eletrica")
        .update({ ativo: false })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Tipo de infraestrutura excluído com sucesso",
      });

      carregarTipos();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir tipo de infraestrutura",
        variant: "destructive",
      });
    }
  };

  const adicionarDimensao = () => {
    if (novaDimensao.trim()) {
      setFormData(prev => ({
        ...prev,
        dimensoes_padrao: [...prev.dimensoes_padrao, novaDimensao.trim()]
      }));
      setNovaDimensao("");
    }
  };

  const removerDimensao = (index: number) => {
    setFormData(prev => ({
      ...prev,
      dimensoes_padrao: prev.dimensoes_padrao.filter((_, i) => i !== index)
    }));
  };

  const tiposFiltrados = tipos.filter(tipo =>
    tipo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tipo.descricao && tipo.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <Card className="border-l-4 border-l-blue-500 border-blue-200 dark:border-blue-800">
          <CardHeader className="bg-blue-50 dark:bg-blue-950/20">
            <CardTitle className="text-blue-800 dark:text-blue-200">Tipos de Infraestrutura Elétrica</CardTitle>
            <CardDescription className="text-blue-600 dark:text-blue-300">
              Gerencie os tipos de infraestrutura e suas dimensões padrão
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <Input
                placeholder="Buscar tipos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button>Novo Tipo</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {isEditing ? "Editar Tipo de Infraestrutura" : "Novo Tipo de Infraestrutura"}
                    </DialogTitle>
                  </DialogHeader>
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
                      <Label>Dimensões Padrão</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          placeholder="Ex: 100x50mm"
                          value={novaDimensao}
                          onChange={(e) => setNovaDimensao(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarDimensao())}
                        />
                        <Button type="button" onClick={adicionarDimensao} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.dimensoes_padrao.map((dimensao, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {dimensao}
                            <button
                              type="button"
                              onClick={() => removerDimensao(index)}
                              className="ml-1 hover:text-destructive"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="descricao">Descrição</Label>
                      <Textarea
                        id="descricao"
                        value={formData.descricao}
                        onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit">
                        {isEditing ? "Atualizar" : "Criar"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div>Carregando...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Dimensões Padrão</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tiposFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        {searchTerm ? "Nenhum tipo encontrado" : "Nenhum tipo cadastrado"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    tiposFiltrados.map((tipo) => (
                      <TableRow key={tipo.id}>
                        <TableCell className="font-medium">{tipo.nome}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {tipo.dimensoes_padrao?.map((dimensao, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {dimensao}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{tipo.descricao}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(tipo)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(tipo.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}