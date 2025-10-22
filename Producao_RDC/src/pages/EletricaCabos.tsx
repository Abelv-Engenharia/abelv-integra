import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search, Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle, X } from "lucide-react";
import * as XLSX from "xlsx";

interface Area {
  id: string;
  nome: string;
}

interface ImportRow {
  DISCIPLINA?: string;
  ÁREA?: string;
  "SUB-ÁREA"?: string;
  CONDUTOR?: string;
  CIRCUITO?: string;
  BITOLA?: string;
  DE?: string;
  PARA?: string;
  "TIPO DE CABO"?: string;
}

interface PreviewRow {
  data: ImportRow;
  status: "ok" | "warning" | "error";
  errors: string[];
  index: number;
}

export default function EletricaCabos() {
  const [cabos, setCabos] = useState<any[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [disciplinasDb, setDisciplinasDb] = useState<{id: string; nome: string}[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCabo, setEditingCabo] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Estados para importação
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importPreviewData, setImportPreviewData] = useState<PreviewRow[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState(0);

  const [formData, setFormData] = useState({
    disciplina: "Força",
    area_id: "",
    sub_area: "",
    tipo_condutor: "",
    circuito: "",
    dimensao: "",
    ponto_origem: "",
    ponto_destino: "",
    tipo_cabo: ""
  });

  const tiposCondutor = ["Fase", "Neutro", "Terra", "Fase/Neutro"];

  useEffect(() => {
    carregarCabos();
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

  const carregarCabos = async () => {
    try {
      const { data, error } = await supabase
        .from("cabos_eletrica")
        .select(`
          *,
          areas_projeto(id, nome)
        `)
        .eq("ativo", true)
        .order("disciplina", { ascending: true });

      if (error) throw error;
      setCabos(data || []);
    } catch (error) {
      console.error("Erro ao carregar cabos:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar lista de cabos",
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
      disciplina: "Força",
      area_id: "",
      sub_area: "",
      tipo_condutor: "",
      circuito: "",
      dimensao: "",
      ponto_origem: "",
      ponto_destino: "",
      tipo_cabo: ""
    });
    setEditingCabo(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.disciplina || !formData.tipo_condutor || !formData.tipo_cabo.trim()) {
      toast({
        title: "Erro",
        description: "Disciplina, Condutor e Tipo de Cabo são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      if (editingCabo) {
        const { error } = await supabase
          .from("cabos_eletrica")
          .update(formData)
          .eq("id", editingCabo.id);

        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Cabo atualizado com sucesso"
        });
      } else {
        const { error } = await supabase
          .from("cabos_eletrica")
          .insert([formData]);

        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Cabo cadastrado com sucesso"
        });
      }

      resetForm();
      setIsDialogOpen(false);
      carregarCabos();
    } catch (error: any) {
      console.error("Erro ao salvar cabo:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar cabo",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (cabo: any) => {
    setEditingCabo(cabo);
    setFormData({
      disciplina: cabo.disciplina || "Força",
      area_id: cabo.area_id || "",
      sub_area: cabo.sub_area || "",
      tipo_condutor: cabo.tipo_condutor || "",
      circuito: cabo.circuito || "",
      dimensao: cabo.dimensao || "",
      ponto_origem: cabo.ponto_origem || "",
      ponto_destino: cabo.ponto_destino || "",
      tipo_cabo: cabo.tipo_cabo || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, tipoCabo: string) => {
    if (!confirm(`Tem certeza que deseja excluir o cabo ${tipoCabo}?`)) return;

    try {
      const { error } = await supabase
        .from("cabos_eletrica")
        .update({ ativo: false })
        .eq("id", id);

      if (error) throw error;
      toast({
        title: "Sucesso",
        description: "Cabo excluído com sucesso"
      });
      carregarCabos();
    } catch (error: any) {
      console.error("Erro ao excluir cabo:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir cabo",
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
    if (selectedIds.size === cabosFiltrados.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(cabosFiltrados.map(c => c.id)));
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
          .from("cabos_eletrica")
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
      description: `${processedCount} cabo(s) excluído(s) com sucesso`
    });

    carregarCabos();
  };

  const cabosFiltrados = cabos.filter(cabo =>
    cabo.disciplina?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cabo.areas_projeto?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cabo.tipo_condutor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cabo.circuito?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cabo.tipo_cabo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para baixar template Excel
  const downloadTemplate = () => {
    const template = [
      {
        "DISCIPLINA": "Força",
        "ÁREA": "Sala Elétrica",
        "SUB-ÁREA": "Painel A",
        "CONDUTOR": "Fase",
        "CIRCUITO": "C-001",
        "BITOLA": "2,5mm²",
        "DE": "QD-01",
        "PARA": "Motor M-01",
        "TIPO DE CABO": "PP"
      },
      {
        "DISCIPLINA": "Instrumentação",
        "ÁREA": "Área de Processo",
        "SUB-ÁREA": "",
        "CONDUTOR": "Fase/Neutro",
        "CIRCUITO": "C-002",
        "BITOLA": "1,5mm²",
        "DE": "QD-02",
        "PARA": "Sensor T-01",
        "TIPO DE CABO": "PVC"
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Cabos");
    
    // Ajustar largura das colunas
    ws['!cols'] = [
      { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, 
      { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
    ];

    XLSX.writeFile(wb, "template_cabos_eletrica.xlsx");
    
    toast({
      title: "Template baixado",
      description: "Use este arquivo como modelo para importação"
    });
  };

  // Validar linha do Excel
  const validateRow = (row: ImportRow, index: number): PreviewRow => {
    const errors: string[] = [];
    let status: "ok" | "warning" | "error" = "ok";

    // Validações obrigatórias
    const disciplinaNormalizada = row.DISCIPLINA?.trim();
    if (!disciplinaNormalizada) {
      errors.push("Disciplina é obrigatória");
      status = "error";
    } else {
      const disciplinaExiste = disciplinasDb.find(d => 
        d.nome.toLowerCase() === disciplinaNormalizada.toLowerCase()
      );
      
      if (!disciplinaExiste) {
        errors.push(`Disciplina "${row.DISCIPLINA}" não cadastrada`);
        status = "error";
      } else {
        row.DISCIPLINA = disciplinaExiste.nome;
      }
    }

    const condutorNormalizado = row.CONDUTOR?.trim();
    if (!condutorNormalizado) {
      errors.push("Condutor é obrigatório");
      status = "error";
    } else {
      const condutorValido = tiposCondutor.find(t => 
        t.toLowerCase() === condutorNormalizado.toLowerCase()
      );
      
      if (!condutorValido) {
        errors.push(`Condutor inválido. Use: ${tiposCondutor.join(", ")}`);
        status = "error";
      } else {
        row.CONDUTOR = condutorValido;
      }
    }

    if (!row["TIPO DE CABO"] || row["TIPO DE CABO"].trim() === "") {
      errors.push("Tipo de Cabo é obrigatório");
      status = "error";
    }

    // Avisos (não impedem importação)
    if (row.ÁREA && !areas.find(a => a.nome.toLowerCase() === row.ÁREA?.toLowerCase())) {
      errors.push("Área não encontrada no cadastro");
      if (status === "ok") status = "warning";
    }

    return { data: row, status, errors, index };
  };

  // Processar arquivo Excel
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: ImportRow[] = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        toast({
          title: "Erro",
          description: "Arquivo vazio ou formato inválido",
          variant: "destructive"
        });
        return;
      }

      // Validar todas as linhas
      const validatedData = jsonData.map((row, index) => validateRow(row, index + 1));
      setImportPreviewData(validatedData);
      setIsImportDialogOpen(true);

      toast({
        title: "Arquivo carregado",
        description: `${validatedData.length} linhas encontradas`
      });
    } catch (error) {
      console.error("Erro ao processar arquivo:", error);
      toast({
        title: "Erro",
        description: "Erro ao processar arquivo Excel",
        variant: "destructive"
      });
    }

    // Limpar input
    event.target.value = "";
  };

  // Importar dados validados
  const importData = async () => {
    const validRows = importPreviewData.filter(row => row.status !== "error");
    
    if (validRows.length === 0) {
      toast({
        title: "Erro",
        description: "Nenhuma linha válida para importar",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    setImportProgress(0);

    try {
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      // Processar em lotes de 50
      const batchSize = 50;
      for (let i = 0; i < validRows.length; i += batchSize) {
        const batch = validRows.slice(i, i + batchSize);
        
        const dataToInsert = await Promise.all(
          batch.map(async (row) => {
            let area_id = null;
            
            // Buscar área por nome
            if (row.data.ÁREA) {
              const area = areas.find(a => 
                a.nome.toLowerCase() === row.data.ÁREA?.toLowerCase()
              );
              area_id = area?.id || null;
            }

            return {
              disciplina: row.data.DISCIPLINA,
              area_id,
              sub_area: row.data["SUB-ÁREA"] || "",
              tipo_condutor: row.data.CONDUTOR,
              circuito: row.data.CIRCUITO || "",
              dimensao: row.data.BITOLA || "",
              ponto_origem: row.data.DE || "",
              ponto_destino: row.data.PARA || "",
              tipo_cabo: row.data["TIPO DE CABO"]
            };
          })
        );

        const { error } = await supabase
          .from("cabos_eletrica")
          .insert(dataToInsert);

        if (error) {
          errorCount += batch.length;
          errors.push(`Lote ${Math.floor(i / batchSize) + 1}: ${error.message}`);
        } else {
          successCount += batch.length;
        }

        setImportProgress(Math.round(((i + batch.length) / validRows.length) * 100));
      }

      // Feedback final
      if (successCount > 0) {
        toast({
          title: "Importação concluída",
          description: `${successCount} cabos importados com sucesso${errorCount > 0 ? `, ${errorCount} com erro` : ""}`
        });
        carregarCabos();
      }

      if (errors.length > 0) {
        console.error("Erros de importação:", errors);
      }

      setIsImportDialogOpen(false);
      setImportPreviewData([]);
    } catch (error) {
      console.error("Erro ao importar:", error);
      toast({
        title: "Erro",
        description: "Erro ao importar dados",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
      setImportProgress(0);
    }
  };

  const statsImport = {
    total: importPreviewData.length,
    ok: importPreviewData.filter(r => r.status === "ok").length,
    warning: importPreviewData.filter(r => r.status === "warning").length,
    error: importPreviewData.filter(r => r.status === "error").length
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <Card className="border-l-4 border-l-blue-500 border-blue-200 dark:border-blue-800">
          <CardHeader className="bg-blue-50 dark:bg-blue-950/20">
            <CardTitle className="text-blue-800 dark:text-blue-200">Cadastro de Cabos - Elétrica/Instrumentação</CardTitle>
            <CardDescription className="text-blue-600 dark:text-blue-300">
              Gerencie cabos com disciplina, área, condutor, circuito, bitola e rotas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-72">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por disciplina, área, condutor..."
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

                <Button
                  variant="outline"
                  onClick={() => document.getElementById("excel-upload")?.click()}
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Importar Excel
                </Button>
                <input
                  id="excel-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                  <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Cabo
                  </Button>
                </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCabo ? "Editar Cabo" : "Novo Cabo"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingCabo ? "Editar informações do cabo" : "Cadastrar novo cabo elétrico"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="disciplina">Disciplina *</Label>
                          <Select value={formData.disciplina} onValueChange={(value) => setFormData({ ...formData, disciplina: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a disciplina" />
                            </SelectTrigger>
                            <SelectContent>
                              {disciplinasDb.map((disc) => (
                                <SelectItem key={disc.id} value={disc.nome}>
                                  {disc.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="area_id">Área</Label>
                          <Select value={formData.area_id} onValueChange={(value) => setFormData({ ...formData, area_id: value })}>
                            <SelectTrigger>
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
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="sub_area">Sub-Área</Label>
                          <Input
                            id="sub_area"
                            value={formData.sub_area}
                            onChange={(e) => setFormData({ ...formData, sub_area: e.target.value })}
                            placeholder="Ex: Sala de Controle"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="tipo_condutor">Condutor *</Label>
                          <Select value={formData.tipo_condutor} onValueChange={(value) => setFormData({ ...formData, tipo_condutor: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              {tiposCondutor.map((tipo) => (
                                <SelectItem key={tipo} value={tipo}>
                                  {tipo}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="circuito">Circuito</Label>
                          <Input
                            id="circuito"
                            value={formData.circuito}
                            onChange={(e) => setFormData({ ...formData, circuito: e.target.value })}
                            placeholder="Ex: C-001"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="dimensao">Bitola</Label>
                          <Input
                            id="dimensao"
                            value={formData.dimensao}
                            onChange={(e) => setFormData({ ...formData, dimensao: e.target.value })}
                            placeholder="Ex: 2,5mm²"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ponto_origem">De</Label>
                          <Input
                            id="ponto_origem"
                            value={formData.ponto_origem}
                            onChange={(e) => setFormData({ ...formData, ponto_origem: e.target.value })}
                            placeholder="Ponto de origem"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="ponto_destino">Para</Label>
                          <Input
                            id="ponto_destino"
                            value={formData.ponto_destino}
                            onChange={(e) => setFormData({ ...formData, ponto_destino: e.target.value })}
                            placeholder="Ponto de destino"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tipo_cabo">Tipo de Cabo *</Label>
                        <Input
                          id="tipo_cabo"
                          value={formData.tipo_cabo}
                          onChange={(e) => setFormData({ ...formData, tipo_cabo: e.target.value })}
                          placeholder="Ex: PP, PVC, XLPE"
                          required
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

            {/* Dialog de Importação Excel */}
            <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5 text-green-600" />
                    Preview da Importação
                  </DialogTitle>
                  <DialogDescription>
                    Revise os dados antes de confirmar a importação
                  </DialogDescription>
                </DialogHeader>

                {/* Estatísticas */}
                <div className="grid grid-cols-4 gap-4 my-4">
                  <Card className="border-blue-200">
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold text-blue-600">{statsImport.total}</div>
                      <div className="text-sm text-muted-foreground">Total de linhas</div>
                    </CardContent>
                  </Card>
                  <Card className="border-green-200">
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold text-green-600">{statsImport.ok}</div>
                      <div className="text-sm text-muted-foreground">Válidas</div>
                    </CardContent>
                  </Card>
                  <Card className="border-yellow-200">
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold text-yellow-600">{statsImport.warning}</div>
                      <div className="text-sm text-muted-foreground">Com avisos</div>
                    </CardContent>
                  </Card>
                  <Card className="border-red-200">
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold text-red-600">{statsImport.error}</div>
                      <div className="text-sm text-muted-foreground">Com erros</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Progresso de importação */}
                {isImporting && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Importando dados...</span>
                      <span>{importProgress}%</span>
                    </div>
                    <Progress value={importProgress} />
                  </div>
                )}

                {/* Tabela de preview */}
                <div className="border rounded-lg overflow-x-auto max-h-96">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Status</TableHead>
                        <TableHead>Linha</TableHead>
                        <TableHead>Disciplina</TableHead>
                        <TableHead>Área</TableHead>
                        <TableHead>Condutor</TableHead>
                        <TableHead>Tipo Cabo</TableHead>
                        <TableHead>Observações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {importPreviewData.map((row) => (
                        <TableRow key={row.index} className={
                          row.status === "error" ? "bg-red-50" :
                          row.status === "warning" ? "bg-yellow-50" :
                          "bg-green-50"
                        }>
                          <TableCell>
                            {row.status === "ok" && <CheckCircle className="h-4 w-4 text-green-600" />}
                            {row.status === "warning" && <AlertCircle className="h-4 w-4 text-yellow-600" />}
                            {row.status === "error" && <X className="h-4 w-4 text-red-600" />}
                          </TableCell>
                          <TableCell>{row.index}</TableCell>
                          <TableCell>{row.data.DISCIPLINA}</TableCell>
                          <TableCell>{row.data.ÁREA || "-"}</TableCell>
                          <TableCell>{row.data.CONDUTOR}</TableCell>
                          <TableCell>{row.data["TIPO DE CABO"]}</TableCell>
                          <TableCell className="text-xs">
                            {row.errors.length > 0 ? (
                              <ul className="list-disc pl-4">
                                {row.errors.map((err, i) => (
                                  <li key={i} className={
                                    row.status === "error" ? "text-red-600" : "text-yellow-600"
                                  }>{err}</li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-green-600">OK</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

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
                    disabled={statsImport.error > 0 || isImporting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isImporting ? "Importando..." : `Importar ${statsImport.ok + statsImport.warning} Cabos`}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedIds.size === cabosFiltrados.length && cabosFiltrados.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Área</TableHead>
                    <TableHead>Sub-Área</TableHead>
                    <TableHead>Condutor</TableHead>
                    <TableHead>Circuito</TableHead>
                    <TableHead>Bitola</TableHead>
                    <TableHead>De</TableHead>
                    <TableHead>Para</TableHead>
                    <TableHead>Tipo de Cabo</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cabosFiltrados.map((cabo) => (
                    <TableRow key={cabo.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(cabo.id)}
                          onCheckedChange={() => toggleSelection(cabo.id)}
                        />
                      </TableCell>
                      <TableCell>{cabo.disciplina}</TableCell>
                      <TableCell>{cabo.areas_projeto?.nome || "-"}</TableCell>
                      <TableCell>{cabo.sub_area || "-"}</TableCell>
                      <TableCell>{cabo.tipo_condutor}</TableCell>
                      <TableCell>{cabo.circuito || "-"}</TableCell>
                      <TableCell>{cabo.dimensao || "-"}</TableCell>
                      <TableCell>{cabo.ponto_origem || "-"}</TableCell>
                      <TableCell>{cabo.ponto_destino || "-"}</TableCell>
                      <TableCell className="font-medium">{cabo.tipo_cabo}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(cabo)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(cabo.id, cabo.tipo_cabo)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {cabosFiltrados.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? "Nenhum cabo encontrado com os critérios de busca" : "Nenhum cabo cadastrado"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Barra flutuante de ações */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg flex items-center gap-4 z-50">
          <Badge variant="secondary" className="bg-primary-foreground text-primary">
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
              Tem certeza que deseja excluir {selectedIds.size} cabo(s)? Esta ação não pode ser desfeita.
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
