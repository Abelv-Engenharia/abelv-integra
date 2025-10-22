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
import { ArrowLeft, Plus, Link2, Trash2, Download, Upload } from "lucide-react";
import { SelectWithSearch } from "@/components/ui/select-with-search";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import * as XLSX from "xlsx";
import Layout from "@/components/Layout";

const formSchema = z.object({
  numero_junta: z.string().min(1, "Número da junta é obrigatório"),
  linha_id: z.string().min(1, "Selecione uma linha"),
  dn: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
    message: "DN deve ser um número positivo"
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface Linha {
  id: string;
  nome_linha: string;
  fluido_id?: string;
  fluidos?: { id: string; nome: string };
}

interface Fluido {
  id: string;
  nome: string;
}

interface Junta {
  id: string;
  numero_junta: string;
  linha_id: string;
  dn?: number;
  linhas?: { nome_linha: string; fluidos?: { nome: string } };
  created_at: string;
}

interface ImportRow {
  NUMERO_JUNTA: string;
  LINHA: string;
  DN?: string;
}

interface PreviewRow {
  data: ImportRow;
  status: "ok" | "error";
  errors: string[];
  index: number;
}

const CadastroJuntas = () => {
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [juntas, setJuntas] = useState<Junta[]>([]);
  const [fluidos, setFluidos] = useState<Fluido[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filtroLinha, setFiltroLinha] = useState<string>("todos");
  const [filtroFluido, setFiltroFluido] = useState<string>("todos");
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
      numero_junta: "",
      linha_id: "",
      dn: "",
    },
  });

  useEffect(() => {
    carregarLinhas();
    carregarJuntas();
    carregarFluidos();
  }, []);

  const carregarLinhas = async () => {
    try {
      const { data, error } = await supabase
        .from("linhas")
        .select(`
          *,
          fluidos (id, nome)
        `)
        .order("nome_linha");

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

  const carregarJuntas = async () => {
    try {
      const { data, error } = await supabase
        .from("juntas")
        .select(`
          *,
          linhas (
            nome_linha,
            fluidos (nome)
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      // Mapear dados da base para estrutura esperada pelo TypeScript
      const juntasMapeadas = (data || []).map((junta: any) => ({
        ...junta,
        numero_junta: junta.Junta
      }))
      setJuntas(juntasMapeadas);
    } catch (error) {
      console.error("Erro ao carregar juntas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as juntas",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("juntas")
        .insert([{
          "Junta": values.numero_junta,
          linha_id: values.linha_id,
          "DN": values.dn ? Number(values.dn) : null
        }]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Junta cadastrada com sucesso!",
      });

      form.reset();
      setDialogOpen(false);
      carregarJuntas();
    } catch (error) {
      console.error("Erro ao cadastrar junta:", error);
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar a junta",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    }
  };

  const handleDeleteMultiple = async () => {
    if (!confirm(`Tem certeza que deseja excluir ${selectedIds.length} junta(s)?`)) return;

    try {
      const { error } = await supabase
        .from('juntas')
        .delete()
        .in('id', selectedIds);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `${selectedIds.length} junta(s) excluída(s) com sucesso!`,
      });

      setSelectedIds([]);
      carregarJuntas();
    } catch (error) {
      console.error("Erro ao excluir juntas:", error);
      toast({
        title: "Erro",
        description: "Erro ao excluir juntas",
        variant: "destructive",
      });
    }
  };

  const juntasFiltradas = juntas.filter(junta => {
    if (filtroLinha !== "todos" && junta.linha_id !== filtroLinha) return false;
    
    if (filtroFluido !== "todos") {
      const linha = linhas.find(l => l.id === junta.linha_id);
      if (!linha?.fluido_id || linha.fluido_id !== filtroFluido) return false;
    }
    
    return true;
  });

  const downloadTemplate = () => {
    const template = [
      { NUMERO_JUNTA: "J-001", LINHA: "Linha Água Gelada 01", DN: "4.0" },
      { NUMERO_JUNTA: "J-002", LINHA: "Linha Vapor 01", DN: "6.0" },
      { NUMERO_JUNTA: "J-003", LINHA: "Linha Óleo 01", DN: "2.0" }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Juntas");
    XLSX.writeFile(wb, "template_juntas.xlsx");

    toast({
      title: "Sucesso",
      description: "Template baixado com sucesso!",
    });
  };

  const validateRow = (row: ImportRow, index: number): PreviewRow => {
    const errors: string[] = [];

    if (!row.NUMERO_JUNTA?.trim()) {
      errors.push("Número da junta é obrigatório");
    }

    if (!row.LINHA?.trim()) {
      errors.push("Linha é obrigatória");
    } else {
      const linhaEncontrada = linhas.find(l => 
        l.nome_linha.toLowerCase() === row.LINHA.toLowerCase()
      );
      if (!linhaEncontrada) {
        errors.push(`Linha '${row.LINHA}' não encontrada`);
      }
    }

    const juntaExiste = juntas.some(j => 
      j.numero_junta.toLowerCase() === row.NUMERO_JUNTA?.toLowerCase()
    );
    if (juntaExiste) {
      errors.push("Junta já existe no sistema");
    }

    if (row.DN && (isNaN(Number(row.DN)) || Number(row.DN) <= 0)) {
      errors.push("DN deve ser um número positivo");
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
        
        const juntasParaInserir = batch.map(row => {
          const linha = linhas.find(l => 
            l.nome_linha.toLowerCase() === row.data.LINHA.toLowerCase()
          );
          
          return {
            Junta: row.data.NUMERO_JUNTA,
            linha_id: linha!.id,
            DN: row.data.DN ? Number(row.data.DN) : null
          };
        });

        const { error } = await supabase
          .from("juntas")
          .insert(juntasParaInserir);

        if (error) throw error;

        imported += batch.length;
        setImportProgress(Math.round((imported / validRows.length) * 100));
      }

      toast({
        title: "Sucesso",
        description: `${validRows.length} junta(s) importada(s) com sucesso!`,
      });

      setIsImportDialogOpen(false);
      setImportPreviewData([]);
      carregarJuntas();
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
              <h1 className="text-3xl font-bold">Cadastro de Juntas</h1>
              <p className="text-muted-foreground">
                Gerencie as juntas das linhas do sistema
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Baixar Template
            </Button>
            
            <label htmlFor="file-upload-juntas">
              <Button variant="outline" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Excel
                </span>
              </Button>
            </label>
            <input
              id="file-upload-juntas"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => form.reset()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Junta
                </Button>
              </DialogTrigger>
              
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Nova Junta</DialogTitle>
                  <DialogDescription>
                    Cadastre uma nova junta no sistema
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="numero_junta"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nº da Junta</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: J-001" {...field} />
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
                          <FormLabel>Nome da Linha</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione uma linha" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {linhas.map((linha) => (
                                <SelectItem key={linha.id} value={linha.id}>
                                  {linha.nome_linha} - {linha.fluidos?.nome}
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
                      name="dn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>DN (Diâmetro Nominal)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1" 
                              placeholder="Ex: 4.0" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? "Cadastrando..." : "Cadastrar Junta"}
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
                    <TableHead>Nº da Junta</TableHead>
                    <TableHead>Linha</TableHead>
                    <TableHead>DN</TableHead>
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
                      <TableCell>{row.data.NUMERO_JUNTA}</TableCell>
                      <TableCell>{row.data.LINHA}</TableCell>
                      <TableCell>{row.data.DN || "-"}</TableCell>
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
              {/* FLUIDO - PRIMEIRO */}
              <div>
                <Label>Fluido</Label>
                <Select 
                  value={filtroFluido} 
                  onValueChange={(value) => {
                    setFiltroFluido(value);
                    setFiltroLinha("todos");
                  }}
                >
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
              
              {/* NOME DA LINHA - SEGUNDO (com busca integrada) */}
              <div>
                <Label>Nome da Linha</Label>
                <SelectWithSearch
                  value={filtroLinha}
                  onValueChange={setFiltroLinha}
                  placeholder="Selecione uma linha"
                  searchPlaceholder="Digite para buscar linha..."
                  options={[
                    { value: "todos", label: "Todas" },
                    ...linhas
                      .filter(linha => {
                        // Filtro por fluido selecionado
                        if (filtroFluido !== "todos" && linha.fluido_id !== filtroFluido) {
                          return false;
                        }
                        return true;
                      })
                      .map(linha => ({
                        value: linha.id,
                        label: `${linha.nome_linha} - ${linha.fluidos?.nome}`
                      }))
                  ]}
                />
                {filtroFluido !== "todos" && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Mostrando apenas linhas de {fluidos.find(f => f.id === filtroFluido)?.nome}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Juntas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Juntas Cadastradas
            </CardTitle>
            <CardDescription>
              {juntasFiltradas.length} junta{juntasFiltradas.length !== 1 ? 's' : ''} {filtroLinha !== "todos" || filtroFluido !== "todos" ? 'filtrada' : 'cadastrada'}{juntasFiltradas.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedIds.length > 0 && (
              <div className="mb-4 flex items-center justify-between bg-orange-50 p-3 rounded-lg">
                <span className="text-sm font-medium">
                  {selectedIds.length} junta(s) selecionada(s)
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
            
            {juntasFiltradas.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma junta {filtroLinha !== "todos" || filtroFluido !== "todos" ? 'encontrada com os filtros aplicados' : 'cadastrada ainda'}
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedIds.length === juntasFiltradas.length && juntasFiltradas.length > 0}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedIds(juntasFiltradas.map(j => j.id));
                          } else {
                            setSelectedIds([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Nº da Junta</TableHead>
                    <TableHead>Linha</TableHead>
                    <TableHead>Fluido</TableHead>
                    <TableHead>DN</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {juntasFiltradas.map((junta) => (
                    <TableRow 
                      key={junta.id}
                      className={selectedIds.includes(junta.id) ? "bg-orange-50" : ""}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(junta.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedIds([...selectedIds, junta.id]);
                            } else {
                              setSelectedIds(selectedIds.filter(id => id !== junta.id));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{junta.numero_junta}</TableCell>
                      <TableCell>{junta.linhas?.nome_linha}</TableCell>
                      <TableCell>{junta.linhas?.fluidos?.nome}</TableCell>
                      <TableCell>{junta.dn ? `${junta.dn}"` : "-"}</TableCell>
                      <TableCell>{new Date(junta.created_at).toLocaleDateString('pt-BR')}</TableCell>
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

export default CadastroJuntas;