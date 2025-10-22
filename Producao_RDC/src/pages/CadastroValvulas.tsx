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

const formSchema = z.object({
  tag: z.string().min(1, "TAG é obrigatória"),
  tipo_valvula: z.string().min(1, "Tipo de válvula é obrigatório"),
  linha_id: z.string().optional(),
  fluido_id: z.string().optional(),
  descricao: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Valvula {
  id: string;
  tag: string;
  tipo_valvula: string;
  linha_id?: string;
  fluido_id?: string;
  descricao?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  linhas?: { nome_linha: string } | null;
  fluidos?: { nome: string } | null;
}

interface Linha {
  id: string;
  nome_linha: string;
}

interface Fluido {
  id: string;
  nome: string;
}

interface ImportRow {
  TAG: string;
  TIPO_VALVULA: string;
  LINHA?: string;
  FLUIDO?: string;
  DESCRIÇÃO?: string;
}

interface PreviewRow {
  data: ImportRow;
  status: "ok" | "warning" | "error";
  errors: string[];
  index: number;
}

const CadastroValvulas = () => {
  const [valvulas, setValvulas] = useState<Valvula[]>([]);
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [fluidos, setFluidos] = useState<Fluido[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingValvula, setEditingValvula] = useState<Valvula | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroLinha, setFiltroLinha] = useState<string>("todos");
  const [filtroFluido, setFiltroFluido] = useState<string>("todos");
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importPreviewData, setImportPreviewData] = useState<PreviewRow[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tag: "",
      tipo_valvula: "",
      linha_id: "",
      fluido_id: "",
      descricao: "",
    },
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setIsLoading(true);
    try {
      // Carregar válvulas
      const { data: valvulasData, error: valvulasError } = await supabase
        .from('valvulas')
        .select(`
          id,
          tag,
          tipo_valvula,
          linha_id,
          fluido_id,
          descricao,
          ativo,
          created_at,
          updated_at,
          linhas(nome_linha),
          fluidos(nome)
        `)
        .eq('ativo', true)
        .order('tag', { ascending: true });

      if (valvulasError) throw valvulasError;

      // Carregar linhas
      const { data: linhasData, error: linhasError } = await supabase
        .from('linhas')
        .select('id, nome_linha')
        .order('nome_linha', { ascending: true });

      if (linhasError) throw linhasError;

      // Carregar fluidos
      const { data: fluidosData, error: fluidosError } = await supabase
        .from('fluidos')
        .select('id, nome')
        .order('nome', { ascending: true });

      if (fluidosError) throw fluidosError;

      setValvulas(valvulasData as Valvula[] || []);
      setLinhas(linhasData || []);
      setFluidos(fluidosData || []);
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
      const dadosValvula = {
        tag: values.tag,
        tipo_valvula: values.tipo_valvula,
        linha_id: values.linha_id || null,
        fluido_id: values.fluido_id || null,
        descricao: values.descricao || null,
      };

      if (editingValvula) {
        const { error } = await supabase
          .from('valvulas')
          .update(dadosValvula)
          .eq('id', editingValvula.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Válvula atualizada com sucesso!",
        });
      } else {
        const { error } = await supabase
          .from('valvulas')
          .insert(dadosValvula);

        if (error) {
          if (error.code === '23505') {
            toast({
              title: "Erro",
              description: "TAG já existe. Use uma TAG única.",
              variant: "destructive",
            });
            return;
          }
          throw error;
        }

        toast({
          title: "Sucesso",
          description: "Válvula cadastrada com sucesso!",
        });
      }

      form.reset();
      setDialogOpen(false);
      setEditingValvula(null);
      carregarDados();
    } catch (error) {
      console.error('Erro ao salvar válvula:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar válvula",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (valvula: Valvula) => {
    setEditingValvula(valvula);
    form.reset({
      tag: valvula.tag,
      tipo_valvula: valvula.tipo_valvula,
      linha_id: valvula.linha_id || "",
      fluido_id: valvula.fluido_id || "",
      descricao: valvula.descricao || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta válvula?")) return;

    try {
      const { error } = await supabase
        .from('valvulas')
        .update({ ativo: false })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Válvula excluída com sucesso!",
      });
      carregarDados();
    } catch (error) {
      console.error('Erro ao excluir válvula:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir válvula",
        variant: "destructive",
      });
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        "TAG": "PSV-101",
        "TIPO_VALVULA": "Válvula de Segurança",
        "LINHA": linhas.length > 0 ? linhas[0].nome_linha : "A-1001-AA-4-A51",
        "FLUIDO": fluidos.length > 0 ? fluidos[0].nome : "Água",
        "DESCRIÇÃO": "Válvula de alívio de pressão"
      },
      {
        "TAG": "BV-201",
        "TIPO_VALVULA": "Válvula Borboleta",
        "LINHA": linhas.length > 1 ? linhas[1].nome_linha : "B-2001-BB-6-B51",
        "FLUIDO": fluidos.length > 1 ? fluidos[1].nome : "Óleo",
        "DESCRIÇÃO": "Válvula de isolamento"
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Valvulas");
    
    ws['!cols'] = [
      { wch: 20 },
      { wch: 25 },
      { wch: 25 },
      { wch: 20 },
      { wch: 40 }
    ];

    XLSX.writeFile(wb, "template_valvulas.xlsx");
    
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
      const tagExistente = valvulas.find(v => 
        v.tag.toLowerCase() === row.TAG.trim().toLowerCase()
      );
      if (tagExistente) {
        errors.push(`TAG "${row.TAG}" já cadastrada`);
      }
    }

    if (!row.TIPO_VALVULA?.trim()) {
      errors.push("TIPO_VALVULA é obrigatório");
    }

    if (row.LINHA?.trim()) {
      const linhaExiste = linhas.find(l => 
        l.nome_linha.toLowerCase() === row.LINHA.trim().toLowerCase()
      );
      if (!linhaExiste) {
        errors.push(`Linha "${row.LINHA}" não encontrada`);
      }
    }

    if (row.FLUIDO?.trim()) {
      const fluidoExiste = fluidos.find(f => 
        f.nome.toLowerCase() === row.FLUIDO.trim().toLowerCase()
      );
      if (!fluidoExiste) {
        errors.push(`Fluido "${row.FLUIDO}" não encontrado`);
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
          const linha = linhas.find(l => 
            l.nome_linha.toLowerCase() === row.data.LINHA?.trim().toLowerCase()
          );
          const fluido = fluidos.find(f => 
            f.nome.toLowerCase() === row.data.FLUIDO?.trim().toLowerCase()
          );

          return {
            tag: row.data.TAG.trim(),
            tipo_valvula: row.data.TIPO_VALVULA.trim(),
            linha_id: linha?.id || null,
            fluido_id: fluido?.id || null,
            descricao: row.data.DESCRIÇÃO?.trim() || null,
            ativo: true
          };
        });

        const { error } = await supabase
          .from("valvulas")
          .insert(dataToInsert);

        if (error) throw error;

        imported += batch.length;
        setImportProgress(Math.round((imported / validRows.length) * 100));
      }

      toast({
        title: "Sucesso",
        description: `${imported} válvulas importadas com sucesso`
      });

      setIsImportDialogOpen(false);
      setImportPreviewData([]);
      carregarDados();
    } catch (error: any) {
      console.error("Erro ao importar:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao importar válvulas",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
      setImportProgress(0);
    }
  };

  const handleDeleteMultiple = async () => {
    if (!confirm(`Tem certeza que deseja excluir ${selectedIds.length} válvula(s)?`)) return;

    try {
      const { error } = await supabase
        .from('valvulas')
        .update({ ativo: false })
        .in('id', selectedIds);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `${selectedIds.length} válvula(s) excluída(s) com sucesso!`,
      });

      setSelectedIds([]);
      carregarDados();
    } catch (error) {
      console.error("Erro ao excluir válvulas:", error);
      toast({
        title: "Erro",
        description: "Erro ao excluir válvulas",
        variant: "destructive",
      });
    }
  };

  const tiposValvulaUnicos = Array.from(new Set(valvulas.map(v => v.tipo_valvula))).sort();

  const filteredValvulas = valvulas.filter(valvula => {
    const matchSearch = valvula.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      valvula.tipo_valvula.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchSearch) return false;
    
    if (filtroTipo !== "todos" && valvula.tipo_valvula !== filtroTipo) return false;
    if (filtroLinha !== "todos" && valvula.linha_id !== filtroLinha) return false;
    if (filtroFluido !== "todos" && valvula.fluido_id !== filtroFluido) return false;
    
    return true;
  });

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Válvulas</h1>
            <p className="text-gray-600">Gerencie as válvulas do projeto</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="mr-2 h-4 w-4" />
              Baixar Template
            </Button>
            
            <label htmlFor="file-upload-valvulas">
              <Button variant="outline" asChild>
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  Importar Excel
                </span>
              </Button>
            </label>
            <input
              id="file-upload-valvulas"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingValvula(null);
                form.reset();
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Válvula
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingValvula ? "Editar Válvula" : "Nova Válvula"}
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
                    name="tipo_valvula"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Válvula</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o tipo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="linha_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Linha (opcional)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a linha" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {linhas.map((linha) => (
                              <SelectItem key={linha.id} value={linha.id}>
                                {linha.nome_linha}
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
                    name="fluido_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fluido (opcional)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o fluido" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {fluidos.map((fluido) => (
                              <SelectItem key={fluido.id} value={fluido.id}>
                                {fluido.nome}
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

        <Card>
          <CardHeader>
            <CardTitle>Válvulas Cadastradas</CardTitle>
            <CardDescription>
              Lista de todas as válvulas cadastradas
            </CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div>
                <Label>Tipo</Label>
                <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {tiposValvulaUnicos.map(tipo => (
                      <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Linha</Label>
                <Select value={filtroLinha} onValueChange={setFiltroLinha}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas</SelectItem>
                    {linhas.map(l => (
                      <SelectItem key={l.id} value={l.id}>{l.nome_linha}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Fluido</Label>
                <Select value={filtroFluido} onValueChange={setFiltroFluido}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {fluidos.map(f => (
                      <SelectItem key={f.id} value={f.id}>{f.nome}</SelectItem>
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
                  {selectedIds.length} válvula(s) selecionada(s)
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
                      checked={selectedIds.length === filteredValvulas.length && filteredValvulas.length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedIds(filteredValvulas.map(v => v.id));
                        } else {
                          setSelectedIds([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>TAG</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Linha</TableHead>
                  <TableHead>Fluido</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredValvulas.map((valvula) => (
                  <TableRow 
                    key={valvula.id}
                    className={selectedIds.includes(valvula.id) ? "bg-orange-50" : ""}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(valvula.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedIds([...selectedIds, valvula.id]);
                          } else {
                            setSelectedIds(selectedIds.filter(id => id !== valvula.id));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{valvula.tag}</TableCell>
                    <TableCell>{valvula.tipo_valvula}</TableCell>
                    <TableCell>{valvula.linhas?.nome_linha || "-"}</TableCell>
                    <TableCell>{valvula.fluidos?.nome || "-"}</TableCell>
                    <TableCell>{valvula.descricao || "-"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(valvula)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(valvula.id)}
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
                  <TableHead>Linha</TableHead>
                  <TableHead>Fluido</TableHead>
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
                    <TableCell className="text-sm">{row.data.TIPO_VALVULA}</TableCell>
                    <TableCell>{row.data.LINHA || "-"}</TableCell>
                    <TableCell>{row.data.FLUIDO || "-"}</TableCell>
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
      </div>
    </Layout>
  );
};

export default CadastroValvulas;