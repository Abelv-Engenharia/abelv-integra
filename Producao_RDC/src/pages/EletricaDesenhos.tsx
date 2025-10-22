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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search, Download, Upload } from "lucide-react";
import * as XLSX from "xlsx";

interface ImportRow {
  CÓDIGO: string;
  DISCIPLINA: string;
  ÁREA?: string;
  DESCRIÇÃO?: string;
}

interface PreviewRow {
  data: ImportRow;
  status: "ok" | "warning" | "error";
  errors: string[];
  index: number;
}

export default function EletricaDesenhos() {
  const [desenhos, setDesenhos] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [disciplinasDb, setDisciplinasDb] = useState<{id: string; nome: string}[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDesenho, setEditingDesenho] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importPreviewData, setImportPreviewData] = useState<PreviewRow[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState(0);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    codigo: "",
    disciplina: "",
    area_id: "",
    descricao: ""
  });

  useEffect(() => {
    carregarDesenhos();
    carregarAreas();
    carregarDisciplinas();
  }, []);

  const carregarDisciplinas = async () => {
    try {
      const { data, error } = await supabase
        .from("disciplinas_eletricas")
        .select("id, nome")
        .eq("ativo", true)
        .order("nome");

      if (error) throw error;
      setDisciplinasDb(data || []);
    } catch (error) {
      console.error("Erro ao carregar disciplinas:", error);
    }
  };

  const carregarDesenhos = async () => {
    try {
      const { data, error } = await supabase
        .from("desenhos_eletrica")
        .select(`
          *,
          areas_projeto(nome)
        `)
        .eq("ativo", true)
        .order("codigo", { ascending: true });

      if (error) throw error;
      setDesenhos(data || []);
    } catch (error) {
      console.error("Erro ao carregar desenhos:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar lista de desenhos",
        variant: "destructive"
      });
    }
  };

  const carregarAreas = async () => {
    try {
      const { data, error } = await supabase
        .from("areas_projeto")
        .select("*")
        .eq("ativo", true)
        .order("nome", { ascending: true });

      if (error) throw error;
      setAreas(data || []);
    } catch (error) {
      console.error("Erro ao carregar áreas:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      codigo: "",
      disciplina: "",
      area_id: "",
      descricao: ""
    });
    setEditingDesenho(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.codigo.trim() || !formData.disciplina) {
      toast({
        title: "Erro",
        description: "Código e disciplina são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      if (editingDesenho) {
        const { error } = await supabase
          .from("desenhos_eletrica")
          .update(formData)
          .eq("id", editingDesenho.id);

        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Desenho atualizado com sucesso"
        });
      } else {
        const { error } = await supabase
          .from("desenhos_eletrica")
          .insert([formData]);

        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Desenho cadastrado com sucesso"
        });
      }

      resetForm();
      setIsDialogOpen(false);
      carregarDesenhos();
    } catch (error: any) {
      console.error("Erro ao salvar desenho:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar desenho",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (desenho: any) => {
    setEditingDesenho(desenho);
    setFormData({
      codigo: desenho.codigo,
      disciplina: desenho.disciplina,
      area_id: desenho.area_id || "",
      descricao: desenho.descricao || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, codigo: string) => {
    if (!confirm(`Tem certeza que deseja excluir o desenho ${codigo}?`)) return;

    try {
      const { error } = await supabase
        .from("desenhos_eletrica")
        .update({ ativo: false })
        .eq("id", id);

      if (error) throw error;
      toast({
        title: "Sucesso",
        description: "Desenho excluído com sucesso"
      });
      carregarDesenhos();
    } catch (error: any) {
      console.error("Erro ao excluir desenho:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir desenho",
        variant: "destructive"
      });
    }
  };

  const downloadTemplate = () => {
    // Usar disciplinas cadastradas no banco
    const disciplinasExemplo = disciplinasDb.slice(0, 3);
    
    const template = disciplinasExemplo.length > 0 ? disciplinasExemplo.map((disc, idx) => ({
      "CÓDIGO": `FAB-${disc.nome.substring(0, 3).toUpperCase()}-DER-23-${36 + idx}-01`,
      "DISCIPLINA": disc.nome,
      "ÁREA": `Área ${(idx + 1) * 100}`,
      "DESCRIÇÃO": `Desenho de ${disc.nome.toLowerCase()}`
    })) : [
      {
        "CÓDIGO": "FAB-ELE-DER-23-36-01",
        "DISCIPLINA": "Cadastre disciplinas primeiro",
        "ÁREA": "Área 100",
        "DESCRIÇÃO": "Exemplo de desenho"
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Desenhos");
    
    ws['!cols'] = [
      { wch: 25 },
      { wch: 30 },
      { wch: 20 },
      { wch: 40 }
    ];

    XLSX.writeFile(wb, "template_desenhos_eletrica.xlsx");
    
    toast({
      title: "Sucesso",
      description: disciplinasDb.length > 0 
        ? `Template baixado com disciplinas cadastradas: ${disciplinasDb.map(d => d.nome).join(', ')}`
        : "Template baixado. Cadastre disciplinas em /eletrica-disciplinas primeiro"
    });
  };

  const validateRow = (row: ImportRow, index: number): PreviewRow => {
    const errors: string[] = [];

    if (!row.CÓDIGO?.trim()) {
      errors.push("Código é obrigatório");
    } else {
      const codigoExistente = desenhos.find(d => 
        d.codigo.toLowerCase() === row.CÓDIGO.trim().toLowerCase()
      );
      if (codigoExistente) {
        errors.push(`Código "${row.CÓDIGO}" já cadastrado`);
      }
    }

    if (!row.DISCIPLINA?.trim()) {
      errors.push("Disciplina é obrigatória");
    } else {
      const disciplinaExiste = disciplinasDb.find(d => 
        d.nome.toLowerCase() === row.DISCIPLINA.trim().toLowerCase()
      );
      if (!disciplinaExiste) {
        errors.push(`Disciplina "${row.DISCIPLINA}" não cadastrada em Disciplinas`);
      }
    }

    if (row.ÁREA?.trim()) {
      const areaExiste = areas.find(a => 
        a.nome.toLowerCase() === row.ÁREA.trim().toLowerCase()
      );
      if (!areaExiste) {
        errors.push(`Área "${row.ÁREA}" não encontrada`);
      }
    }

    const status = errors.length === 0 ? "ok" : "error";

    return { data: row, status, errors, index };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json<ImportRow>(worksheet);

      if (jsonData.length === 0) {
        toast({
          title: "Erro",
          description: "O arquivo está vazio",
          variant: "destructive"
        });
        return;
      }

      const preview = jsonData.map((row, index) => validateRow(row, index));
      setImportPreviewData(preview);
      setIsImportDialogOpen(true);
    } catch (error) {
      console.error("Erro ao ler arquivo:", error);
      toast({
        title: "Erro",
        description: "Erro ao processar arquivo Excel",
        variant: "destructive"
      });
    }

    event.target.value = "";
  };

  const importData = async () => {
    const validRows = importPreviewData.filter(row => row.status === "ok");
    
    if (validRows.length === 0) {
      toast({
        title: "Erro",
        description: "Nenhum registro válido para importar",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    setImportProgress(0);

    try {
      const batchSize = 50;
      let imported = 0;

      for (let i = 0; i < validRows.length; i += batchSize) {
        const batch = validRows.slice(i, i + batchSize);
        
        const dataToInsert = batch.map(row => {
          const area = areas.find(a => 
            a.nome.toLowerCase() === row.data.ÁREA?.trim().toLowerCase()
          );

          return {
            codigo: row.data.CÓDIGO.trim(),
            disciplina: row.data.DISCIPLINA.trim(),
            area_id: area?.id || null,
            descricao: row.data.DESCRIÇÃO?.trim() || null,
            ativo: true
          };
        });

        const { error } = await supabase
          .from("desenhos_eletrica")
          .insert(dataToInsert);

        if (error) throw error;

        imported += batch.length;
        setImportProgress(Math.round((imported / validRows.length) * 100));
      }

      toast({
        title: "Sucesso",
        description: `${imported} desenhos importados com sucesso`
      });

      setIsImportDialogOpen(false);
      setImportPreviewData([]);
      carregarDesenhos();
    } catch (error: any) {
      console.error("Erro ao importar:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao importar desenhos",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
      setImportProgress(0);
    }
  };

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === desenhosFiltrados.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(desenhosFiltrados.map(d => d.id)));
    }
  };

  const cancelSelection = () => {
    setSelectedIds(new Set());
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;

    setIsDeleting(true);
    setDeleteProgress(0);

    try {
      const idsArray = Array.from(selectedIds);
      const batchSize = 10;
      let deleted = 0;

      for (let i = 0; i < idsArray.length; i += batchSize) {
        const batch = idsArray.slice(i, i + batchSize);
        
        const { error } = await supabase
          .from("desenhos_eletrica")
          .update({ ativo: false })
          .in("id", batch);

        if (error) throw error;

        deleted += batch.length;
        setDeleteProgress(Math.round((deleted / idsArray.length) * 100));
      }

      toast({
        title: "Sucesso",
        description: `${deleted} desenhos excluídos com sucesso`
      });

      setIsDeleteDialogOpen(false);
      setSelectedIds(new Set());
      carregarDesenhos();
    } catch (error: any) {
      console.error("Erro ao excluir:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir desenhos",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setDeleteProgress(0);
    }
  };

  const desenhosFiltrados = desenhos.filter(desenho =>
    desenho.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    desenho.disciplina.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <Card className="border-l-4 border-l-blue-500 border-blue-200 dark:border-blue-800">
          <CardHeader className="bg-blue-50 dark:bg-blue-950/20">
            <CardTitle className="text-blue-800 dark:text-blue-200">Cadastro de Desenhos - Elétrica/Instrumentação</CardTitle>
            <CardDescription className="text-blue-600 dark:text-blue-300">
              Gerencie os desenhos técnicos de elétrica e instrumentação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-72">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por código ou disciplina..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={downloadTemplate}
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Template
                </Button>

                <label htmlFor="file-upload">
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50"
                    asChild
                  >
                    <span>
                      <Upload className="mr-2 h-4 w-4" />
                      Importar Excel
                    </span>
                  </Button>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Desenho
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingDesenho ? "Editar Desenho" : "Novo Desenho"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingDesenho ? "Editar informações do desenho" : "Cadastrar novo desenho elétrico"}
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
                            placeholder="Ex: ELE-001"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="disciplina" className="text-right">
                            Disciplina *
                          </Label>
                        <Select value={formData.disciplina} onValueChange={(value) => setFormData({ ...formData, disciplina: value })}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Selecione a disciplina" />
                          </SelectTrigger>
                          <SelectContent>
                            {disciplinasDb.map((disciplina) => (
                              <SelectItem key={disciplina.id} value={disciplina.nome}>
                                {disciplina.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="area_id" className="text-right">
                            Área do Projeto
                          </Label>
                          <Select value={formData.area_id} onValueChange={(value) => setFormData({ ...formData, area_id: value })}>
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Selecione a área" />
                            </SelectTrigger>
                            <SelectContent>
                              {areas.map((area) => (
                                <SelectItem key={area.id} value={area.id}>
                                  {area.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="descricao" className="text-right">
                            Descrição
                          </Label>
                          <Textarea
                            id="descricao"
                            value={formData.descricao}
                            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                            className="col-span-3"
                            placeholder="Descrição do desenho"
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
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedIds.size === desenhosFiltrados.length && desenhosFiltrados.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {desenhosFiltrados.map((desenho) => (
                  <TableRow key={desenho.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(desenho.id)}
                        onCheckedChange={() => toggleSelection(desenho.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{desenho.codigo}</TableCell>
                    <TableCell>{desenho.disciplina}</TableCell>
                    <TableCell>{desenho.areas_projeto?.nome || "-"}</TableCell>
                    <TableCell>{desenho.descricao || "-"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(desenho)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(desenho.id, desenho.codigo)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {desenhosFiltrados.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? "Nenhum desenho encontrado com os critérios de busca" : "Nenhum desenho cadastrado"}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog de Importação */}
        <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Preview de Importação - Desenhos</DialogTitle>
              <DialogDescription>
                Revise os dados antes de importar. Apenas registros válidos serão importados.
              </DialogDescription>
            </DialogHeader>

            {isImporting && (
              <div className="space-y-2">
                <Progress value={importProgress} className="w-full" />
                <p className="text-sm text-center text-muted-foreground">
                  Importando... {importProgress}%
                </p>
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {importPreviewData.map((row) => (
                  <TableRow key={row.index}>
                    <TableCell>{row.index + 1}</TableCell>
                    <TableCell>{row.data.CÓDIGO}</TableCell>
                    <TableCell>{row.data.DISCIPLINA}</TableCell>
                    <TableCell>{row.data.ÁREA || "-"}</TableCell>
                    <TableCell>{row.data.DESCRIÇÃO || "-"}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant={row.status === "ok" ? "default" : "destructive"}>
                          {row.status === "ok" ? "✓ Válido" : "✗ Erro"}
                        </Badge>
                        {row.errors.length > 0 && (
                          <ul className="text-xs text-red-600 list-disc list-inside">
                            {row.errors.map((error, i) => (
                              <li key={i}>{error}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsImportDialogOpen(false)}
                disabled={isImporting}
              >
                Cancelar
              </Button>
              <Button
                onClick={importData}
                disabled={isImporting || importPreviewData.filter(r => r.status === "ok").length === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                Importar ({importPreviewData.filter(r => r.status === "ok").length} registros válidos)
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* AlertDialog de Confirmação de Exclusão */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir {selectedIds.size} desenho(s) selecionado(s)?
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>

            {isDeleting && (
              <div className="space-y-2">
                <Progress value={deleteProgress} className="w-full" />
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
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? "Excluindo..." : "Confirmar Exclusão"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Barra de Ações Flutuante */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-background border rounded-lg shadow-lg p-4 flex items-center gap-4">
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {selectedIds.size} selecionado(s)
          </Badge>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir Selecionados
          </Button>
          <Button variant="outline" onClick={cancelSelection}>
            Cancelar Seleção
          </Button>
        </div>
      )}
    </Layout>
  );
}