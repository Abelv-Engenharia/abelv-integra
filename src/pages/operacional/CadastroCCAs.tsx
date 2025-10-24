import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search } from "lucide-react";

interface CCA {
  id: string;
  codigo: string;
  nome: string;
  localizacao?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export default function CadastroCCAs() {
  const [ccas, setCcas] = useState<CCA[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCca, setEditingCca] = useState<CCA | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    codigo: "",
    nome: "",
    localizacao: "",
    ativo: true
  });

  useEffect(() => {
    carregarCcas();
  }, []);

  const carregarCcas = async () => {
    try {
      const { data, error } = await supabase
        .from("ccas")
        .select("*")
        .order("codigo", { ascending: true });

      if (error) throw error;
      setCcas(data || []);
    } catch (error) {
      console.error("Erro ao carregar CCAs:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar lista de CCAs",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      codigo: "",
      nome: "",
      localizacao: "",
      ativo: true
    });
    setEditingCca(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.codigo.trim() || !formData.nome.trim()) {
      toast({
        title: "Erro",
        description: "Código e nome são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      if (editingCca) {
        const { error } = await supabase
          .from("ccas")
          .update(formData)
          .eq("id", editingCca.id);

        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "CCA atualizado com sucesso"
        });
      } else {
        const { error } = await supabase
          .from("ccas")
          .insert([formData]);

        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "CCA cadastrado com sucesso"
        });
      }

      resetForm();
      setIsDialogOpen(false);
      carregarCcas();
    } catch (error: any) {
      console.error("Erro ao salvar CCA:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar CCA",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (cca: CCA) => {
    setEditingCca(cca);
    setFormData({
      codigo: cca.codigo,
      nome: cca.nome,
      localizacao: cca.localizacao || "",
      ativo: cca.ativo
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, codigo: string) => {
    if (!confirm(`Tem certeza que deseja excluir o CCA ${codigo}?`)) return;

    try {
      const { error } = await supabase
        .from("ccas")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({
        title: "Sucesso",
        description: "CCA excluído com sucesso"
      });
      carregarCcas();
    } catch (error: any) {
      console.error("Erro ao excluir CCA:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir CCA",
        variant: "destructive"
      });
    }
  };

  const ccasFiltrados = ccas.filter(cca =>
    cca.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cca.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Cadastro de CCAs</CardTitle>
            <CardDescription>
              Gerencie os Centros de Custo ABELV do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-72">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por código ou nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo CCA
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingCca ? "Editar CCA" : "Novo CCA"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingCca ? "Editar informações do CCA" : "Cadastrar novo Centro de Custo ABELV"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="codigo" className="text-right">
                          Código *
                        </Label>
                        <Input
                          id="codigo"
                          value={formData.codigo}
                          onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                          className="col-span-3"
                          placeholder="Ex: 23.024"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="nome" className="text-right">
                          Nome *
                        </Label>
                        <Input
                          id="nome"
                          value={formData.nome}
                          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                          className="col-span-3"
                          placeholder="Nome do Centro de Custo"
                          required
                        />
                      </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="localizacao" className="text-right">
                    Localização
                  </Label>
                  <Textarea
                    id="localizacao"
                    value={formData.localizacao}
                    onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                    className="col-span-3"
                    placeholder="Localização do CCA (opcional)"
                  />
                </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="ativo" className="text-right">
                          Ativo
                        </Label>
                        <Switch
                          id="ativo"
                          checked={formData.ativo}
                          onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Salvando..." : "Salvar"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Table>
              <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
              </TableHeader>
              <TableBody>
                {ccasFiltrados.map((cca) => (
                  <TableRow key={cca.id}>
                    <TableCell className="font-medium">{cca.codigo}</TableCell>
                    <TableCell>{cca.nome}</TableCell>
                    <TableCell>{cca.localizacao || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={cca.ativo ? "default" : "secondary"}>
                        {cca.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(cca)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(cca.id, cca.codigo)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {ccasFiltrados.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? "Nenhum CCA encontrado com os critérios de busca" : "Nenhum CCA cadastrado"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}