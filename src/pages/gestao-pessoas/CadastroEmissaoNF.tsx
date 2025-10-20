import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Check, FileText, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import NFUploadField from "@/components/gestao-pessoas/nf/NFUploadField";
import { NotaFiscal } from "@/types/gestao-pessoas/nf";
import { StatusBadgeNF } from "@/components/gestao-pessoas/nf/StatusBadgeNF";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as XLSX from "xlsx";
const formSchema = z.object({
  nomeempresa: z.string().min(1, "Nome da empresa é obrigatório"),
  nomerepresentante: z.string().min(1, "Nome do representante é obrigatório"),
  periodocontabil: z.string().min(1, "Período contábil é obrigatório"),
  cca: z.string().min(1, "CCA é obrigatório"),
  numero: z.string().min(1, "Número da NF é obrigatório"),
  dataemissao: z.date({
    required_error: "Data de emissão é obrigatória"
  }),
  descricaoservico: z.string().min(1, "Descrição do serviço é obrigatória"),
  valor: z.number().min(0.01, "Valor deve ser maior que zero"),
  arquivo: z.instanceof(File).nullable().refine(file => file !== null, {
    message: "Arquivo da NF é obrigatório"
  })
});
const CadastroEmissaoNF = () => {
  const [notasFiscais, setNotasFiscais] = useState<NotaFiscal[]>([{
    id: "1",
    numero: "000123",
    nomeempresa: "Construtora ABC Ltda",
    nomerepresentante: "João Silva",
    periodocontabil: "01/2024",
    cca: "CC-001",
    dataemissao: "2024-01-15",
    descricaoservico: "Serviços de construção civil - Fase 1",
    valor: 15000.0,
    arquivo: null,
    arquivonome: "nf-000123.pdf",
    status: "Enviado",
    criadoem: "2024-01-15 10:30",
    dataenviosienge: "2024-01-15 14:30"
  }, {
    id: "2",
    numero: "000124",
    nomeempresa: "Serviços XYZ S.A.",
    nomerepresentante: "Maria Santos",
    periodocontabil: "01/2024",
    cca: "CC-002",
    dataemissao: "2024-01-18",
    descricaoservico: "Manutenção de equipamentos",
    valor: 8500.0,
    arquivo: null,
    arquivonome: "nf-000124.pdf",
    status: "Aprovado",
    criadoem: "2024-01-18 09:15"
  }]);
  const [filtroStatus, setFiltroStatus] = useState<string>("Todos");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState<z.infer<typeof formSchema> | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomeempresa: "",
      nomerepresentante: "",
      periodocontabil: "",
      cca: "",
      numero: "",
      valor: 0,
      descricaoservico: "",
      arquivo: null
    }
  });
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setPendingSubmit(data);
    setShowConfirmDialog(true);
  };
  const enviarParaSienge = async () => {
    if (!pendingSubmit) return;

    // Simulação de envio para Sienge
    const sucesso = Math.random() > 0.2; // 80% de sucesso

    if (sucesso) {
      const novaNF: NotaFiscal = {
        id: Date.now().toString(),
        numero: pendingSubmit.numero,
        nomeempresa: pendingSubmit.nomeempresa,
        nomerepresentante: pendingSubmit.nomerepresentante,
        periodocontabil: pendingSubmit.periodocontabil,
        cca: pendingSubmit.cca,
        dataemissao: format(pendingSubmit.dataemissao, "yyyy-MM-dd"),
        descricaoservico: pendingSubmit.descricaoservico,
        valor: pendingSubmit.valor,
        arquivo: pendingSubmit.arquivo,
        arquivonome: pendingSubmit.arquivo?.name,
        status: "Enviado",
        criadoem: format(new Date(), "yyyy-MM-dd HH:mm"),
        dataenviosienge: format(new Date(), "yyyy-MM-dd HH:mm")
      };
      setNotasFiscais([novaNF, ...notasFiscais]);
      toast.success("NF aprovada e enviada para o Sienge com sucesso!");
      form.reset();
    } else {
      const novaNF: NotaFiscal = {
        id: Date.now().toString(),
        numero: pendingSubmit.numero,
        nomeempresa: pendingSubmit.nomeempresa,
        nomerepresentante: pendingSubmit.nomerepresentante,
        periodocontabil: pendingSubmit.periodocontabil,
        cca: pendingSubmit.cca,
        dataemissao: format(pendingSubmit.dataemissao, "yyyy-MM-dd"),
        descricaoservico: pendingSubmit.descricaoservico,
        valor: pendingSubmit.valor,
        arquivo: pendingSubmit.arquivo,
        arquivonome: pendingSubmit.arquivo?.name,
        status: "Erro",
        criadoem: format(new Date(), "yyyy-MM-dd HH:mm"),
        mensagemerro: "Falha na conexão com Sienge. Tente novamente."
      };
      setNotasFiscais([novaNF, ...notasFiscais]);
      toast.error("Erro ao enviar NF para o Sienge. Tente novamente.");
    }
    setShowConfirmDialog(false);
    setPendingSubmit(null);
  };
  const salvarRascunho = () => {
    const data = form.getValues();
    if (!data.nomeempresa || !data.numero) {
      toast.error("Preencha os campos obrigatórios antes de salvar o rascunho");
      return;
    }
    const novaNF: NotaFiscal = {
      id: Date.now().toString(),
      numero: data.numero,
      nomeempresa: data.nomeempresa,
      nomerepresentante: data.nomerepresentante,
      periodocontabil: data.periodocontabil,
      cca: data.cca,
      dataemissao: data.dataemissao ? format(data.dataemissao, "yyyy-MM-dd") : "",
      descricaoservico: data.descricaoservico,
      valor: data.valor,
      arquivo: data.arquivo,
      arquivonome: data.arquivo?.name,
      status: "Rascunho",
      criadoem: format(new Date(), "yyyy-MM-dd HH:mm")
    };
    setNotasFiscais([novaNF, ...notasFiscais]);
    toast.success("Rascunho salvo com sucesso!");
    form.reset();
  };
  const nfsFiltradas = notasFiscais.filter(nf => filtroStatus === "Todos" || nf.status === filtroStatus);
  const exportarParaExcel = () => {
    const dados = nfsFiltradas.map(nf => ({
      "Número NF": nf.numero,
      "Nome da Empresa": nf.nomeempresa,
      "Representante": nf.nomerepresentante,
      "Período Contábil": nf.periodocontabil,
      "CCA": nf.cca,
      "Data Emissão": new Date(nf.dataemissao).toLocaleDateString('pt-BR'),
      "Descrição": nf.descricaoservico,
      "Valor": nf.valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      }),
      "Status": nf.status
    }));
    const ws = XLSX.utils.json_to_sheet(dados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Notas Fiscais");
    XLSX.writeFile(wb, `notas-fiscais-${format(new Date(), "yyyy-MM-dd")}.xlsx`);
    toast.success("Relatório exportado com sucesso!");
  };
  return <Layout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground">
          Gestão de Pessoas &gt; Prestadores de Serviço &gt; Cadastro de Emissão de NF
        </div>

        {/* Formulário de Emissão */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Nova Emissão de Nota Fiscal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="nomeempresa" render={({
                  field
                }) => <FormItem>
                        <FormLabel className={!field.value ? "text-destructive" : ""}>
                          Nome da Empresa *
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ex: Construtora ABC Ltda" className={!field.value ? "border-destructive" : ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name="nomerepresentante" render={({
                  field
                }) => <FormItem>
                        <FormLabel className={!field.value ? "text-destructive" : ""}>
                          Nome do Representante *
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ex: João Silva" className={!field.value ? "border-destructive" : ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />


                  <FormField control={form.control} name="cca" render={({
                  field
                }) => <FormItem>
                        <FormLabel className={!field.value ? "text-destructive" : ""}>
                          CCA *
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ex: CC-001" className={!field.value ? "border-destructive" : ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name="numero" render={({
                  field
                }) => <FormItem>
                        <FormLabel className={!field.value ? "text-destructive" : ""}>
                          Número da NF *
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="000123" className={!field.value ? "border-destructive" : ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name="dataemissao" render={({
                  field
                }) => <FormItem>
                        <FormLabel className={!field.value ? "text-destructive" : ""}>
                          Data de Emissão *
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground border-destructive")}>
                                {field.value ? format(field.value, "dd/MM/yyyy") : <span>Selecione a data</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={date => date > new Date()} initialFocus className="pointer-events-auto" />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name="valor" render={({
                  field
                }) => <FormItem>
                        <FormLabel className={!field.value || field.value === 0 ? "text-destructive" : ""}>
                          Valor da NF *
                        </FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} placeholder="0,00" className={!field.value || field.value === 0 ? "border-destructive" : ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                </div>

                <FormField control={form.control} name="descricaoservico" render={({
                field
              }) => <FormItem>
                      <FormLabel className={!field.value ? "text-destructive" : ""}>
                        Descrição do Serviço *
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Descreva os serviços prestados..." className={cn("min-h-[100px]", !field.value && "border-destructive")} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="arquivo" render={({
                field
              }) => <FormItem>
                      <NFUploadField label="Arquivo da NF" value={field.value} onChange={field.onChange} required />
                      <FormMessage />
                    </FormItem>} />

                <div className="flex flex-wrap gap-3">
                  <Button type="submit" className="gap-2">
                    <Check className="h-4 w-4" />
                    Salvar
                  </Button>
                  
                  <Button type="button" variant="ghost" onClick={() => form.reset()}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Tabela de Notas Fiscais Emitidas */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Notas Fiscais Emitidas</CardTitle>
              <div className="flex gap-2">
                <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos os Status</SelectItem>
                    <SelectItem value="Rascunho">Rascunho</SelectItem>
                    <SelectItem value="Enviado">Enviado</SelectItem>
                    <SelectItem value="Aprovado">Aprovado</SelectItem>
                    <SelectItem value="Reprovado">Reprovado</SelectItem>
                    <SelectItem value="Erro">Erro</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={exportarParaExcel} variant="outline">
                  Exportar Excel
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número NF</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>CCA</TableHead>
                    <TableHead>Data Emissão</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nfsFiltradas.length === 0 ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Nenhuma nota fiscal encontrada
                      </TableCell>
                    </TableRow> : nfsFiltradas.map(nf => <TableRow key={nf.id}>
                        <TableCell className="font-medium">{nf.numero}</TableCell>
                        <TableCell>{nf.nomeempresa}</TableCell>
                        <TableCell>{nf.periodocontabil}</TableCell>
                        <TableCell>{nf.cca}</TableCell>
                        <TableCell>{new Date(nf.dataemissao).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="font-semibold">
                          {nf.valor.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL"
                    })}
                        </TableCell>
                        <TableCell>
                          <StatusBadgeNF status={nf.status} />
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            {nfsFiltradas.length > 0 && <div className="mt-4 text-sm text-muted-foreground">
                Exibindo {nfsFiltradas.length} de {notasFiscais.length} registros
              </div>}
          </CardContent>
        </Card>
      </div>

      {/* Diálogo de Confirmação */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Envio para Sienge</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja aprovar e enviar esta nota fiscal para o Sienge?
              Esta ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingSubmit(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={enviarParaSienge}>
              Confirmar Envio
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>;
};
export default CadastroEmissaoNF;