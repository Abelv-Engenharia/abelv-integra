import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EquipeSelector, type FuncaoEquipe } from "@/components/EquipeSelector";
import { Plus, Edit, Trash2, Search } from "lucide-react";

interface Encarregado {
  id: string;
  nome: string;
  cargo?: string;
  telefone?: string;
  email?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  equipe?: FuncaoEquipe[];
  cca_id?: string;
}

interface CCA {
  id: string;
  codigo: string;
  nome: string;
}

export default function CadastroEncarregados() {
  const [encarregados, setEncarregados] = useState<Encarregado[]>([]);
  const [ccas, setCcas] = useState<CCA[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEncarregado, setEditingEncarregado] = useState<Encarregado | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nome: "",
    cargo: "",
    telefone: "",
    email: "",
    ativo: true,
    equipe: [] as FuncaoEquipe[],
    cca_id: ""
  });

  useEffect(() => {
    carregarEncarregados();
    carregarCcas();
  }, []);

  const carregarEncarregados = async () => {
    try {
      const { data, error } = await supabase
        .from("encarregados")
        .select(`
          *,
          ccas(codigo, nome)
        `)
        .order("nome", { ascending: true });

      if (error) throw error;
      
      // Converter Json para FuncaoEquipe[] e garantir tipo correto
      const encarregadosFormatados = (data || []).map((enc: any) => ({
        ...enc,
        equipe: Array.isArray(enc.equipe) ? enc.equipe as FuncaoEquipe[] : []
      }))
      setEncarregados(encarregadosFormatados);
    } catch (error) {
      console.error("Erro ao carregar encarregados:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar lista de encarregados",
        variant: "destructive"
      });
    }
  };

  const carregarCcas = async () => {
    try {
      const { data, error } = await supabase
        .from("ccas")
        .select("id, codigo, nome")
        .eq("ativo", true)
        .order("codigo", { ascending: true });

      if (error) throw error;
      setCcas(data || []);
    } catch (error) {
      console.error("Erro ao carregar CCAs:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      cargo: "",
      telefone: "",
      email: "",
      ativo: true,
      equipe: [],
      cca_id: ""
    });
    setEditingEncarregado(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome.trim()) {
      toast({
        title: "Erro",
        description: "Nome é obrigatório",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      if (editingEncarregado) {
        const { error } = await supabase
          .from("encarregados")
          .update(formData as any)
          .eq("id", editingEncarregado.id);

        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Encarregado atualizado com sucesso"
        });
      } else {
        const { error } = await supabase
          .from("encarregados")
          .insert([formData as any]);

        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Encarregado cadastrado com sucesso"
        });
      }

      resetForm();
      setIsDialogOpen(false);
      carregarEncarregados();
    } catch (error: any) {
      console.error("Erro ao salvar encarregado:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar encarregado",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (encarregado: Encarregado) => {
    setEditingEncarregado(encarregado);
    setFormData({
      nome: encarregado.nome,
      cargo: encarregado.cargo || "",
      telefone: encarregado.telefone || "",
      email: encarregado.email || "",
      ativo: encarregado.ativo,
      equipe: encarregado.equipe || [],
      cca_id: encarregado.cca_id || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir o encarregado ${nome}?`)) return;

    try {
      const { error } = await supabase
        .from("encarregados")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({
        title: "Sucesso",
        description: "Encarregado excluído com sucesso"
      });
      carregarEncarregados();
    } catch (error: any) {
      console.error("Erro ao excluir encarregado:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir encarregado",
        variant: "destructive"
      });
    }
  };

  const encarregadosFiltrados = encarregados.filter(encarregado =>
    encarregado.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (encarregado.cargo && encarregado.cargo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Cadastro de Encarregados</CardTitle>
            <CardDescription>
              Gerencie os encarregados responsáveis pelos relatórios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-72">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou cargo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Encarregado
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingEncarregado ? "Editar Encarregado" : "Novo Encarregado"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingEncarregado ? "Editar informações do encarregado" : "Cadastrar novo encarregado"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="nome" className="text-right">
                          Nome *
                        </Label>
                        <Input
                          id="nome"
                          value={formData.nome}
                          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                          className="col-span-3"
                          placeholder="Nome completo"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="cargo" className="text-right">
                          Cargo
                        </Label>
                        <Input
                          id="cargo"
                          value={formData.cargo}
                          onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                          className="col-span-3"
                          placeholder="Ex: Supervisor, Coordenador"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="telefone" className="text-right">
                          Telefone
                        </Label>
                        <Input
                          id="telefone"
                          value={formData.telefone}
                          onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                          className="col-span-3"
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          E-mail
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="col-span-3"
                          placeholder="email@empresa.com"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="cca" className="text-right">
                          Centro de Custo (CCA)
                        </Label>
                        <Select value={formData.cca_id} onValueChange={(value) => setFormData({ ...formData, cca_id: value })}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Selecionar CCA" />
                          </SelectTrigger>
                          <SelectContent>
                            {ccas.map((cca) => (
                              <SelectItem key={cca.id} value={cca.id}>
                                {cca.codigo} - {cca.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right pt-2">
                          Equipe
                        </Label>
                        <div className="col-span-3">
                          <EquipeSelector
                            value={formData.equipe || []}
                            onChange={(equipe) => setFormData({ ...formData, equipe })}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Defina funções e quantidades da equipe deste encarregado.
                          </p>
                        </div>
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
                  <TableHead>Nome</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>CCA</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {encarregadosFiltrados.map((encarregado) => (
                  <TableRow key={encarregado.id}>
                    <TableCell className="font-medium">{encarregado.nome}</TableCell>
                    <TableCell>{encarregado.cargo || "-"}</TableCell>
                    <TableCell>
                      {(encarregado as any).ccas ? `${(encarregado as any).ccas.codigo} - ${(encarregado as any).ccas.nome}` : "-"}
                    </TableCell>
                    <TableCell>{encarregado.telefone || "-"}</TableCell>
                    <TableCell>{encarregado.email || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={encarregado.ativo ? "default" : "secondary"}>
                        {encarregado.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(encarregado)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(encarregado.id, encarregado.nome)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {encarregadosFiltrados.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? "Nenhum encarregado encontrado com os critérios de busca" : "Nenhum encarregado cadastrado"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}