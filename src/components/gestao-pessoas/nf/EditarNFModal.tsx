import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NotaFiscal } from "@/types/gestao-pessoas/nf";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Download, Check, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUpdateNotaFiscal } from "@/hooks/gestao-pessoas/useNotasFiscais";

interface EditarNFModalProps {
  open: boolean;
  onClose: () => void;
  notaFiscal: NotaFiscal | null;
}

const formSchema = z.object({
  // Campos da Emissão
  nomeempresa: z.string().min(1, "Nome da empresa é obrigatório"),
  nomerepresentante: z.string().min(1, "Nome do representante é obrigatório"),
  periodocontabil: z.string().min(1, "Período contábil é obrigatório"),
  dataemissao: z.date({
    required_error: "Data de emissão é obrigatória",
  }),
  descricaoservico: z.string().min(1, "Descrição do serviço é obrigatória"),
  valor: z.number().positive("Valor deve ser maior que zero"),
  
  // Campos da Aprovação
  tipodocumento: z.enum(["NFSE", "NFe", "NFS", "Outros"], {
    required_error: "Tipo de documento é obrigatório",
  }),
  empresadestino: z.string().min(1, "Empresa é obrigatória"),
  numerocredor: z.string().min(1, "Número de credor é obrigatório"),
  datavencimento: z.date({
    required_error: "Data de vencimento é obrigatória",
  }),
  cca: z.string().min(1, "CCA é obrigatório"),
  planofinanceiro: z.string().min(1, "Plano financeiro é obrigatório"),
  observacoesaprovacao: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function EditarNFModal({ open, onClose, notaFiscal }: EditarNFModalProps) {
  const updateMutation = useUpdateNotaFiscal();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Dados da Emissão
      nomeempresa: notaFiscal?.nomeempresa || "",
      nomerepresentante: notaFiscal?.nomerepresentante || "",
      periodocontabil: notaFiscal?.periodocontabil || "",
      dataemissao: notaFiscal?.dataemissao ? new Date(notaFiscal.dataemissao + 'T00:00:00') : undefined,
      descricaoservico: notaFiscal?.descricaoservico || "",
      valor: notaFiscal?.valor || 0,
      
      // Dados da Aprovação
      tipodocumento: notaFiscal?.tipodocumento || "NFSE",
      empresadestino: notaFiscal?.empresadestino || "Abelv Engenharia",
      numerocredor: notaFiscal?.numerocredor || "",
      datavencimento: notaFiscal?.datavencimento ? new Date(notaFiscal.datavencimento + 'T00:00:00') : undefined,
      cca: notaFiscal?.cca || "",
      planofinanceiro: notaFiscal?.planofinanceiro || "2.02.01.21 - Salários / Remunerações - PJ",
      observacoesaprovacao: notaFiscal?.observacoesaprovacao || "",
    },
  });

  // Atualiza os valores do formulário quando o modal abre ou a NF muda
  useEffect(() => {
    const buscarNumeroCredor = async () => {
      if (open && notaFiscal) {
        let numeroCredor = notaFiscal.numerocredor || "";

        // Buscar o prestador PJ pelo ID da nota fiscal para pegar o numerocredor
        try {
          const { data: nfData } = await supabase
            .from("prestadores_notas_fiscais")
            .select("prestador_pj_id")
            .eq("id", notaFiscal.id)
            .single();

          if (nfData?.prestador_pj_id) {
            const { data: prestadorData } = await supabase
              .from("prestadores_pj")
              .select("numerocredorsienge")
              .eq("id", nfData.prestador_pj_id)
              .single();

            if (prestadorData?.numerocredorsienge) {
              numeroCredor = prestadorData.numerocredorsienge;
            }
          }
        } catch (error) {
          console.error("Erro ao buscar número do credor:", error);
        }

        form.reset({
          nomeempresa: notaFiscal.nomeempresa,
          nomerepresentante: notaFiscal.nomerepresentante,
          periodocontabil: notaFiscal.periodocontabil,
          dataemissao: new Date(notaFiscal.dataemissao + 'T00:00:00'),
          descricaoservico: notaFiscal.descricaoservico,
          valor: notaFiscal.valor,
          tipodocumento: notaFiscal.tipodocumento || "NFSE",
          empresadestino: notaFiscal.empresadestino || "Abelv Engenharia",
          numerocredor: numeroCredor,
          datavencimento: notaFiscal.datavencimento ? new Date(notaFiscal.datavencimento + 'T00:00:00') : undefined,
          cca: notaFiscal.cca || "",
          planofinanceiro: notaFiscal.planofinanceiro || "2.02.01.21 - Salários / Remunerações - PJ",
          observacoesaprovacao: notaFiscal.observacoesaprovacao || "",
        });
      }
    };

    buscarNumeroCredor();
  }, [open, notaFiscal, form]);

  if (!notaFiscal) return null;

  const handleAprovar = async () => {
    // Validar campos obrigatórios do formulário
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error("Preencha todos os campos obrigatórios antes de aprovar");
      return;
    }

    const formValues = form.getValues();
    
    // Buscar usuário atual
    const { data: { user } } = await supabase.auth.getUser();
    
    updateMutation.mutate({
      id: notaFiscal.id,
      nomeempresa: formValues.nomeempresa,
      nomerepresentante: formValues.nomerepresentante,
      periodocontabil: formValues.periodocontabil,
      dataemissao: formValues.dataemissao.toISOString().split('T')[0],
      descricaoservico: formValues.descricaoservico,
      valor: formValues.valor,
      tipodocumento: formValues.tipodocumento,
      empresadestino: formValues.empresadestino,
      numerocredor: formValues.numerocredor,
      datavencimento: formValues.datavencimento.toISOString().split('T')[0],
      cca: formValues.cca,
      planofinanceiro: formValues.planofinanceiro,
      statusaprovacao: "Aprovado",
      observacoesaprovacao: formValues.observacoesaprovacao,
      status: "Aprovado",
      aprovadopor: user?.id,
      dataaprovacao: new Date().toISOString(),
    }, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  const handleReprovar = async () => {
    const observacoes = form.getValues("observacoesaprovacao");
    if (!observacoes || observacoes.trim() === "") {
      form.setError("observacoesaprovacao", {
        type: "manual",
        message: "Observações são obrigatórias para reprovar"
      });
      toast.error("Para reprovar, as observações são obrigatórias");
      return;
    }

    const formValues = form.getValues();
    
    updateMutation.mutate({
      id: notaFiscal.id,
      nomeempresa: formValues.nomeempresa,
      nomerepresentante: formValues.nomerepresentante,
      periodocontabil: formValues.periodocontabil,
      dataemissao: formValues.dataemissao.toISOString().split('T')[0],
      descricaoservico: formValues.descricaoservico,
      valor: formValues.valor,
      tipodocumento: formValues.tipodocumento,
      empresadestino: formValues.empresadestino,
      numerocredor: formValues.numerocredor,
      datavencimento: formValues.datavencimento.toISOString().split('T')[0],
      cca: formValues.cca,
      planofinanceiro: formValues.planofinanceiro,
      statusaprovacao: "Reprovado",
      observacoesaprovacao: observacoes,
      status: "Reprovado",
    }, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  const handleDownload = () => {
    toast.success("Download iniciado");
  };

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Nota Fiscal - {notaFiscal.numero}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <div className="space-y-6">
            {/* Dados da Emissão - Editáveis */}
            <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Dados da Emissão</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Número da NF</Label>
                  <Input value={notaFiscal.numero} disabled />
                </div>

                <FormField
                  control={form.control}
                  name="dataemissao"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className={!field.value ? "text-destructive" : ""}>
                        Data de Emissão *
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground border-destructive"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                              ) : (
                                <span>Selecione a data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="nomeempresa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={!field.value ? "text-destructive" : ""}>
                        Nome da Empresa *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Digite o nome da empresa"
                          className={!field.value ? "border-destructive" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="nomerepresentante"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={!field.value ? "text-destructive" : ""}>
                        Nome do Representante *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Digite o nome do representante"
                          className={!field.value ? "border-destructive" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="periodocontabil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={!field.value ? "text-destructive" : ""}>
                        Período Contábil *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="MM/AAAA"
                          className={!field.value ? "border-destructive" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={!field.value ? "text-destructive" : ""}>
                        Valor NF *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={formatarValor(field.value)}
                          onChange={(e) => {
                            const valor = e.target.value.replace(/\D/g, '');
                            field.onChange(parseFloat(valor) / 100 || 0);
                          }}
                          placeholder="R$ 0,00"
                          className={!field.value ? "border-destructive" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="descricaoservico"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel className={!field.value ? "text-destructive" : ""}>
                        Descrição do Serviço *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Digite a descrição do serviço prestado"
                          rows={2}
                          className={!field.value ? "border-destructive" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Arquivo Anexado</Label>
                  <div className="mt-1">
                    <Button type="button" variant="outline" size="sm" onClick={handleDownload}>
                      <Download className="mr-2 h-4 w-4" />
                      {notaFiscal.arquivonome || "Baixar NF"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Dados da Aprovação - Editáveis */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dados da Aprovação</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tipodocumento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={!field.value ? "text-destructive" : ""}>
                        Tipo de Documento *
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className={!field.value ? "border-destructive" : ""}>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="NFSE">NFSE</SelectItem>
                          <SelectItem value="NFe">NFe</SelectItem>
                          <SelectItem value="NFS">NFS</SelectItem>
                          <SelectItem value="Outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="empresadestino"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={!field.value ? "text-destructive" : ""}>
                        Empresa *
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className={!field.value ? "border-destructive" : ""}>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Abelv Engenharia">Abelv Engenharia</SelectItem>
                          <SelectItem value="Outras Empresas">Outras Empresas</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numerocredor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={!field.value ? "text-destructive" : ""}>
                        Número de Credor *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ex: CR-12345"
                          className={!field.value ? "border-destructive" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="datavencimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={!field.value ? "text-destructive" : ""}>
                        Data de Vencimento *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                          onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value + 'T00:00:00') : undefined;
                            field.onChange(date);
                          }}
                          min={notaFiscal.dataemissao}
                          className={!field.value ? "border-destructive" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cca"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={!field.value ? "text-destructive" : ""}>
                        CCA *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ex: CC-001"
                          className={!field.value ? "border-destructive" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="planofinanceiro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Plano Financeiro *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value="2.02.01.21 - Salários / Remunerações - PJ"
                          disabled
                          className="bg-muted"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="observacoesaprovacao"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Observações da Aprovação</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Digite observações sobre a aprovação ou reprovação"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="button" variant="default" onClick={handleAprovar} className="bg-green-600 hover:bg-green-700">
                <Check className="mr-2 h-4 w-4" />
                Aprovar
              </Button>
              <Button type="button" variant="destructive" onClick={handleReprovar}>
                <X className="mr-2 h-4 w-4" />
                Reprovar
              </Button>
            </div>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
