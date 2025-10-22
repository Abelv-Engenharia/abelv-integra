import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Pencil, Trash2, Download, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import * as XLSX from "xlsx";

interface Infraestrutura {
  id: string;
  desenho_id?: string;
  area_id?: string;
  disciplina?: string;
  tipo_infraestrutura_id?: string;
  dimensao?: string;
  descricao?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  desenhos_eletrica?: {
    codigo: string;
  };
  tipos_infraestrutura_eletrica?: {
    nome: string;
    dimensoes_padrao: any;
  };
  areas_projeto?: {
    nome: string;
  };
}

interface Desenho {
  id: string;
  codigo: string;
  disciplina: string;
}

interface Area {
  id: string;
  nome: string;
}

interface TipoInfraestrutura {
  id: string;
  nome: string;
  dimensoes_padrao: any;
}

interface FormData {
  desenho_id: string;
  area_id: string;
  disciplina: string;
  tipo_infraestrutura_id: string;
  dimensao: string;
  descricao: string;
}

interface ImportRow {
  DESENHO?: string;
  ÁREA?: string;
  DISCIPLINA?: string;
  "TIPO DE INFRAESTRUTURA": string;
  DIMENSÃO?: string;
  DESCRIÇÃO?: string;
}

interface PreviewRow {
  data: ImportRow;
  status: "ok" | "warning" | "error";
  errors: string[];
  index: number;
}

