import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search, Download, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Layout from "@/components/Layout";
import * as XLSX from "xlsx";

const tiposEquipamento = [
  "Equipamento Estático",
  "Equipamento Rotativo"
] as const;

const formSchema = z.object({
  tag: z.string().min(1, "TAG é obrigatória"),
  tipo_equipamento: z.string().min(1, "Tipo de equipamento é obrigatório"),
  descricao: z.string().optional(),
  area_id: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EquipamentoMecanico {
  id: string;
  tag: string;
  tipo_equipamento: string;
  descricao?: string;
  area_id?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  areas_projeto?: { nome: string } | null;
}

interface Area {
  id: string;
  nome: string;
}

interface ImportRow {
  TAG: string;
  TIPO_EQUIPAMENTO: string;
  ÁREA?: string;
  DESCRIÇÃO?: string;
}

interface PreviewRow {
  data: ImportRow;
  status: "ok" | "warning" | "error";
  errors: string[];
  index: number;
}

const CadastroEquipamentosMecanicos = () => {
  const [equipamentos, setEquipamentos] = useState<EquipamentoMecanico[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEquipamento, setEditingEquipamento] = useState<EquipamentoMecanico | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filtroArea, setFiltroArea] = useState<string>("todos");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importPreviewData, setImportPreviewData] = useState<PreviewRow[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tag: "",
      tipo_equipamento: "",
      descricao: "",
      area_id: "",
    },
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setIsLoading(true);
    try {
      // Carregar equipamentos
      const { data: equipamentosData, error: equipamentosError } = await supabase
        .from('equipamentos_mecanicos')
        .select(`
          id,
          tag,
          tipo_equipamento,
          descricao,
          area_id,
          ativo,
          created_at,
          updated_at,
          areas_projeto(nome)
        `)
        .eq('ativo', true)
        .order('tag', { ascending: true });

      if (equipamentosError) throw equipamentosError;

      // Carregar áreas
      const { data: areasData, error: areasError } = await supabase
        .from('areas_projeto')
        .select('id, nome')
        .eq('ativo', true)
        .order('nome', { ascending: true });

      if (areasError) throw areasError;

      setEquipamentos(equipamentosData as EquipamentoMecanico[] || []);
      setAreas(areasData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const dadosEquipamento = {
        tag: values.tag,
        tipo_equipamento: values.tipo_equipamento,
        descricao: values.descricao || null,
        area_id: values.area_id || null,
      };

      if (editingEquipamento) {
        const { error } = await supabase
          .from('equipamentos_mecanicos')
          .update(dadosEquipamento)
          .eq('id', editingEquipamento.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Equipamento atualizado com sucesso!",
        });
      } else {
        const { error } = await supabase
          .from('equipamentos_mecanicos')
          .insert(dadosEquipamento);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Equipamento cadastrado com sucesso!",
        });
      }

      form.reset();
      setDialogOpen(false);
      setEditingEquipamento(null);
      carregarDados();
    } catch (error) {
      console.error('Erro ao salvar equipamento:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar equipamento",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (equipamento: EquipamentoMecanico) => {
    setEditingEquipamento(equipamento);
    form.reset({
      tag: equipamento.tag,
      tipo_equipamento: equipamento.tipo_equipamento,
      descricao: equipamento.descricao || "",
      area_id: equipamento.area_id || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este equipamento?")) return;

    try {
      const { error } = await supabase
        .from('equipamentos_mecanicos')
        .update({ ativo: false })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Equipamento excluído com sucesso!",
      });
      carregarDados();
    } catch (error) {
      console.error('Erro ao excluir equipamento:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir equipamento",
        variant: "destructive",
      });
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        "TAG": "E-101",
        "TIPO_EQUIPAMENTO": "Equipamento Estático",
        "ÁREA": "Área 100",
        "DESCRIÇÃO": "Tanque de armazenamento"
      },
      {
        "TAG": "P-201",
        "TIPO_EQUIPAMENTO": "Equipamento Rotativo",
        "ÁREA": "Área 200",
        "DESCRIÇÃO": "Bomba centrífuga"
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Equipamentos");
    
    ws['!cols'] = [
      { wch: 20 },
      { wch: 25 },
      { wch: 20 },
      { wch: 40 }
    ];

    XLSX.writeFile(wb, "template_equipamentos_mecanicos.xlsx");
    
    toast({
      title: "Sucesso",
      description: "Template baixado com sucesso"
    });
  };

  const validateRow = (row: ImportRow, index: number): PreviewRow => {
    const errors: string[] = [];

    if (!row.TAG?.trim()) {
      errors.push("TAG é obrigatória");
    } else {
      const tagExistente = equipamentos.find(e => 
        e.tag.toLowerCase() === row.TAG.trim().toLowerCase()
      );
      if (tagExistente) {
        errors.push(`TAG "${row.TAG}" já cadastrada`);
      }
    }

    if (!row.TIPO_EQUIPAMENTO?.trim()) {
      errors.push("TIPO_EQUIPAMENTO é obrigatório");
    } else if (!["Equipamento Estático", "Equipamento Rotativo"].includes(row.TIPO_EQUIPAMENTO.trim())) {
      errors.push(`TIPO_EQUIPAMENTO deve ser "Equipamento Estático" ou "Equipamento Rotativo"`);
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
            tag: row.data.TAG.trim(),
            tipo_equipamento: row.data.TIPO_EQUIPAMENTO.trim(),
            area_id: area?.id || null,
            descricao: row.data.DESCRIÇÃO?.trim() || null,
            ativo: true
          };
        });

        const { error } = await supabase
          .from("equipamentos_mecanicos")
          .insert(dataToInsert);

        if (error) throw error;

        imported += batch.length;
        setImportProgress(Math.round((imported / validRows.length) * 100));
      }

      toast({
        title: "Sucesso",
        description: `${imported} equipamentos importados com sucesso`
      });

      setIsImportDialogOpen(false);
      setImportPreviewData([]);
      carregarDados();
    } catch (error: any) {
      console.error("Erro ao importar:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao importar equipamentos",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
      setImportProgress(0);
    }
  };

  const handleDeleteMultiple = async () => {
    if (!confirm(`Tem certeza que deseja excluir ${selectedIds.length} equipamento(s)?`)) return;

    try {
      const { error } = await supabase
        .from('equipamentos_mecanicos')
        .update({ ativo: false })
        .in('id', selectedIds);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `${selectedIds.length} equipamento(s) excluído(s) com sucesso!`,
      });

      setSelectedIds([]);
      carregarDados();
    } catch (error) {
      console.error("Erro ao excluir equipamentos:", error);
      toast({
        title: "Erro",
        description: "Erro ao excluir equipamentos",
        variant: "destructive",
      });
    }
  };

  const filteredEquipamentos = equipamentos.filter(equipamento => {
    const matchSearch = equipamento.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipamento.tipo_equipamento.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchSearch) return false;
    
    if (filtroArea !== "todos" && equipamento.area_id !== filtroArea) return false;
    if (filtroTipo !== "todos" && equipamento.tipo_equipamento !== filtroTipo) return false;
    
    return true;
  });

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Equipamentos Mecânicos</h1>
            <p className="text-gray-600">Gerencie os equipamentos mecânicos do projeto</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="mr-2 h-4 w-4" />
              Baixar Template
            </Button>
            
            <label htmlFor="file-upload-equipamentos">
              <Button variant="outline" asChild>
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  Importar Excel
                </span>
              </Button>
            </label>
            <input
              id="file-upload-equipamentos"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingEquipamento(null);
                form.reset();
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Equipamento
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingEquipamento ? "Editar Equipamento" : "Novo Equipamento"}
                </DialogTitle>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="tag"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TAG</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite a TAG" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tipo_equipamento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Equipamento</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tiposEquipamento.map((tipo) => (
                              <SelectItem key={tipo} value={tipo}>
                                {tipo}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="area_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Área (opcional)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a área" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {areas.map((area) => (
                              <SelectItem key={area.id} value={area.id}>
                                {area.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="descricao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição (opcional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Digite a descrição" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Salvando..." : "Salvar"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Preview de Importação</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{importPreviewData.length}</div>
                  <p className="text-xs text-muted-foreground">Total de linhas</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-600">
                    {importPreviewData.filter(r => r.status === "ok").length}
                  </div>
                  <p className="text-xs text-muted-foreground">Válidas</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-red-600">
                    {importPreviewData.filter(r => r.status === "error").length}
                  </div>
                  <p className="text-xs text-muted-foreground">Com erro</p>
                </CardContent>
              </Card>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>TAG</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>Erros</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {importPreviewData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Badge variant={row.status === "ok" ? "default" : "destructive"}>
                        {row.status === "ok" ? "OK" : "ERRO"}
                      </Badge>
                    </TableCell>
                    <TableCell>{row.data.TAG}</TableCell>
                    <TableCell className="text-sm">{row.data.TIPO_EQUIPAMENTO}</TableCell>
                    <TableCell>{row.data.ÁREA || "-"}</TableCell>
                    <TableCell>
                      {row.errors.length > 0 && (
                        <ul className="text-sm text-red-600">
                          {row.errors.map((err, i) => (
                            <li key={i}>• {err}</li>
                          ))}
                        </ul>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {isImporting && (
              <div className="space-y-2">
                <Progress value={importProgress} />
                <p className="text-sm text-center">{importProgress}% concluído</p>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsImportDialogOpen(false)} disabled={isImporting}>
                Cancelar
              </Button>
              <Button onClick={importData} disabled={isImporting || importPreviewData.filter(r => r.status === "ok").length === 0}>
                {isImporting ? "Importando..." : `Importar ${importPreviewData.filter(r => r.status === "ok").length} Válidos`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card>
          <CardHeader>
            <CardTitle>Equipamentos Cadastrados</CardTitle>
            <CardDescription>
              Lista de todos os equipamentos mecânicos cadastrados
            </CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <Label>Área</Label>
                <Select value={filtroArea} onValueChange={setFiltroArea}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas</SelectItem>
                    {areas.map(a => (
                      <SelectItem key={a.id} value={a.id}>{a.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Tipo</Label>
                <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {tiposEquipamento.map(tipo => (
                      <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Busca</Label>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por TAG..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedIds.length > 0 && (
              <div className="mb-4 flex items-center justify-between bg-orange-50 p-3 rounded-lg">
                <span className="text-sm font-medium">
                  {selectedIds.length} equipamento(s) selecionado(s)
                </span>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleDeleteMultiple}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir Selecionados
                </Button>
              </div>
            )}
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedIds.length === filteredEquipamentos.length && filteredEquipamentos.length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedIds(filteredEquipamentos.map(e => e.id));
                        } else {
                          setSelectedIds([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>TAG</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipamentos.map((equipamento) => (
                  <TableRow 
                    key={equipamento.id}
                    className={selectedIds.includes(equipamento.id) ? "bg-orange-50" : ""}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(equipamento.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedIds([...selectedIds, equipamento.id]);
                          } else {
                            setSelectedIds(selectedIds.filter(id => id !== equipamento.id));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{equipamento.tag}</TableCell>
                    <TableCell>{equipamento.tipo_equipamento}</TableCell>
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
                          onClick={() => handleDelete(equipamento.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CadastroEquipamentosMecanicos;