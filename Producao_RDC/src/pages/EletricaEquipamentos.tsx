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
  "ÁREA DO PROJETO"?: string;
  DISCIPLINA: string;
  "TIPO DE EQUIPAMENTO": string;
  TAG: string;
  DESCRIÇÃO?: string;
}

interface PreviewRow {
  data: ImportRow;
  status: "ok" | "warning" | "error";
  errors: string[];
  warnings: string[];
  index: number;
  dbError?: string;
}

export default function EletricaEquipamentos() {
  const [equipamentos, setEquipamentos] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [disciplinasDb, setDisciplinasDb] = useState<{id: string; nome: string}[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEquipamento, setEditingEquipamento] = useState<any>(null);
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
  const [importErrors, setImportErrors] = useState<Map<number, string>>(new Map());
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    area_id: "",
    disciplina: "",
    tipo_equipamento: "",
    tag: "",
    descricao: ""
  });


  useEffect(() => {
    carregarEquipamentos();
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

  const carregarEquipamentos = async () => {
    try {
      const { data, error } = await supabase
        .from("equipamentos_eletricos")
        .select(`
          *,
          areas_projeto(nome)
        `)
        .eq("ativo", true)
        .order("tag", { ascending: true });

      if (error) throw error;
      setEquipamentos(data || []);
    } catch (error) {
      console.error("Erro ao carregar equipamentos:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar lista de equipamentos",
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

  const resetForm = () => {
    setFormData({
      area_id: "",
      disciplina: "",
      tipo_equipamento: "",
      tag: "",
      descricao: ""
    });
    setEditingEquipamento(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.disciplina || !formData.tipo_equipamento.trim() || !formData.tag.trim()) {
      toast({
        title: "Erro",
        description: "Disciplina, tipo de equipamento e TAG são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      if (editingEquipamento) {
        const { error } = await supabase
          .from("equipamentos_eletricos")
          .update(formData)
          .eq("id", editingEquipamento.id);

        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Equipamento atualizado com sucesso"
        });
      } else {
        const { error } = await supabase
          .from("equipamentos_eletricos")
          .insert([formData]);

        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Equipamento cadastrado com sucesso"
        });
      }

      resetForm();
      setIsDialogOpen(false);
      carregarEquipamentos();
    } catch (error: any) {
      console.error("Erro ao salvar equipamento:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar equipamento",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (equipamento: any) => {
    setEditingEquipamento(equipamento);
    setFormData({
      area_id: equipamento.area_id || "",
      disciplina: equipamento.disciplina,
      tipo_equipamento: equipamento.tipo_equipamento,
      tag: equipamento.tag,
      descricao: equipamento.descricao || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, tag: string) => {
    if (!confirm(`Tem certeza que deseja excluir o equipamento ${tag}?`)) return;

    try {
      const { error } = await supabase
        .from("equipamentos_eletricos")
        .update({ ativo: false })
        .eq("id", id);

      if (error) throw error;
      toast({
        title: "Sucesso",
        description: "Equipamento excluído com sucesso"
      });
      carregarEquipamentos();
    } catch (error: any) {
      console.error("Erro ao excluir equipamento:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir equipamento",
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
    if (selectedIds.size === equipamentosFiltrados.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(equipamentosFiltrados.map(e => e.id)));
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
          .from("equipamentos_eletricos")
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
      description: `${processedCount} equipamento(s) excluído(s) com sucesso`
    });

    carregarEquipamentos();
  };

  const equipamentosFiltrados = equipamentos.filter(equipamento =>
    equipamento.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipamento.tipo_equipamento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadTemplate = () => {
    // Usar disciplinas reais do banco de dados
    const disciplinasExemplo = disciplinasDb.slice(0, 2).map(d => d.nome);
    const areasExemplo = areas.slice(0, 2).map(a => a.nome);
    
    const template = [
      {
        "ÁREA DO PROJETO": areasExemplo[0] || "Área 01",
        "DISCIPLINA": disciplinasExemplo[0] || "Automação",
        "TIPO DE EQUIPAMENTO": "Motor",
        "TAG": "MT-001",
        "DESCRIÇÃO": "Motor elétrico 100HP"
      },
      {
        "ÁREA DO PROJETO": areasExemplo[1] || "Área 02",
        "DISCIPLINA": disciplinasExemplo[1] || "Força",
        "TIPO DE EQUIPAMENTO": "Painel",
        "TAG": "QL-001",
        "DESCRIÇÃO": "Quadro de iluminação"
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "template_equipamentos.xlsx");
  };

  const validateRow = async (row: ImportRow, index: number): Promise<PreviewRow> => {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Validação de disciplina com normalização
    if (!row.DISCIPLINA?.trim()) {
      errors.push("Disciplina é obrigatória");
    } else {
      const disciplinaInput = row.DISCIPLINA.trim();
      const disciplinaMatch = disciplinasDb.find(d => 
        d.nome.toLowerCase() === disciplinaInput.toLowerCase()
      );
      
      if (!disciplinaMatch) {
        const disciplinasDisponiveis = disciplinasDb.map(d => d.nome).join(", ");
        errors.push(`Disciplina "${disciplinaInput}" não cadastrada. Disponíveis: ${disciplinasDisponiveis}`);
      } else {
        // Armazenar a disciplina correta (com capitalização exata do banco)
        (row as any)._disciplinaCorreta = disciplinaMatch.nome;
      }
    }

    // Validação de tipo de equipamento
    if (!row["TIPO DE EQUIPAMENTO"]?.trim()) {
      errors.push("Tipo de equipamento é obrigatório");
    }

    // Validação de TAG
    if (!row.TAG?.trim()) {
      errors.push("TAG é obrigatória");
    } else {
      // Verificar TAG duplicada no banco
      try {
        const { data: existingTag } = await supabase
          .from("equipamentos_eletricos")
          .select("tag")
          .eq("tag", row.TAG.trim())
          .eq("ativo", true)
          .maybeSingle();
        
        if (existingTag) {
          errors.push(`TAG "${row.TAG}" já existe no banco de dados`);
        }
      } catch (error) {
        console.error("Erro ao verificar TAG duplicada:", error);
      }
    }

    // Validação de área (warning se não encontrada)
    if (row["ÁREA DO PROJETO"]?.trim()) {
      const areaExiste = areas.find(a => 
        a.nome.toLowerCase() === row["ÁREA DO PROJETO"].trim().toLowerCase()
      );
      if (!areaExiste) {
        warnings.push(`Área "${row["ÁREA DO PROJETO"]}" não encontrada`);
      }
    }

    const status = errors.length > 0 ? "error" : warnings.length > 0 ? "warning" : "ok";
    return { data: row, status, errors, warnings, index };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Verificar se disciplinas foram carregadas
    if (disciplinasDb.length === 0) {
      toast({
        title: "Aguarde",
        description: "Carregando dados necessários para validação. Tente novamente em instantes.",
        variant: "destructive",
      });
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<ImportRow>(worksheet);

        // Validar todas as linhas (aguardar todas as validações assíncronas)
        const preview = await Promise.all(
          jsonData.map((row, index) => validateRow(row, index))
        );
        
        setImportPreviewData(preview);
        setImportErrors(new Map());
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
    const validRows = importPreviewData.filter(row => row.status === "ok" || row.status === "warning");
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
    const newErrors = new Map<number, string>();
    const updatedPreview = [...importPreviewData];

    // Processar linha por linha para capturar erros específicos
    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i];
      
      const area = areas.find(a => 
        a.nome.toLowerCase() === row.data["ÁREA DO PROJETO"]?.trim().toLowerCase()
      );

      // Usar a disciplina correta do banco (com capitalização exata)
      const disciplinaParaInserir = (row.data as any)._disciplinaCorreta || row.data.DISCIPLINA.trim();

      const insertData = {
        area_id: area?.id || null,
        disciplina: disciplinaParaInserir,
        tipo_equipamento: row.data["TIPO DE EQUIPAMENTO"].trim(),
        tag: row.data.TAG.trim(),
        descricao: row.data.DESCRIÇÃO?.trim() || null,
      };

      try {
        const { error } = await supabase
          .from("equipamentos_eletricos")
          .insert([insertData]);

        if (error) {
          throw error;
        }
        successCount++;
      } catch (error: any) {
        errorCount++;
        const errorMsg = error.message || "Erro desconhecido ao inserir";
        newErrors.set(row.index, errorMsg);
        
        // Atualizar preview com erro de banco
        const previewIndex = importPreviewData.findIndex(p => p.index === row.index);
        if (previewIndex >= 0) {
          updatedPreview[previewIndex] = {
            ...updatedPreview[previewIndex],
            status: "error",
            dbError: errorMsg
          };
        }
        
        console.error(`Erro ao importar linha ${row.index + 1}:`, error);
      }

      setImportProgress(Math.round(((i + 1) / validRows.length) * 100));
    }

    setIsImporting(false);
    
    // Se houver erros, manter o dialog aberto e atualizar preview
    if (errorCount > 0) {
      setImportErrors(newErrors);
      setImportPreviewData(updatedPreview);
      toast({
        title: "Importação concluída com erros",
        description: `${successCount} registros importados, ${errorCount} erros. Verifique os detalhes abaixo.`,
        variant: "destructive",
      });
    } else {
      // Se tudo OK, fechar dialog
      setIsImportDialogOpen(false);
      setImportPreviewData([]);
      setImportErrors(new Map());
      toast({
        title: "Importação concluída",
        description: `${successCount} registros importados com sucesso`,
      });
    }

    carregarEquipamentos();
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <Card className="border-l-4 border-l-blue-500 border-blue-200 dark:border-blue-800">
          <CardHeader className="bg-blue-50 dark:bg-blue-950/20">
            <CardTitle className="text-blue-800 dark:text-blue-200">Cadastro de Equipamentos Elétricos</CardTitle>
            <CardDescription className="text-blue-600 dark:text-blue-300">
              Gerencie motores, painéis, QGBT e outros equipamentos elétricos
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
                  onClick={() => document.getElementById("file-upload-equipamentos")?.click()}
                  className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Excel
                </Button>
                <input
                  id="file-upload-equipamentos"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Equipamento
                    </Button>
                  </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingEquipamento ? "Editar Equipamento" : "Novo Equipamento"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingEquipamento ? "Editar informações do equipamento" : "Cadastrar novo equipamento elétrico"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
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
                        <Label htmlFor="tipo_equipamento" className="text-right">
                          Tipo de Equipamento *
                        </Label>
                        <Input
                          id="tipo_equipamento"
                          value={formData.tipo_equipamento}
                          onChange={(e) => setFormData({ ...formData, tipo_equipamento: e.target.value })}
                          className="col-span-3"
                          placeholder="Ex: Motor, Painel, QGBT"
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
                          placeholder="Ex: MT-001"
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
                          placeholder="Descrição do equipamento"
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
                      checked={selectedIds.size === equipamentosFiltrados.length && equipamentosFiltrados.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>TAG</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipamentosFiltrados.map((equipamento) => (
                  <TableRow key={equipamento.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(equipamento.id)}
                        onCheckedChange={() => toggleSelection(equipamento.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{equipamento.tag}</TableCell>
                    <TableCell>{equipamento.tipo_equipamento}</TableCell>
                    <TableCell>{equipamento.disciplina}</TableCell>
                    <TableCell>{equipamento.areas_projeto?.nome || "-"}</TableCell>
                    <TableCell>{equipamento.descricao || "-"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(equipamento)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(equipamento.id, equipamento.tag)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {equipamentosFiltrados.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? "Nenhum equipamento encontrado com os critérios de busca" : "Nenhum equipamento cadastrado"}
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
                 <div className="bg-yellow-50 p-3 rounded">
                   <div className="text-yellow-700 font-medium">Com Avisos</div>
                   <div className="text-2xl font-bold">{importPreviewData.filter(r => r.status === "warning").length}</div>
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
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Mensagens</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importPreviewData.map((row) => (
                    <TableRow 
                      key={row.index} 
                      className={
                        row.status === "error" ? "bg-red-50 dark:bg-red-950/20" : 
                        row.status === "warning" ? "bg-yellow-50 dark:bg-yellow-950/20" : ""
                      }
                    >
                      <TableCell>{row.index + 1}</TableCell>
                      <TableCell>
                        {row.status === "ok" && <Badge className="bg-green-500">OK</Badge>}
                        {row.status === "warning" && <Badge className="bg-yellow-500">Aviso</Badge>}
                        {row.status === "error" && <Badge variant="destructive">Erro</Badge>}
                      </TableCell>
                      <TableCell>{row.data.TAG}</TableCell>
                      <TableCell>{row.data["TIPO DE EQUIPAMENTO"]}</TableCell>
                      <TableCell>{row.data.DISCIPLINA}</TableCell>
                      <TableCell className="text-sm">
                        {row.errors.length > 0 && (
                          <div className="text-red-600 dark:text-red-400">
                            {row.errors.join(", ")}
                          </div>
                        )}
                        {row.warnings.length > 0 && (
                          <div className="text-yellow-600 dark:text-yellow-400">
                            {row.warnings.join(", ")}
                          </div>
                        )}
                        {row.dbError && (
                          <div className="text-red-600 dark:text-red-400 font-semibold mt-1">
                            Erro BD: {row.dbError}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsImportDialogOpen(false);
                    setImportErrors(new Map());
                  }} 
                  disabled={isImporting}
                >
                  {importErrors.size > 0 ? "Fechar" : "Cancelar"}
                </Button>
                <Button 
                  onClick={importData} 
                  disabled={isImporting || importPreviewData.filter(r => r.status === "ok" || r.status === "warning").length === 0}
                >
                  {isImporting ? "Importando..." : importErrors.size > 0 ? "Tentar Novamente" : "Importar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg flex items-center gap-4 z-50">
          <Badge variant="secondary" className="bg-primary-foreground text-primary">{selectedIds.size} selecionado(s)</Badge>
          <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)}><Trash2 className="h-4 w-4 mr-2" />Excluir Selecionados</Button>
          <Button variant="secondary" size="sm" onClick={cancelSelection}>Cancelar Seleção</Button>
        </div>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle><AlertDialogDescription>Tem certeza que deseja excluir {selectedIds.size} equipamento(s)?</AlertDialogDescription></AlertDialogHeader>
          {isDeleting && <div className="space-y-2"><Progress value={deleteProgress} /><p className="text-sm text-center text-muted-foreground">Excluindo... {deleteProgress}%</p></div>}
          <AlertDialogFooter><AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleDeleteSelected} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{isDeleting ? "Excluindo..." : "Confirmar Exclusão"}</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}