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
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search, Download, Upload } from "lucide-react";
import * as XLSX from "xlsx";

interface ImportRow {
  DESENHO?: string;
  "TIPO DE LUMINÁRIA": string;
  TAG: string;
  DESCRIÇÃO?: string;
}

interface PreviewRow {
  data: ImportRow;
  status: "ok" | "warning" | "error";
  errors: string[];
  index: number;
}

export default function EletricaLuminárias() {
  const [luminarias, setLuminarias] = useState<any[]>([]);
  const [desenhos, setDesenhos] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLuminaria, setEditingLuminaria] = useState<any>(null);
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
    desenho_id: "",
    tipo_luminaria: "",
    tag: "",
    descricao: ""
  });

  useEffect(() => {
    carregarLuminarias();
    carregarDesenhos();
  }, []);

  const carregarLuminarias = async () => {
    try {
      const { data, error } = await supabase
        .from("luminarias_eletrica")
        .select(`
          *,
          desenhos_eletrica(codigo)
        `)
        .eq("ativo", true)
        .order("tag", { ascending: true });

      if (error) throw error;
      setLuminarias(data || []);
    } catch (error) {
      console.error("Erro ao carregar luminárias:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar lista de luminárias",
        variant: "destructive"
      });
    }
  };

  const carregarDesenhos = async () => {
    try {
      const { data, error } = await supabase
        .from("desenhos_eletrica")
        .select("id, codigo")
        .eq("ativo", true)
        .order("codigo", { ascending: true });

      if (error) throw error;
      setDesenhos(data || []);
    } catch (error) {
      console.error("Erro ao carregar desenhos:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      desenho_id: "",
      tipo_luminaria: "",
      tag: "",
      descricao: ""
    });
    setEditingLuminaria(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tipo_luminaria.trim() || !formData.tag.trim()) {
      toast({
        title: "Erro",
        description: "Tipo de luminária e TAG são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      if (editingLuminaria) {
        const { error } = await supabase
          .from("luminarias_eletrica")
          .update(formData)
          .eq("id", editingLuminaria.id);

        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Luminária atualizada com sucesso"
        });
      } else {
        const { error } = await supabase
          .from("luminarias_eletrica")
          .insert([formData]);

        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Luminária cadastrada com sucesso"
        });
      }

      resetForm();
      setIsDialogOpen(false);
      carregarLuminarias();
    } catch (error: any) {
      console.error("Erro ao salvar luminária:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar luminária",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (luminaria: any) => {
    setEditingLuminaria(luminaria);
    setFormData({
      desenho_id: luminaria.desenho_id || "",
      tipo_luminaria: luminaria.tipo_luminaria,
      tag: luminaria.tag,
      descricao: luminaria.descricao || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, tag: string) => {
    if (!confirm(`Tem certeza que deseja excluir a luminária ${tag}?`)) return;

    try {
      const { error } = await supabase
        .from("luminarias_eletrica")
        .update({ ativo: false })
        .eq("id", id);

      if (error) throw error;
      toast({
        title: "Sucesso",
        description: "Luminária excluída com sucesso"
      });
      carregarLuminarias();
    } catch (error: any) {
      console.error("Erro ao excluir luminária:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir luminária",
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
    if (selectedIds.size === luminariasFiltradas.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(luminariasFiltradas.map(l => l.id)));
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
          .from("luminarias_eletrica")
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
      description: `${processedCount} luminária(s) excluída(s) com sucesso`
    });

    carregarLuminarias();
  };

  const luminariasFiltradas = luminarias.filter(luminaria =>
    luminaria.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    luminaria.tipo_luminaria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadTemplate = () => {
    const template = [
      {
        "DESENHO": "DWG-001",
        "TIPO DE LUMINÁRIA": "LED 40W",
        "TAG": "LUM-001",
        "DESCRIÇÃO": "Luminária LED sobrepor"
      },
      {
        "DESENHO": "DWG-002",
        "TIPO DE LUMINÁRIA": "Fluorescente 2x32W",
        "TAG": "LUM-002",
        "DESCRIÇÃO": "Luminária fluorescente embutir"
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "template_luminarias.xlsx");
  };

  const validateRow = (row: ImportRow, index: number): PreviewRow => {
    const errors: string[] = [];
    
    if (!row["TIPO DE LUMINÁRIA"]?.trim()) {
      errors.push("Tipo de luminária é obrigatório");
    }

    if (!row.TAG?.trim()) {
      errors.push("TAG é obrigatória");
    }

    const status = errors.length > 0 ? "error" : "ok";
    return { data: row, status, errors, index };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<ImportRow>(worksheet);

        const preview = jsonData.map((row, index) => validateRow(row, index));
        setImportPreviewData(preview);
        setIsImportDialogOpen(true);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao ler arquivo Excel",
          variant: "destructive",
        });
      }
    };
    reader.readAsArrayBuffer(file);
    event.target.value = "";
  };

  const importData = async () => {
    const validRows = importPreviewData.filter(row => row.status === "ok");
    if (validRows.length === 0) {
      toast({
        title: "Erro",
        description: "Nenhuma linha válida para importar",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    setImportProgress(0);

    let successCount = 0;
    let errorCount = 0;
    const batchSize = 50;

    for (let i = 0; i < validRows.length; i += batchSize) {
      const batch = validRows.slice(i, i + batchSize);
      
      const inserts = batch.map(row => {
        const desenho = desenhos.find(d => 
          d.codigo.toLowerCase() === row.data.DESENHO?.trim().toLowerCase()
        );

        return {
          desenho_id: desenho?.id || null,
          tipo_luminaria: row.data["TIPO DE LUMINÁRIA"].trim(),
          tag: row.data.TAG.trim(),
          descricao: row.data.DESCRIÇÃO?.trim() || null,
        };
      });

      try {
        const { error } = await supabase
          .from("luminarias_eletrica")
          .insert(inserts);

        if (error) throw error;
        successCount += batch.length;
      } catch (error) {
        errorCount += batch.length;
      }

      setImportProgress(Math.round(((i + batch.length) / validRows.length) * 100));
    }

    setIsImporting(false);
    setIsImportDialogOpen(false);
    setImportPreviewData([]);
    
    toast({
      title: "Importação concluída",
      description: `${successCount} registros importados, ${errorCount} erros`,
    });

    carregarLuminarias();
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <Card className="border-l-4 border-l-blue-500 border-blue-200 dark:border-blue-800">
          <CardHeader className="bg-blue-50 dark:bg-blue-950/20">
            <CardTitle className="text-blue-800 dark:text-blue-200">Cadastro de Luminárias - Elétrica/Instrumentação</CardTitle>
            <CardDescription className="text-blue-600 dark:text-blue-300">
              Gerencie luminárias com tipo, potência, localização e quantidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-72">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por TAG ou tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={downloadTemplate}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Template
                </Button>
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("file-upload-luminarias")?.click()}
                  className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Excel
                </Button>
                <input
                  id="file-upload-luminarias"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      Nova Luminária
                    </Button>
                  </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingLuminaria ? "Editar Luminária" : "Nova Luminária"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingLuminaria ? "Editar informações da luminária" : "Cadastrar nova luminária"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="desenho_id" className="text-right">
                          Desenho
                        </Label>
                        <Select value={formData.desenho_id} onValueChange={(value) => setFormData({ ...formData, desenho_id: value })}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Selecione o desenho" />
                          </SelectTrigger>
                          <SelectContent>
                            {desenhos.map((desenho) => (
                              <SelectItem key={desenho.id} value={desenho.id}>
                                {desenho.codigo}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tipo_luminaria" className="text-right">
                          Tipo de Luminária *
                        </Label>
                        <Input
                          id="tipo_luminaria"
                          value={formData.tipo_luminaria}
                          onChange={(e) => setFormData({ ...formData, tipo_luminaria: e.target.value })}
                          className="col-span-3"
                          placeholder="Ex: LED, Fluorescente"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tag" className="text-right">
                          TAG *
                        </Label>
                        <Input
                          id="tag"
                          value={formData.tag}
                          onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                          className="col-span-3"
                          placeholder="Ex: LUM-001"
                          required
                        />
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
                          placeholder="Descrição da luminária"
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
                  <TableHead className="w-12"><Checkbox checked={selectedIds.size === luminariasFiltradas.length && luminariasFiltradas.length > 0} onCheckedChange={toggleSelectAll} /></TableHead>
                  <TableHead>TAG</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Desenho</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {luminariasFiltradas.map((luminaria) => (
                  <TableRow key={luminaria.id}>
                    <TableCell><Checkbox checked={selectedIds.has(luminaria.id)} onCheckedChange={() => toggleSelection(luminaria.id)} /></TableCell>
                    <TableCell className="font-medium">{luminaria.tag}</TableCell>
                    <TableCell>{luminaria.tipo_luminaria}</TableCell>
                    <TableCell>{luminaria.desenhos_eletrica?.codigo || "-"}</TableCell>
                    <TableCell>{luminaria.descricao || "-"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(luminaria)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(luminaria.id, luminaria.tag)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {luminariasFiltradas.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? "Nenhuma luminária encontrada com os critérios de busca" : "Nenhuma luminária cadastrada"}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Preview de Importação</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-blue-700 font-medium">Total de Linhas</div>
                  <div className="text-2xl font-bold">{importPreviewData.length}</div>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-green-700 font-medium">Válidas</div>
                  <div className="text-2xl font-bold">{importPreviewData.filter(r => r.status === "ok").length}</div>
                </div>
                <div className="bg-red-50 p-3 rounded">
                  <div className="text-red-700 font-medium">Com Erros</div>
                  <div className="text-2xl font-bold">{importPreviewData.filter(r => r.status === "error").length}</div>
                </div>
              </div>

              {isImporting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Importando...</span>
                    <span>{importProgress}%</span>
                  </div>
                  <Progress value={importProgress} />
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>TAG</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Desenho</TableHead>
                    <TableHead>Erros</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importPreviewData.map((row) => (
                    <TableRow key={row.index} className={row.status === "error" ? "bg-red-50" : ""}>
                      <TableCell>{row.index + 1}</TableCell>
                      <TableCell>
                        {row.status === "ok" && <Badge className="bg-green-500">OK</Badge>}
                        {row.status === "error" && <Badge variant="destructive">Erro</Badge>}
                      </TableCell>
                      <TableCell>{row.data.TAG}</TableCell>
                      <TableCell>{row.data["TIPO DE LUMINÁRIA"]}</TableCell>
                      <TableCell>{row.data.DESENHO || "-"}</TableCell>
                      <TableCell className="text-red-600 text-sm">{row.errors.join(", ")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsImportDialogOpen(false)} disabled={isImporting}>
                  Cancelar
                </Button>
                <Button onClick={importData} disabled={isImporting || importPreviewData.filter(r => r.status === "ok").length === 0}>
                  {isImporting ? "Importando..." : "Importar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {selectedIds.size > 0 && (<div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg flex items-center gap-4 z-50"><Badge variant="secondary" className="bg-primary-foreground text-primary">{selectedIds.size} selecionado(s)</Badge><Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)}><Trash2 className="h-4 w-4 mr-2" />Excluir Selecionados</Button><Button variant="secondary" size="sm" onClick={cancelSelection}>Cancelar Seleção</Button></div>)}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle><AlertDialogDescription>Tem certeza que deseja excluir {selectedIds.size} luminária(s)?</AlertDialogDescription></AlertDialogHeader>{isDeleting && <div className="space-y-2"><Progress value={deleteProgress} /><p className="text-sm text-center text-muted-foreground">Excluindo... {deleteProgress}%</p></div>}<AlertDialogFooter><AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleDeleteSelected} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{isDeleting ? "Excluindo..." : "Confirmar Exclusão"}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </Layout>
  );
}