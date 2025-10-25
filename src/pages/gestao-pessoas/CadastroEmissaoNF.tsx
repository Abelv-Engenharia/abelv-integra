import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { CalendarIcon, Check, FileText, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import NFUploadField from "@/components/gestao-pessoas/nf/NFUploadField";
import { NotaFiscal } from "@/types/gestao-pessoas/nf";
import { StatusBadgeNF } from "@/components/gestao-pessoas/nf/StatusBadgeNF";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as XLSX from "xlsx";
import { useAuth } from "@/contexts/AuthContext";
import { useUsuarioPrestador } from "@/hooks/gestao-pessoas/useUsuarioPrestador";
import { notasFiscaisService } from "@/services/gestao-pessoas/notasFiscaisService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
const formSchema = z.object({
  nomeempresa: z.string().min(1, "Nome da empresa é obrigatório"),
  nomerepresentante: z.string().min(1, "Nome do representante é obrigatório"),
  numerocredorsienge: z.string().min(1, "N° Credor Sienge é obrigatório"),
  periodocontabil: z.string().min(1, "Período contábil é obrigatório"),
  cca: z.string().min(1, "CCA é obrigatório"),
  numero: z.string().min(1, "Número da NF é obrigatório"),
  dataemissao: z.date({
    required_error: "Data de emissão é obrigatória"
  }),
  dataemissaomanual: z.string().optional(),
  descricaoservico: z.string().min(1, "Descrição do serviço é obrigatória"),
  valor: z.string().min(1, "Valor deve ser maior que zero"),
  arquivo: z.instanceof(File).nullable().refine(file => file !== null, {
    message: "Arquivo da NF é obrigatório"
  })
});
const CadastroEmissaoNF = () => {
  const { user } = useAuth();
  const { data: usuarioPrestador, isLoading: loadingPrestador } = useUsuarioPrestador();
  const queryClient = useQueryClient();
  const [filtroStatus, setFiltroStatus] = useState<string>("Todos");

  // Query para listar NFs
  const { data: notasFiscais = [], isLoading: loadingNFs } = useQuery({
    queryKey: ['notas-fiscais-prestador', user?.id],
    queryFn: notasFiscaisService.listar,
    enabled: !!user,
    refetchInterval: 30000
  });

  // Mutation para criar NF
  const criarNFMutation = useMutation({
    mutationFn: notasFiscaisService.criar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notas-fiscais-prestador'] });
      toast.success("Nota fiscal cadastrada com sucesso!");
      form.reset();
    },
    onError: (error: any) => {
      console.error('Erro ao cadastrar NF:', error);
      toast.error(`Erro ao cadastrar NF: ${error.message}`);
    }
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomeempresa: "",
      nomerepresentante: "",
      numerocredorsienge: "",
      periodocontabil: "",
      cca: "",
      numero: "",
      dataemissaomanual: "",
      valor: "",
      descricaoservico: "",
      arquivo: null
    }
  });

  // Preencher campos automaticamente quando os dados do prestador estiverem disponíveis
  useEffect(() => {
    if (usuarioPrestador) {
      form.setValue('nomeempresa', usuarioPrestador.nomeEmpresa);
      form.setValue('nomerepresentante', usuarioPrestador.nomeRepresentante);
      form.setValue('numerocredorsienge', usuarioPrestador.numeroCredorSienge);
      
      // Se houver apenas 1 CCA, preencher automaticamente
      if (usuarioPrestador.ccasPermitidas.length === 1) {
        const cca = usuarioPrestador.ccasPermitidas[0];
        form.setValue('cca', cca.codigo);
      } else if (usuarioPrestador.ccaPrincipal) {
        // Caso contrário, usar CCA principal do prestador
        form.setValue('cca', usuarioPrestador.ccaPrincipal.codigo);
      }
    }
  }, [usuarioPrestador, form]);

  // Preencher período contábil automaticamente baseado na data de emissão
  const dataemissao = form.watch("dataemissao");
  useEffect(() => {
    if (dataemissao) {
      const mes = String(dataemissao.getMonth() + 1).padStart(2, '0');
      const ano = dataemissao.getFullYear();
      form.setValue("periodocontabil", `${mes}/${ano}`);
    }
  }, [dataemissao, form]);
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!usuarioPrestador) {
      toast.error("Erro: dados do prestador não encontrados");
      return;
    }

    // Validar campos obrigatórios
    if (!data.dataemissao) {
      toast.error("Data de emissão é obrigatória");
      return;
    }

    if (!data.valor || data.valor === "") {
      toast.error("Valor da NF é obrigatório");
      return;
    }

    // Encontrar CCA selecionada
    const ccaSelecionada = usuarioPrestador.ccasPermitidas.find(
      c => c.codigo === data.cca
    );

    if (!ccaSelecionada) {
      toast.error("CCA inválida selecionada");
      return;
    }

    // Converter valor monetário para número
    const valorNumerico = parseFloat(data.valor.replace(/\./g, '').replace(',', '.'));
    
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      toast.error("Valor inválido");
      return;
    }

    try {
      await criarNFMutation.mutateAsync({
        prestadorPjId: usuarioPrestador.prestadorPjId,
        nomeEmpresa: data.nomeempresa,
        nomeRepresentante: data.nomerepresentante,
        periodoContabil: data.periodocontabil,
        ccaId: ccaSelecionada.id,
        ccaCodigo: ccaSelecionada.codigo,
        ccaNome: ccaSelecionada.nome,
        numero: data.numero,
        dataEmissao: format(data.dataemissao, 'yyyy-MM-dd'),
        descricaoServico: data.descricaoservico,
        valor: valorNumerico,
        arquivo: data.arquivo!
      });
    } catch (error) {
      // Erro já tratado no onError da mutation
    }
  };
  const nfsFiltradas = notasFiscais.filter(nf => filtroStatus === "Todos" || nf.status === filtroStatus);

  // Validação de acesso
  if (loadingPrestador) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <p className="text-muted-foreground">Carregando dados do prestador...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!usuarioPrestador) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="py-10">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
              <div>
                <h3 className="font-semibold text-lg">Acesso Negado</h3>
                <p className="text-muted-foreground mt-2">
                  Você não está vinculado a nenhum prestador de serviço PJ.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Entre em contato com o administrador do sistema.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (usuarioPrestador.ccasPermitidas.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="py-10">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto" />
              <div>
                <h3 className="font-semibold text-lg">Nenhum CCA Vinculado</h3>
                <p className="text-muted-foreground mt-2">
                  Você não possui CCAs vinculados ao seu usuário.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Entre em contato com o administrador do sistema.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
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
  return <div className="container mx-auto p-6 space-y-6">
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
                        <FormLabel>Nome da Empresa</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled 
                            className="bg-muted cursor-not-allowed"
                            placeholder="Carregando..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name="nomerepresentante" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Nome do Representante</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled 
                            className="bg-muted cursor-not-allowed"
                            placeholder="Carregando..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name="numerocredorsienge" render={({
                  field
                }) => <FormItem>
                        <FormLabel>N° Credor Sienge</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled 
                            className="bg-muted cursor-not-allowed"
                            placeholder="Carregando..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name="periodocontabil" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Período Contábil</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled
                            placeholder="Será preenchido automaticamente"
                            className="bg-muted cursor-not-allowed"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />


                  <FormField control={form.control} name="cca" render={({
                  field
                }) => <FormItem>
                        <FormLabel className={!field.value ? "text-destructive" : ""}>
                          CCA *
                        </FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                          disabled={loadingPrestador || !usuarioPrestador}
                        >
                          <FormControl>
                            <SelectTrigger className={!field.value ? "border-destructive" : ""}>
                              <SelectValue 
                                placeholder={
                                  loadingPrestador 
                                    ? "Carregando CCAs..." 
                                    : usuarioPrestador?.ccasPermitidas.length === 0
                                      ? "Nenhum CCA disponível"
                                      : "Selecione o CCA"
                                } 
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {usuarioPrestador?.ccasPermitidas.map((cca) => (
                              <SelectItem key={cca.id} value={cca.codigo}>
                                {cca.codigo} - {cca.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                        <div className="flex gap-2">
                          <FormControl>
                            <Input 
                              type="date"
                              value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                              onChange={(e) => {
                                const date = e.target.value ? new Date(e.target.value + 'T00:00:00') : null;
                                field.onChange(date);
                              }}
                              max={format(new Date(), 'yyyy-MM-dd')}
                              className={cn(!field.value && "border-destructive")}
                            />
                          </FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button 
                                variant="outline" 
                                className={cn("px-3", !field.value && "border-destructive")}
                              >
                                <CalendarIcon className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar 
                                mode="single" 
                                selected={field.value} 
                                onSelect={field.onChange} 
                                disabled={date => date > new Date()} 
                                initialFocus 
                                className="pointer-events-auto" 
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name="valor" render={({
                  field
                }) => <FormItem>
                        <FormLabel className={!field.value ? "text-destructive" : ""}>
                          Valor da NF *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="R$ 0,00"
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, '');
                              if (value) {
                                value = (parseInt(value) / 100).toFixed(2);
                                value = value.replace('.', ',');
                                value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                              }
                              field.onChange(value);
                            }}
                            className={!field.value ? "border-destructive" : ""}
                          />
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
                  {loadingNFs ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Carregando...
                      </TableCell>
                    </TableRow>
                  ) : nfsFiltradas.length === 0 ? <TableRow>
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
      </div>;
};
export default CadastroEmissaoNF;