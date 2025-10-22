import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search } from "lucide-react";

interface Disciplina {
  id: string;
  nome: string;
  descricao: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export default function EletricaDisciplinas() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDisciplina, setEditingDisciplina] = useState<Disciplina | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nome: "",
    descricao: ""
  });

  useEffect(() => {
    carregarDisciplinas();
  }, []);

  const carregarDisciplinas = async () => {
    try {
      const { data, error } = await supabase
        .from("disciplinas_eletricas")
        .select("*")
        .eq("ativo", true)
        .order("nome", { ascending: true });

      if (error) throw error;
      setDisciplinas(data || []);
    } catch (error) {
      console.error("Erro ao carregar disciplinas:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar lista de disciplinas",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      descricao: ""
    });
    setEditingDisciplina(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome.trim()) {
      toast({
        title: "Erro",
        description: "Nome da disciplina é obrigatório",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      if (editingDisciplina) {
        const { error } = await supabase
          .from("disciplinas_eletricas")
          .update({
            nome: formData.nome.trim(),
            descricao: formData.descricao.trim() || null
          })
          .eq("id", editingDisciplina.id);

        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Disciplina atualizada com sucesso"
        });
      } else {
        const { error } = await supabase
          .from("disciplinas_eletricas")
          .insert([{
            nome: formData.nome.trim(),
            descricao: formData.descricao.trim() || null
          }]);

        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Disciplina cadastrada com sucesso"
        });
      }

      resetForm();
      setIsDialogOpen(false);
      carregarDisciplinas();
    } catch (error: any) {
      console.error("Erro ao salvar disciplina:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar disciplina",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (disciplina: Disciplina) => {
    setEditingDisciplina(disciplina);
    setFormData({
      nome: disciplina.nome,
      descricao: disciplina.descricao || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir a disciplina ${nome}?`)) return;

    try {
      const { error } = await supabase
        .from("disciplinas_eletricas")
        .update({ ativo: false })
        .eq("id", id);

      if (error) throw error;
      toast({
        title: "Sucesso",
        description: "Disciplina excluída com sucesso"
      });
      carregarDisciplinas();
    } catch (error: any) {
      console.error("Erro ao excluir disciplina:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir disciplina",
        variant: "destructive"
      });
    }
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === disciplinasFiltradas.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(disciplinasFiltradas.map(d => d.id)));
    }
  };

  const cancelSelection = () => {
    setSelectedIds(new Set());
  };

  const handleDeleteSelected = async () => {
    setIsDeleting(true);
    setDeleteProgress(0);

    const idsArray = Array.from(selectedIds);
    const batchSize = 10;
    let processedCount = 0;

    for (let i = 0; i < idsArray.length; i += batchSize) {
      const batch = idsArray.slice(i, i + batchSize);
      
      try {
        const { error } = await supabase
          .from("disciplinas_eletricas")
          .update({ ativo: false })
          .in("id", batch);

        if (error) throw error;
        processedCount += batch.length;
        setDeleteProgress(Math.round((processedCount / idsArray.length) * 100));
      } catch (error) {
        console.error("Erro ao excluir lote:", error);
      }
    }

    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
    setSelectedIds(new Set());
    
    toast({
      title: "Sucesso",
      description: `${processedCount} disciplina(s) excluída(s) com sucesso`
    });

    carregarDisciplinas();
  };

  const disciplinasFiltradas = disciplinas.filter(disciplina =>
    disciplina.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (disciplina.descricao && disciplina.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle>Cadastro de Disciplinas - Elétrica/Instrumentação</CardTitle>
            <CardDescription>
              Gerencie as disciplinas disponíveis no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-72">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar disciplinas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Disciplina
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingDisciplina ? "Editar Disciplina" : "Nova Disciplina"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingDisciplina ? "Editar informações da disciplina" : "Cadastrar nova disciplina"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="nome">
                          Nome *
                        </Label>
                        <Input
                          id="nome"
                          value={formData.nome}
                          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                          placeholder="Ex: Automação"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="descricao">
                          Descrição
                        </Label>
                        <Textarea
                          id="descricao"
                          value={formData.descricao}
                          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                          placeholder="Ex: Sistemas de automação e controle"
                          rows={3}
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

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedIds.size === disciplinasFiltradas.length && disciplinasFiltradas.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disciplinasFiltradas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        Nenhuma disciplina encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    disciplinasFiltradas.map((disciplina) => (
                      <TableRow key={disciplina.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.has(disciplina.id)}
                            onCheckedChange={() => toggleSelection(disciplina.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{disciplina.nome}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {disciplina.descricao || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(disciplina)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(disciplina.id, disciplina.nome)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barra flutuante de ações */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-4 z-50">
          <Badge variant="secondary" className="bg-white text-blue-600">
            {selectedIds.size} selecionado(s)
          </Badge>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir Selecionados
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={cancelSelection}
          >
            Cancelar Seleção
          </Button>
        </div>
      )}

      {/* Dialog de confirmação de exclusão em lote */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir {selectedIds.size} disciplina(s)? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {isDeleting && (
            <div className="space-y-2">
              <Progress value={deleteProgress} />
              <p className="text-sm text-center text-muted-foreground">
                Excluindo... {deleteProgress}%
              </p>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSelected}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Excluindo..." : "Confirmar Exclusão"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}