export default function EletricaInfraestrutura() {
  const [infraestruturas, setInfraestruturas] = useState<Infraestrutura[]>([]);
  const [desenhos, setDesenhos] = useState<Desenho[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [tipos, setTipos] = useState<TipoInfraestrutura[]>([]);
  const [disciplinasDb, setDisciplinasDb] = useState<{id: string; nome: string}[]>([]);
  const [dimensoesPadrao, setDimensoesPadrao] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importPreviewData, setImportPreviewData] = useState<PreviewRow[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState(0);
  
  const [formData, setFormData] = useState<FormData>({
    desenho_id: "",
    area_id: "",
    disciplina: "",
    tipo_infraestrutura_id: "",
    dimensao: "",
    descricao: "",
  });

  const { toast } = useToast();

  const carregarInfraestruturas = async () => {
    try {
      const { data, error } = await supabase
        .from("infraestrutura_eletrica")
        .select(`
          *,
          desenhos_eletrica (
            codigo
          ),
          tipos_infraestrutura_eletrica (
            nome,
            dimensoes_padrao
          ),
          areas_projeto (
            nome
          )
        `)
        .eq("ativo", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInfraestruturas((data || []).map(item => ({
        ...item,
        tipos_infraestrutura_eletrica: item.tipos_infraestrutura_eletrica ? {
          ...item.tipos_infraestrutura_eletrica,
          dimensoes_padrao: Array.isArray(item.tipos_infraestrutura_eletrica.dimensoes_padrao) 
            ? item.tipos_infraestrutura_eletrica.dimensoes_padrao 
            : []
        } : undefined
      })));
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar infraestruturas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const carregarDesenhos = async () => {
    try {
      const { data, error } = await supabase
        .from("desenhos_eletrica")
        .select("id, codigo, disciplina")
        .eq("ativo", true)
        .order("codigo");

      if (error) throw error;
      setDesenhos(data || []);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar desenhos",
        variant: "destructive",
      });
    }
  };

  const carregarAreas = async () => {
    try {
      const { data, error } = await supabase
        .from("areas_projeto")
        .select("id, nome")
        .eq("ativo", true)
        .order("nome");

      if (error) throw error;
      setAreas(data || []);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar áreas",
        variant: "destructive",
      });
    }
  };

  const carregarTipos = async () => {
    try {
      const { data, error } = await supabase
        .from("tipos_infraestrutura_eletrica")
        .select("id, nome, dimensoes_padrao")
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
    }
  };

  useEffect(() => {
    carregarInfraestruturas();
    carregarDesenhos();
    carregarAreas();
    carregarTipos();
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

  const resetForm = () => {
    setFormData({
      desenho_id: "",
      area_id: "",
      disciplina: "",
      tipo_infraestrutura_id: "",
      dimensao: "",
      descricao: "",
    });
    setDimensoesPadrao([]);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tipo_infraestrutura_id.trim()) {
      toast({
        title: "Erro",
        description: "Tipo de infraestrutura é obrigatório",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isEditing && editingId) {
        const { error } = await supabase
          .from("infraestrutura_eletrica")
          .update({
            desenho_id: formData.desenho_id || null,
            area_id: formData.area_id || null,
            disciplina: formData.disciplina || null,
            tipo_infraestrutura_id: formData.tipo_infraestrutura_id,
            dimensao: formData.dimensao || null,
            descricao: formData.descricao || null,
          })
          .eq("id", editingId);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Infraestrutura atualizada com sucesso",
        });
      } else {
        const { error } = await supabase
          .from("infraestrutura_eletrica")
          .insert({
            desenho_id: formData.desenho_id || null,
            area_id: formData.area_id || null,
            disciplina: formData.disciplina || null,
            tipo_infraestrutura_id: formData.tipo_infraestrutura_id,
            dimensao: formData.dimensao || null,
            descricao: formData.descricao || null,
          });

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Infraestrutura criada com sucesso",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      carregarInfraestruturas();
    } catch (error) {
      toast({
        title: "Erro",
        description: isEditing ? "Erro ao atualizar infraestrutura" : "Erro ao criar infraestrutura",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (infraestrutura: Infraestrutura) => {
    setFormData({
      desenho_id: infraestrutura.desenho_id || "",
      area_id: infraestrutura.area_id || "",
      disciplina: infraestrutura.disciplina || "",
      tipo_infraestrutura_id: infraestrutura.tipo_infraestrutura_id || "",
      dimensao: infraestrutura.dimensao || "",
      descricao: infraestrutura.descricao || "",
    });
    
    // Carregar dimensões padrão se houver tipo selecionado
    if (infraestrutura.tipos_infraestrutura_eletrica?.dimensoes_padrao) {
      setDimensoesPadrao(infraestrutura.tipos_infraestrutura_eletrica.dimensoes_padrao);
    }
    
    setIsEditing(true);
    setEditingId(infraestrutura.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("infraestrutura_eletrica")
        .update({ ativo: false })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Infraestrutura excluída com sucesso",
      });

      carregarInfraestruturas();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir infraestrutura",
        variant: "destructive",
      });
    }
  };

  const handleTipoChange = (tipoId: string) => {
    setFormData(prev => ({ ...prev, tipo_infraestrutura_id: tipoId, dimensao: "" }));
    const tipoSelecionado = tipos.find(t => t.id === tipoId);
    setDimensoesPadrao(tipoSelecionado?.dimensoes_padrao || []);
  };

  const downloadTemplate = () => {
    const template = [
      {
        "DESENHO": "DWG-001",
        "ÁREA": "Área 100",
        "DISCIPLINA": "Elétrica",
        "TIPO DE INFRAESTRUTURA": "Eletroduto",
        "DIMENSÃO": "100mm",
        "DESCRIÇÃO": "Eletroduto galvanizado"
      },
      {
        "DESENHO": "DWG-002",
        "ÁREA": "Área 200",
        "DISCIPLINA": "Instrumentação",
        "TIPO DE INFRAESTRUTURA": "Eletrocalha",
        "DIMENSÃO": "200x50mm",
        "DESCRIÇÃO": "Eletrocalha perfurada"
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "template_infraestrutura.xlsx");
  };

  const validateRow = (row: ImportRow, index: number): PreviewRow => {
    const errors: string[] = [];
    
    if (!row["TIPO DE INFRAESTRUTURA"]?.trim()) {
      errors.push("Tipo de infraestrutura é obrigatório");
    } else {
      const tipoExiste = tipos.find(t => 
        t.nome.toLowerCase() === row["TIPO DE INFRAESTRUTURA"].trim().toLowerCase()
      );
      if (!tipoExiste) {
        errors.push(`Tipo "${row["TIPO DE INFRAESTRUTURA"]}" não cadastrado`);
      }
    }

    if (row.ÁREA?.trim()) {
      const areaExiste = areas.find(a => 
        a.nome.toLowerCase() === row.ÁREA.trim().toLowerCase()
      );
      if (!areaExiste) {
        errors.push(`Área "${row.ÁREA}" não cadastrada`);
      }
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
        const area = areas.find(a => 
          a.nome.toLowerCase() === row.data.ÁREA?.trim().toLowerCase()
        );
        const tipo = tipos.find(t => 
          t.nome.toLowerCase() === row.data["TIPO DE INFRAESTRUTURA"].trim().toLowerCase()
        );

        return {
          desenho_id: desenho?.id || null,
          area_id: area?.id || null,
          disciplina: row.data.DISCIPLINA?.trim() || null,
          tipo_infraestrutura_id: tipo!.id,
          dimensao: row.data.DIMENSÃO?.trim() || null,
          descricao: row.data.DESCRIÇÃO?.trim() || null,
        };
      });

      try {
        const { error } = await supabase
          .from("infraestrutura_eletrica")
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

    carregarInfraestruturas();
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
    if (selectedIds.size === infraestruturasFiltradas.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(infraestruturasFiltradas.map(i => i.id)));
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
          .from("infraestrutura_eletrica")
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
      description: `${processedCount} infraestrutura(s) excluída(s) com sucesso`
    });

    carregarInfraestruturas();
  };

  const infraestruturasFiltradas = infraestruturas.filter(infraestrutura =>
    (infraestrutura.tipos_infraestrutura_eletrica?.nome || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (infraestrutura.descricao && infraestrutura.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <Card className="border-l-4 border-l-blue-500 border-blue-200 dark:border-blue-800">
          <CardHeader className="bg-blue-50 dark:bg-blue-950/20">
            <CardTitle className="text-blue-800 dark:text-blue-200">Infraestrutura Elétrica</CardTitle>
            <CardDescription className="text-blue-600 dark:text-blue-300">
              Gerencie a infraestrutura elétrica por tipo, associada aos desenhos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <Input
                placeholder="Buscar infraestruturas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
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
                  onClick={() => document.getElementById("file-upload-infraestrutura")?.click()}
                  className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Excel
                </Button>
                <input
                  id="file-upload-infraestrutura"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) resetForm();
                }}>
                  <DialogTrigger asChild>
                    <Button>Nova Infraestrutura</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {isEditing ? "Editar Infraestrutura" : "Nova Infraestrutura"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="area">Área do Projeto</Label>
                      <Select value={formData.area_id} onValueChange={(value) => setFormData(prev => ({ ...prev, area_id: value }))}>
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

                    <div>
                      <Label htmlFor="disciplina">Disciplina</Label>
                      <Select value={formData.disciplina} onValueChange={(value) => setFormData(prev => ({ ...prev, disciplina: value }))}>
                        <SelectTrigger>
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
                      {formData.disciplina === "__custom__" && (
                        <Input
                          placeholder="Digite a disciplina"
                          className="mt-2"
                          onChange={(e) => setFormData(prev => ({ ...prev, disciplina: e.target.value }))}
                        />
                      )}
                    </div>

                    <div>
                      <Label htmlFor="desenho">Desenho</Label>
                      <Select value={formData.desenho_id} onValueChange={(value) => setFormData(prev => ({ ...prev, desenho_id: value }))}>
                        <SelectTrigger>
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

                    <div>
                      <Label htmlFor="tipo">Tipo de Infraestrutura *</Label>
                      <Select value={formData.tipo_infraestrutura_id} onValueChange={handleTipoChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {tipos.map((tipo) => (
                            <SelectItem key={tipo.id} value={tipo.id}>
                              {tipo.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="dimensao">Dimensão</Label>
                      {dimensoesPadrao.length > 0 ? (
                        <div className="space-y-2">
                          <Select value={formData.dimensao} onValueChange={(value) => setFormData(prev => ({ ...prev, dimensao: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma dimensão padrão" />
                            </SelectTrigger>
                            <SelectContent>
                              {dimensoesPadrao.map((dimensao, index) => (
                                <SelectItem key={index} value={dimensao}>
                                  {dimensao}
                                </SelectItem>
                              ))}
                              <SelectItem value="__custom__">Outra dimensão</SelectItem>
                            </SelectContent>
                          </Select>
                          {formData.dimensao === "__custom__" && (
                            <Input
                              placeholder="Digite a dimensão personalizada"
                              value=""
                              onChange={(e) => setFormData(prev => ({ ...prev, dimensao: e.target.value }))}
                            />
                          )}
                        </div>
                      ) : (
                        <Input
                          id="dimensao"
                          value={formData.dimensao}
                          onChange={(e) => setFormData(prev => ({ ...prev, dimensao: e.target.value }))}
                          placeholder="Ex: 100x50mm"
                        />
                      )}
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
            </div>

            {loading ? (
              <div>Carregando...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedIds.size === infraestruturasFiltradas.length && infraestruturasFiltradas.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Tipo de Infraestrutura</TableHead>
                    <TableHead>Área</TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Desenho</TableHead>
                    <TableHead>Dimensão</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {infraestruturasFiltradas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground">
                        {searchTerm ? "Nenhuma infraestrutura encontrada" : "Nenhuma infraestrutura cadastrada"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    infraestruturasFiltradas.map((infraestrutura) => (
                      <TableRow key={infraestrutura.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.has(infraestrutura.id)}
                            onCheckedChange={() => toggleSelection(infraestrutura.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {infraestrutura.tipos_infraestrutura_eletrica?.nome || "Tipo não informado"}
                        </TableCell>
                        <TableCell>{infraestrutura.areas_projeto?.nome || "Não informado"}</TableCell>
                        <TableCell>{infraestrutura.disciplina || "Não informado"}</TableCell>
                        <TableCell>{infraestrutura.desenhos_eletrica?.codigo || "Não informado"}</TableCell>
                        <TableCell>
                          {infraestrutura.dimensao ? (
                            <Badge variant="outline">{infraestrutura.dimensao}</Badge>
                          ) : (
                            "Não informado"
                          )}
                        </TableCell>
                        <TableCell>{infraestrutura.descricao || "Não informado"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(infraestrutura)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(infraestrutura.id)}
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
                    <TableHead>Área</TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Desenho</TableHead>
                    <TableHead>Dimensão</TableHead>
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
                      <TableCell>{row.data.ÁREA || "-"}</TableCell>
                      <TableCell>{row.data.DISCIPLINA || "-"}</TableCell>
                      <TableCell>{row.data["TIPO DE INFRAESTRUTURA"]}</TableCell>
                      <TableCell>{row.data.DESENHO || "-"}</TableCell>
                      <TableCell>{row.data.DIMENSÃO || "-"}</TableCell>
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
              Tem certeza que deseja excluir {selectedIds.size} infraestrutura(s)? Esta ação não pode ser desfeita.
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