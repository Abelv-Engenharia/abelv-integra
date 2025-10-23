import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { Plus, Trash2, CalendarIcon, Upload, X, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useCCAs } from "@/hooks/useCCAs";
import { useCredores } from "@/hooks/useCredores";
import { useEmpresas } from "@/hooks/useEmpresas";
import { useAlmoxarifados } from "@/hooks/useAlmoxarifados";
import { useNfeCompras } from "@/hooks/useNfeCompras";
import { useTiposDocumentos } from "@/hooks/useTiposDocumentos";
import { estoqueMovimentacoesService } from "@/services/estoqueMovimentacoesService";
import { supabase } from "@/integrations/supabase/client";
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
const itemSchema = z.object({
  descricao: z.string().min(1, "Descrição é obrigatória"),
  unidade: z.string().min(1, "Unidade é obrigatória"),
  quantidade: z.number().min(0.01, "Quantidade deve ser maior que 0"),
  valorunitario: z.number().min(0).optional(),
  total: z.number().default(0)
});
const entradaSchema = z.object({
  cca: z.number({
    required_error: "CCA é obrigatório"
  }).min(1, "CCA deve ser maior que 0"),
  almoxarifado: z.string().min(1, "Almoxarifado é obrigatório"),
  empresa: z.number().optional(),
  credor: z.string().optional(),
  documento: z.string().optional(),
  nfe_id: z.string().optional(),
  numerodocumento: z.string().min(1, "Número do documento é obrigatório"),
  dataemissao: z.date({
    required_error: "Data de emissão é obrigatória"
  }),
  datamovimento: z.date({
    required_error: "Data do movimento é obrigatória"
  }),
  pcabelv: z.number().optional(),
  pccliente: z.number().optional(),
  arquivo: z.any().optional(),
  itens: z.array(itemSchema).min(1, "Pelo menos um item é obrigatório")
});
type EntradaFormData = z.infer<typeof entradaSchema>;
export default function NovaEntrada() {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  
  const {
    data: ccas = [],
    isLoading: ccasLoading
  } = useCCAs();
  const {
    data: credores = [],
    isLoading: credoresLoading
  } = useCredores();
  
  const form = useForm<EntradaFormData>({
    resolver: zodResolver(entradaSchema),
    defaultValues: {
      cca: undefined,
      almoxarifado: "",
      empresa: undefined,
      credor: "",
      documento: "",
      nfe_id: "",
      numerodocumento: "",
      pcabelv: undefined,
      pccliente: undefined,
      itens: [{
        descricao: "",
        unidade: "",
        quantidade: 0,
        valorunitario: 0,
        total: 0
      }]
    }
  });
  
  const ccaSelecionado = form.watch("cca");
  const documentoSelecionado = form.watch("documento");
  
  const {
    data: empresas = [],
    isLoading: empresasLoading
  } = useEmpresas(ccaSelecionado);
  
  const {
    data: almoxarifados = [],
    isLoading: almoxarifadosLoading
  } = useAlmoxarifados(ccaSelecionado);
  
  const {
    data: nfes = [],
    isLoading: nfesLoading
  } = useNfeCompras(ccaSelecionado, true);
  
  const {
    data: tiposDocumentos = [],
    isLoading: tiposDocumentosLoading
  } = useTiposDocumentos();
  const {
    fields,
    append,
    remove
  } = useFieldArray({
    control: form.control,
    name: "itens"
  });
  const watchedItens = form.watch("itens");

  // Calcular total automaticamente
  const calculateTotal = (quantidade: number, valorunitario?: number) => {
    return valorunitario ? quantidade * valorunitario : 0;
  };

  // Atualizar total quando quantidade ou valor unitário mudar
  const handleItemChange = (index: number, field: string, value: any) => {
    const currentItem = watchedItens[index];
    let updatedItem = {
      ...currentItem,
      [field]: value
    };
    if (field === "quantidade" || field === "valorunitario") {
      updatedItem.total = calculateTotal(field === "quantidade" ? value : currentItem.quantidade, field === "valorunitario" ? value : currentItem.valorunitario);
    }
    form.setValue(`itens.${index}`, updatedItem);
  };
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tamanho
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "Erro no arquivo",
          description: "O arquivo deve ter no máximo 3MB",
          variant: "destructive"
        });
        return;
      }

      // Validar tipo
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        toast({
          title: "Erro no arquivo",
          description: "Apenas arquivos PDF, PNG, JPEG e JPG são aceitos",
          variant: "destructive"
        });
        return;
      }
      setUploadedFile(file);
      form.setValue("arquivo", file);
    }
  };
  const removeFile = () => {
    setUploadedFile(null);
    form.setValue("arquivo", undefined);
  };
  const onSubmit = async (data: EntradaFormData) => {
    try {
      setLoading(true);
      
      let pdfUrl: string | undefined;
      let pdfNome: string | undefined;
      
      // Upload do arquivo se existir
      if (uploadedFile) {
        const fileExt = uploadedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${uploadedFile.name}`;
        const filePath = `entradas/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('estoque-documentos')
          .upload(filePath, uploadedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('estoque-documentos')
          .getPublicUrl(filePath);

        pdfUrl = publicUrl;
        pdfNome = uploadedFile.name;
      }
      
      // Preparar dados para salvar
      const movimentacaoInput = {
        cca_id: data.cca,
        almoxarifado_id: data.almoxarifado,
        id_credor: data.credor || undefined,
        numero: data.numerodocumento,
        id_empresa: data.empresa || undefined,
        id_documento: data.documento || undefined,
        emissao: format(data.dataemissao, 'yyyy-MM-dd'),
        movimento: format(data.datamovimento, 'yyyy-MM-dd'),
        pdf_url: pdfUrl,
        pdf_nome: pdfNome,
      };
      
      const itens = data.itens.map(item => ({
        descricao: item.descricao,
        unidade: item.unidade,
        quantidade: item.quantidade,
        unitario: item.valorunitario,
      }));
      
      await estoqueMovimentacoesService.create(movimentacaoInput, itens);
      
      toast({
        title: "Entrada registrada",
        description: "A entrada de materiais foi registrada com sucesso"
      });
      navigate("/suprimentos/estoque/entradas/entrada-materiais");
    } catch (error: any) {
      console.error("Erro ao salvar entrada:", error);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Ocorreu um erro ao salvar a entrada",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);
  };
  return <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate("/suprimentos/estoque/entradas/entrada-materiais")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nova Entrada de Materiais</h1>
          <p className="text-muted-foreground">
            Cadastre uma nova entrada de materiais no estoque
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Documento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="cca" render={({
                field
              }) => <FormItem>
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Cca *
                      </FormLabel>
                      <Select onValueChange={value => {
                        field.onChange(parseInt(value));
                        form.setValue("empresa", undefined);
                        form.setValue("almoxarifado", "");
                      }} value={field.value?.toString()} disabled={ccasLoading}>
                        <FormControl>
                          <SelectTrigger className={cn(!field.value && "border-destructive")}>
                            <SelectValue placeholder={ccasLoading ? "Carregando..." : "Selecione o CCA"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ccas.filter(cca => cca.ativo).map(cca => <SelectItem key={cca.id} value={cca.id.toString()}>
                              {cca.codigo} - {cca.nome}
                            </SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="almoxarifado" render={({
                field
              }) => <FormItem>
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Almoxarifado *
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={almoxarifadosLoading || !ccaSelecionado}>
                        <FormControl>
                          <SelectTrigger className={cn(!field.value && "border-destructive")}>
                            <SelectValue placeholder={almoxarifadosLoading ? "Carregando..." : "Selecione o almoxarifado"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {almoxarifados.filter(a => a.ativo).map(almox => <SelectItem key={almox.id} value={almox.id}>
                              {almox.nome}
                            </SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="empresa" render={({
                field
              }) => <FormItem>
                      <FormLabel>Empresa</FormLabel>
                      <Select onValueChange={value => field.onChange(parseInt(value))} value={field.value?.toString()} disabled={empresasLoading}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={empresasLoading ? "Carregando..." : "Selecione a empresa"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {empresas.map(empresa => <SelectItem key={empresa.id} value={empresa.id.toString()}>
                              {empresa.name}
                            </SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="credor" render={({
                field
              }) => <FormItem>
                      <FormLabel>Credor</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={credoresLoading}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={credoresLoading ? "Carregando..." : "Selecione o credor"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {credores.map(credor => <SelectItem key={credor.id} value={credor.id_sienge}>
                              {credor.razao}
                            </SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="documento" render={({
                field
              }) => <FormItem>
                      <FormLabel>
                        Tipo de documento
                      </FormLabel>
                      <Select onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("nfe_id", "");
                      }} value={field.value} disabled={tiposDocumentosLoading}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={tiposDocumentosLoading ? "Carregando..." : "Selecione o tipo"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tiposDocumentos.map(tipo => (
                            <SelectItem key={tipo.codigo} value={tipo.codigo}>
                              {tipo.codigo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>} />

                {documentoSelecionado === "NFe" && (
                  <FormField control={form.control} name="nfe_id" render={({
                  field
                }) => <FormItem>
                        <FormLabel>
                          Nfe
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={nfesLoading || !ccaSelecionado}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={nfesLoading ? "Carregando..." : "Selecione a NFe"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {nfes.map(nfe => <SelectItem key={nfe.id} value={nfe.id}>
                                {nfe.numero} - {nfe.credor?.razao}
                              </SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>} />
                )}

                <FormField control={form.control} name="numerodocumento" render={({
                field
              }) => <FormItem>
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Número do documento *
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Número do documento" className={cn(!field.value && "border-destructive")} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="dataemissao" render={({
                field
              }) => <FormItem>
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Data da emissão *
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground border-destructive")}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "dd/MM/yyyy") : "Selecione a data"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus className="pointer-events-auto" />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="datamovimento" render={({
                field
              }) => <FormItem>
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Data do movimento *
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground border-destructive")}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "dd/MM/yyyy") : "Selecione a data"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus className="pointer-events-auto" />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="pcabelv" render={({
                field
              }) => <></>} />

                <FormField control={form.control} name="pccliente" render={({
                field
              }) => <></>} />
              </div>

              {/* Upload de arquivo */}
              <div className="space-y-2">
                <Label>Arquivo</Label>
                <div className="border-2 border-dashed rounded-lg p-4">
                  {uploadedFile ? <div className="flex items-center justify-between">
                      <span className="text-sm">{uploadedFile.name}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={removeFile}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div> : <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div className="mt-2">
                        <Label htmlFor="file-upload" className="cursor-pointer">
                          <span className="font-medium text-primary hover:underline">
                            Clique para enviar
                          </span>
                          <span className="text-muted-foreground"> ou arraste e solte</span>
                        </Label>
                        <Input id="file-upload" type="file" className="hidden" accept=".pdf,.png,.jpeg,.jpg" onChange={handleFileUpload} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, PNG, JPEG ou JPG até 3MB
                      </p>
                    </div>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card de itens */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Itens da Entrada</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={() => append({
                descricao: "",
                unidade: "",
                quantidade: 0,
                valorunitario: 0,
                total: 0
              })}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => <div key={field.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg">
                  <FormField control={form.control} name={`itens.${index}.descricao`} render={({
                field: descricaoField
              }) => <FormItem className="md:col-span-2">
                        <FormLabel className={cn(!descricaoField.value && "text-destructive")}>
                          Descrição *
                        </FormLabel>
                        <FormControl>
                          <Input {...descricaoField} placeholder="Descrição do item" className={cn(!descricaoField.value && "border-destructive")} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name={`itens.${index}.unidade`} render={({
                field: unidadeField
              }) => <FormItem>
                        <FormLabel className={cn(!unidadeField.value && "text-destructive")}>
                          Unidade *
                        </FormLabel>
                        <FormControl>
                          <Input {...unidadeField} placeholder="UN" className={cn(!unidadeField.value && "border-destructive")} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name={`itens.${index}.quantidade`} render={({
                field: quantidadeField
              }) => <FormItem>
                        <FormLabel className={cn(quantidadeField.value <= 0 && "text-destructive")}>
                          Quantidade *
                        </FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...quantidadeField} onChange={e => {
                    const value = parseFloat(e.target.value) || 0;
                    handleItemChange(index, "quantidade", value);
                  }} placeholder="0" className={cn(quantidadeField.value <= 0 && "border-destructive")} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name={`itens.${index}.valorunitario`} render={({
                field: valorField
              }) => <FormItem>
                        <FormLabel>Valor unitário</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...valorField} onChange={e => {
                    const value = parseFloat(e.target.value) || 0;
                    handleItemChange(index, "valorunitario", value);
                  }} placeholder="0,00" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <div className="flex flex-col justify-between">
                    <Label>Total</Label>
                    <div className="flex items-center justify-between gap-2">
                      <Input value={formatCurrency(watchedItens[index]?.total || 0)} readOnly className="bg-muted" />
                      {fields.length > 1 && <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>}
                    </div>
                  </div>
                </div>)}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate("/suprimentos/estoque/entradas/entrada-materiais")} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Entrada"}
            </Button>
          </div>
        </form>
      </Form>
    </div>;
}