import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Plus, Trash2, Download, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import * as XLSX from "xlsx";
import Layout from "@/components/Layout";

const formSchema = z.object({
  nome_linha: z.string().min(1, "Nome da linha é obrigatório"),
  fluido_id: z.string().min(1, "Selecione um fluido"),
  tipo_material: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Fluido {
  id: string;
  nome: string;
  descricao?: string;
}

interface Linha {
  id: string;
  nome_linha: string;
  fluido_id: string;
  tipo_material?: string;
  fluidos?: { nome: string };
  created_at: string;
}

interface ImportRow {
  NOME_DA_LINHA: string;
  FLUIDO: string;
  TIPO_DE_MATERIAL?: string;
}

interface PreviewRow {
  data: ImportRow;
  status: "ok" | "error";
  errors: string[];
  index: number;
}

const CadastroLinhas = () => {
  const [fluidos, setFluidos] = useState<Fluido[]>([]);
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filtroFluido, setFiltroFluido] = useState<string>("todos");
  const [filtroTipoMaterial, setFiltroTipoMaterial] = useState<string>("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importPreviewData, setImportPreviewData] = useState<PreviewRow[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome_linha: "",
      fluido_id: "",
      tipo_material: "",
    },
  });

  useEffect(() => {
    carregarFluidos();
    carregarLinhas();
  }, []);

  const carregarFluidos = async () => {
    try {
      const { data, error } = await supabase
        .from("fluidos")
        .select("*")
        .order("nome");

      if (error) throw error;
      setFluidos(data || []);
    } catch (error) {
      console.error("Erro ao carregar fluidos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os fluidos",
        variant: "destructive",
      });
    }
  };

  const carregarLinhas = async () => {
    try {
      const { data, error } = await supabase
        .from("linhas")
        .select(`
          *,
          fluidos (nome)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLinhas(data || []);
    } catch (error) {
      console.error("Erro ao carregar linhas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as linhas",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("linhas")
        .insert([{
          nome_linha: values.nome_linha,
          fluido_id: values.fluido_id,
          tipo_material: values.tipo_material || null
        }]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Linha cadastrada com sucesso!",
      });

      form.reset();
      setDialogOpen(false);
      carregarLinhas();
    } catch (error) {
      console.error("Erro ao cadastrar linha:", error);
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar a linha",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMultiple = async () => {
    if (!confirm(`Tem certeza que deseja excluir ${selectedIds.length} linha(s)?`)) return;

    try {
      const { error } = await supabase
        .from('linhas')
        .delete()
        .in('id', selectedIds);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `${selectedIds.length} linha(s) excluída(s) com sucesso!`,
      });

      setSelectedIds([]);
      carregarLinhas();
    } catch (error) {
      console.error("Erro ao excluir linhas:", error);
      toast({
        title: "Erro",
        description: "Erro ao excluir linhas",
        variant: "destructive",
      });
    }
  };

  const linhasFiltradas = linhas.filter(linha => {
    if (filtroFluido !== "todos" && linha.fluido_id !== filtroFluido) return false;
    if (filtroTipoMaterial !== "todos" && linha.tipo_material !== filtroTipoMaterial) return false;
    return true;
  });

  const downloadTemplate = () => {
    const template = [
      { NOME_DA_LINHA: "Linha Água Gelada 01", FLUIDO: "Água", TIPO_DE_MATERIAL: "Aço Carbono" },
      { NOME_DA_LINHA: "Linha Vapor 01", FLUIDO: "Vapor", TIPO_DE_MATERIAL: "Aço Inox" },
      { NOME_DA_LINHA: "Linha Óleo 01", FLUIDO: "Óleo", TIPO_DE_MATERIAL: "PVC" }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Linhas");
    XLSX.writeFile(wb, "template_linhas.xlsx");

    toast({
      title: "Sucesso",
      description: "Template baixado com sucesso!",
    });
  };

  const validateRow = (row: ImportRow, index: number): PreviewRow => {
    const errors: string[] = [];

    if (!row.NOME_DA_LINHA?.trim()) {
      errors.push("Nome da linha é obrigatório");
    }

    if (!row.FLUIDO?.trim()) {
      errors.push("Fluido é obrigatório");
    } else {
      const fluidoEncontrado = fluidos.find(f => 
        f.nome.toLowerCase() === row.FLUIDO.toLowerCase()
      );
      if (!fluidoEncontrado) {
        errors.push(`Fluido '${row.FLUIDO}' não encontrado`);
      }
    }

    const linhaExiste = linhas.some(l => 
      l.nome_linha.toLowerCase() === row.NOME_DA_LINHA?.toLowerCase()
    );
    if (linhaExiste) {
      errors.push("Linha já existe no sistema");
    }

    return {
      data: row,
      status: errors.length === 0 ? "ok" : "error",
      errors,
      index
    };
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
          variant: "destructive",
        });
        return;
      }

      const preview = jsonData.map((row, idx) => validateRow(row, idx));
      setImportPreviewData(preview);
      setIsImportDialogOpen(true);
    } catch (error) {
      console.error("Erro ao processar arquivo:", error);
      toast({
        title: "Erro",
        description: "Erro ao processar arquivo Excel",
        variant: "destructive",
      });
    }

    e.target.value = "";
  };

  const importData = async () => {
    const validRows = importPreviewData.filter(r => r.status === "ok");
    
    if (validRows.length === 0) {
      toast({
        title: "Erro",
        description: "Nenhum registro válido para importar",
        variant: "destructive",
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
        
        const linhasParaInserir = batch.map(row => {
          const fluido = fluidos.find(f => 
            f.nome.toLowerCase() === row.data.FLUIDO.toLowerCase()
          );
          
          return {
            nome_linha: row.data.NOME_DA_LINHA,
            fluido_id: fluido!.id,
            tipo_material: row.data.TIPO_DE_MATERIAL || null
          };
        });

        const { error } = await supabase
          .from("linhas")
          .insert(linhasParaInserir);

        if (error) throw error;

        imported += batch.length;
        setImportProgress(Math.round((imported / validRows.length) * 100));
      }

      toast({
        title: "Sucesso",
        description: `${validRows.length} linha(s) importada(s) com sucesso!`,
      });

      setIsImportDialogOpen(false);
      setImportPreviewData([]);
      carregarLinhas();
    } catch (error) {
      console.error("Erro ao importar:", error);
      toast({
        title: "Erro",
        description: "Erro ao importar dados",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      setImportProgress(0);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Cadastro de Linhas</h1>
              <p className="text-muted-foreground">
                Gerencie as linhas do sistema
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Baixar Template
            </Button>
            
            <label htmlFor="file-upload-linhas">
              <Button variant="outline" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Excel
                </span>
              </Button>
            </label>
            <input
              id="file-upload-linhas"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => form.reset()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Linha
                </Button>
              </DialogTrigger>
              
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Nova Linha</DialogTitle>
                  <DialogDescription>
                    Cadastre uma nova linha no sistema
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="nome_linha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Linha</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Linha de Água Gelada 01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fluido_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fluido</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um fluido" />
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
                      name="tipo_material"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Material</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo de material" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Aço Carbono">Aço Carbono</SelectItem>
                              <SelectItem value="Aço Inox">Aço Inoxidável</SelectItem>
                              <SelectItem value="PVC">PVC</SelectItem>
                              <SelectItem value="HDPE">HDPE</SelectItem>
                              <SelectItem value="Cobre">Cobre</SelectItem>
                              <SelectItem value="Ferro Fundido">Ferro Fundido</SelectItem>
                              <SelectItem value="Alumínio">Alumínio</SelectItem>
                              <SelectItem value="PPR">PPR</SelectItem>
                              <SelectItem value="CPVC">CPVC</SelectItem>
                              <SelectItem value="Outro">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? "Cadastrando..." : "Cadastrar Linha"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Dialog de Preview de Importação */}
        <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Preview de Importação</DialogTitle>
              <DialogDescription>
                Revise os dados antes de importar
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4 mb-4">
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

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Status</TableHead>
                    <TableHead>Nome da Linha</TableHead>
                    <TableHead>Fluido</TableHead>
                    <TableHead>Material</TableHead>
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
                      <TableCell>{row.data.NOME_DA_LINHA}</TableCell>
                      <TableCell>{row.data.FLUIDO}</TableCell>
                      <TableCell>{row.data.TIPO_DE_MATERIAL || "-"}</TableCell>
                      <TableCell>
                        {row.errors.length > 0 && (
                          <ul className="text-sm text-red-600 space-y-1">
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
            </div>

            {isImporting && (
              <div className="space-y-2">
                <Progress value={importProgress} />
                <p className="text-sm text-center text-muted-foreground">
                  {importProgress}% concluído
                </p>
              </div>
            )}

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
              >
                {isImporting 
                  ? "Importando..." 
                  : `Importar ${importPreviewData.filter(r => r.status === "ok").length} Registro(s)`
                }
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label>Tipo de Material</Label>
                <Select value={filtroTipoMaterial} onValueChange={setFiltroTipoMaterial}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Aço Carbono">Aço Carbono</SelectItem>
                    <SelectItem value="Aço Inox">Aço Inoxidável</SelectItem>
                    <SelectItem value="PVC">PVC</SelectItem>
                    <SelectItem value="HDPE">HDPE</SelectItem>
                    <SelectItem value="Cobre">Cobre</SelectItem>
                    <SelectItem value="Ferro Fundido">Ferro Fundido</SelectItem>
                    <SelectItem value="Alumínio">Alumínio</SelectItem>
                    <SelectItem value="PPR">PPR</SelectItem>
                    <SelectItem value="CPVC">CPVC</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Linhas */}
        <Card>
          <CardHeader>
            <CardTitle>Linhas Cadastradas</CardTitle>
            <CardDescription>
              {linhasFiltradas.length} linha{linhasFiltradas.length !== 1 ? 's' : ''} {filtroFluido !== "todos" || filtroTipoMaterial !== "todos" ? 'filtrada' : 'cadastrada'}{linhasFiltradas.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedIds.length > 0 && (
              <div className="mb-4 flex items-center justify-between bg-orange-50 p-3 rounded-lg">
                <span className="text-sm font-medium">
                  {selectedIds.length} linha(s) selecionada(s)
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
            
            {linhasFiltradas.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma linha {filtroFluido !== "todos" || filtroTipoMaterial !== "todos" ? 'encontrada com os filtros aplicados' : 'cadastrada ainda'}
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedIds.length === linhasFiltradas.length && linhasFiltradas.length > 0}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedIds(linhasFiltradas.map(l => l.id));
                          } else {
                            setSelectedIds([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Nome da Linha</TableHead>
                    <TableHead>Fluido</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {linhasFiltradas.map((linha) => (
                    <TableRow 
                      key={linha.id}
                      className={selectedIds.includes(linha.id) ? "bg-orange-50" : ""}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(linha.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedIds([...selectedIds, linha.id]);
                            } else {
                              setSelectedIds(selectedIds.filter(id => id !== linha.id));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{linha.nome_linha}</TableCell>
                      <TableCell>{linha.fluidos?.nome}</TableCell>
                      <TableCell>{linha.tipo_material || "-"}</TableCell>
                      <TableCell>{new Date(linha.created_at).toLocaleDateString('pt-BR')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CadastroLinhas;