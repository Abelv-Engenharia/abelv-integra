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
import { SelectWithClear } from "@/components/ui/select-with-clear";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search, Download, Upload } from "lucide-react";
import * as XLSX from "xlsx";

interface ImportRow {
  ÁREA?: string;
  DESENHO?: string;
  FLUIDO?: string;
  LINHA?: string;
  "TIPO DE INSTRUMENTO": string;
  TAG: string;
  DESCRIÇÃO?: string;
}

interface PreviewRow {
  data: ImportRow;
  status: "ok" | "warning" | "error";
  errors: string[];
  index: number;
}

export default function EletricaInstrumentos() {
  const [instrumentos, setInstrumentos] = useState<any[]>([]);
  const [desenhos, setDesenhos] = useState<any[]>([]);
  const [fluidos, setFluidos] = useState<any[]>([]);
  const [linhas, setLinhas] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInstrumento, setEditingInstrumento] = useState<any>(null);
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
    area_id: "",
    desenho_id: "",
    fluido_id: "",
    linha_id: "",
    tipo_instrumento: "",
    tag: "",
    descricao: ""
  });

  useEffect(() => {
    carregarInstrumentos();
    carregarDesenhos();
    carregarFluidos();
    carregarLinhas();
    carregarAreas();
  }, []);

  const carregarInstrumentos = async () => {
    try {
      const { data, error } = await supabase
        .from("instrumentos_eletrica")
        .select(`
          *,
          desenhos_eletrica(codigo),
          fluidos(nome),
          linhas(nome_linha),
          areas_projeto(nome)
        `)
        .eq("ativo", true)
        .order("tag", { ascending: true });

      if (error) throw error;
      setInstrumentos(data || []);
    } catch (error) {
      console.error("Erro ao carregar instrumentos:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar lista de instrumentos",
        variant: "destructive"
      });
    }
  };

  const carregarAreas = async () => {
    try {
      const { data, error } = await supabase
        .from("areas_projeto")
        .select("id, nome")
        .eq("ativo", true)
        .order("nome", { ascending: true });

      if (error) throw error;
      setAreas(data || []);
    } catch (error) {
      console.error("Erro ao carregar áreas:", error);
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

  const carregarFluidos = async () => {
    try {
      const { data, error } = await supabase
        .from("fluidos")
        .select("id, nome")
        .order("nome", { ascending: true });

      if (error) throw error;
      setFluidos(data || []);
    } catch (error) {
      console.error("Erro ao carregar fluidos:", error);
    }
  };

  const carregarLinhas = async () => {
    try {
      const { data, error } = await supabase
        .from("linhas")
        .select("id, nome_linha")
        .order("nome_linha", { ascending: true });

      if (error) throw error;
      setLinhas(data || []);
    } catch (error) {
      console.error("Erro ao carregar linhas:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      area_id: "",
      desenho_id: "",
      fluido_id: "",
      linha_id: "",
      tipo_instrumento: "",
      tag: "",
      descricao: ""
    });
    setEditingInstrumento(null);
  };

  const handleClearDesenho = () => {
    setFormData({ ...formData, desenho_id: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tipo_instrumento.trim() || !formData.tag.trim()) {
      toast({
        title: "Erro",
        description: "Tipo de instrumento e TAG são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Preparar dados, convertendo strings vazias para null nos campos opcionais UUID
      const dataToSubmit = {
        ...formData,
        area_id: formData.area_id || null,
        desenho_id: formData.desenho_id || null,
        fluido_id: formData.fluido_id || null,
        linha_id: formData.linha_id || null,
        descricao: formData.descricao || null
      };

      if (editingInstrumento) {
        const { error } = await supabase
          .from("instrumentos_eletrica")
          .update(dataToSubmit)
          .eq("id", editingInstrumento.id);

        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Instrumento atualizado com sucesso"
        });
      } else {
        const { error } = await supabase
          .from("instrumentos_eletrica")
          .insert([dataToSubmit]);

        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Instrumento cadastrado com sucesso"
        });
      }

      resetForm();
      setIsDialogOpen(false);
      carregarInstrumentos();
    } catch (error: any) {
      console.error("Erro ao salvar instrumento:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar instrumento",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (instrumento: any) => {
    setEditingInstrumento(instrumento);
    setFormData({
      area_id: instrumento.area_id || "",
      desenho_id: instrumento.desenho_id || "",
      fluido_id: instrumento.fluido_id || "",
      linha_id: instrumento.linha_id || "",
      tipo_instrumento: instrumento.tipo_instrumento,
      tag: instrumento.tag,
      descricao: instrumento.descricao || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, tag: string) => {
    if (!confirm(`Tem certeza que deseja excluir o instrumento ${tag}?`)) return;

    try {
      const { error } = await supabase
        .from("instrumentos_eletrica")
        .update({ ativo: false })
        .eq("id", id);

      if (error) throw error;
      toast({
        title: "Sucesso",
        description: "Instrumento excluído com sucesso"
      });
      carregarInstrumentos();
    } catch (error: any) {
      console.error("Erro ao excluir instrumento:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir instrumento",
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
    if (selectedIds.size === instrumentosFiltrados.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(instrumentosFiltrados.map(i => i.id)));
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
          .from("instrumentos_eletrica")
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
      description: `${processedCount} instrumento(s) excluído(s) com sucesso`
    });

    carregarInstrumentos();
  };

  const instrumentosFiltrados = instrumentos.filter(instrumento =>
    instrumento.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instrumento.tipo_instrumento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadTemplate = () => {
    const template = [
      {
        "ÁREA": "Área 01",
        "DESENHO": "DWG-001",
        "FLUIDO": "Água",
        "LINHA": "LIN-001",
        "TIPO DE INSTRUMENTO": "Transmissor de Pressão",
        "TAG": "PT-001",
        "DESCRIÇÃO": "Transmissor de pressão 0-10bar"
      },
      {
        "ÁREA": "Área 02",
        "DESENHO": "DWG-002",
        "FLUIDO": "Vapor",
        "LINHA": "LIN-002",
        "TIPO DE INSTRUMENTO": "Transmissor de Temperatura",
        "TAG": "TT-001",
        "DESCRIÇÃO": "Transmissor de temperatura 0-200°C"
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "template_instrumentos.xlsx");
  };

  const validateRow = (row: ImportRow, index: number): PreviewRow => {
    const errors: string[] = [];
    
    if (!row["TIPO DE INSTRUMENTO"]?.trim()) {
      errors.push("Tipo de instrumento é obrigatório");
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
        const area = areas.find(a => 
          a.nome.toLowerCase() === row.data.ÁREA?.trim().toLowerCase()
        );
        const desenho = desenhos.find(d => 
          d.codigo.toLowerCase() === row.data.DESENHO?.trim().toLowerCase()
        );
        const fluido = fluidos.find(f => 
          f.nome.toLowerCase() === row.data.FLUIDO?.trim().toLowerCase()
        );
        const linha = linhas.find(l => 
          l.nome_linha.toLowerCase() === row.data.LINHA?.trim().toLowerCase()
        );

        return {
          area_id: area?.id || null,
          desenho_id: desenho?.id || null,
          fluido_id: fluido?.id || null,
          linha_id: linha?.id || null,
          tipo_instrumento: row.data["TIPO DE INSTRUMENTO"].trim(),
          tag: row.data.TAG.trim(),
          descricao: row.data.DESCRIÇÃO?.trim() || null,
        };
      });

      try {
        const { error } = await supabase
          .from("instrumentos_eletrica")
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

    carregarInstrumentos();
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <Card className="border-l-4 border-l-blue-500 border-blue-200 dark:border-blue-800">
          <CardHeader className="bg-blue-50 dark:bg-blue-950/20">
            <CardTitle className="text-blue-800 dark:text-blue-200">Cadastro de Instrumentos - Elétrica/Instrumentação</CardTitle>
            <CardDescription className="text-blue-600 dark:text-blue-300">
              Gerencie instrumentos com tipo, tag, localização e status
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
                  onClick={() => document.getElementById("file-upload-instrumentos")?.click()}
                  className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Excel
                </Button>
                <input
                  id="file-upload-instrumentos"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Instrumento
                    </Button>
                  </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingInstrumento ? "Editar Instrumento" : "Novo Instrumento"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingInstrumento ? "Editar informações do instrumento" : "Cadastrar novo instrumento elétrico"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="area_id" className="text-right">
                          Área do Projeto
                        </Label>
                        <Select 
                          value={formData.area_id} 
                          onValueChange={(value) => setFormData({ ...formData, area_id: value })}
                        >
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
                        <Label htmlFor="desenho_id" className="text-right">
                          Desenho (opcional)
                        </Label>
                        <SelectWithClear 
                          value={formData.desenho_id} 
                          onValueChange={(value) => setFormData({ ...formData, desenho_id: value })}
                          onClear={handleClearDesenho}
                          clearable={true}
                          placeholder="Selecione o desenho"
                          className="col-span-3"
                        >
                          {desenhos.map((desenho) => (
                            <SelectItem key={desenho.id} value={desenho.id}>
                              {desenho.codigo}
                            </SelectItem>
                          ))}
                        </SelectWithClear>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="fluido_id" className="text-right">
                          Fluido
                        </Label>
                        <Select value={formData.fluido_id} onValueChange={(value) => setFormData({ ...formData, fluido_id: value })}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Selecione o fluido" />
                          </SelectTrigger>
                          <SelectContent>
                            {fluidos.map((fluido) => (
                              <SelectItem key={fluido.id} value={fluido.id}>
                                {fluido.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="linha_id" className="text-right">
                          Linha
                        </Label>
                        <Select value={formData.linha_id} onValueChange={(value) => setFormData({ ...formData, linha_id: value })}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Selecione a linha" />
                          </SelectTrigger>
                          <SelectContent>
                            {linhas.map((linha) => (
                              <SelectItem key={linha.id} value={linha.id}>
                                {linha.nome_linha}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tipo_instrumento" className="text-right">
                          Tipo de Instrumento *
                        </Label>
                        <Input
                          id="tipo_instrumento"
                          value={formData.tipo_instrumento}
                          onChange={(e) => setFormData({ ...formData, tipo_instrumento: e.target.value })}
                          className="col-span-3"
                          placeholder="Ex: Transmissor de Pressão"
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
                          placeholder="Ex: PT-001"
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
                          placeholder="Descrição do instrumento"
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
                  <TableHead className="w-12"><Checkbox checked={selectedIds.size === instrumentosFiltrados.length && instrumentosFiltrados.length > 0} onCheckedChange={toggleSelectAll} /></TableHead>
                  <TableHead>TAG</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>Desenho</TableHead>
                  <TableHead>Fluido</TableHead>
                  <TableHead>Linha</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {instrumentosFiltrados.map((instrumento) => (
                  <TableRow key={instrumento.id}>
                    <TableCell><Checkbox checked={selectedIds.has(instrumento.id)} onCheckedChange={() => toggleSelection(instrumento.id)} /></TableCell>
                    <TableCell className="font-medium">{instrumento.tag}</TableCell>
                    <TableCell>{instrumento.tipo_instrumento}</TableCell>
                    <TableCell>{instrumento.areas_projeto?.nome || "-"}</TableCell>
                    <TableCell>{instrumento.desenhos_eletrica?.codigo || "-"}</TableCell>
                    <TableCell>{instrumento.fluidos?.nome || "-"}</TableCell>
                    <TableCell>{instrumento.linhas?.nome_linha || "-"}</TableCell>
                    <TableCell>{instrumento.descricao || "-"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(instrumento)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(instrumento.id, instrumento.tag)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {instrumentosFiltrados.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? "Nenhum instrumento encontrado com os critérios de busca" : "Nenhum instrumento cadastrado"}
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
                      <TableCell>{row.data["TIPO DE INSTRUMENTO"]}</TableCell>
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
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle><AlertDialogDescription>Tem certeza que deseja excluir {selectedIds.size} instrumento(s)?</AlertDialogDescription></AlertDialogHeader>{isDeleting && <div className="space-y-2"><Progress value={deleteProgress} /><p className="text-sm text-center text-muted-foreground">Excluindo... {deleteProgress}%</p></div>}<AlertDialogFooter><AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleDeleteSelected} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{isDeleting ? "Excluindo..." : "Confirmar Exclusão"}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </Layout>
  );
}