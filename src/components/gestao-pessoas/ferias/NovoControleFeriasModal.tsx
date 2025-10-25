import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useUsuarioPrestador } from "@/hooks/gestao-pessoas/useUsuarioPrestador";
import { useResponsaveisSuperiores } from "@/hooks/gestao-pessoas/useResponsaveisSuperiores";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const feriasSchema = z.object({
  nomeEmpresa: z.string().min(1, "Nome da empresa é obrigatório"),
  nomeRepresentante: z.string().min(1, "Nome do representante é obrigatório"),
  funcao: z.string().min(1, "Função é obrigatória"),
  cca: z.string().min(1, "CCA é obrigatório"),
  dataInicioFerias: z.date({
    required_error: "Data de início é obrigatória"
  }),
  diasFerias: z.number().min(1, "Dias de férias é obrigatório"),
  responsavelDireto: z.string().min(1, "Responsável direto é obrigatório"),
  observacoes: z.string().optional()
});

type FeriasFormData = z.infer<typeof feriasSchema>;

interface NovoControleFeriasModalProps {
  aberto: boolean;
  onFechar: () => void;
}

export function NovoControleFeriasModal({
  aberto,
  onFechar
}: NovoControleFeriasModalProps) {
  const { data: prestadorData, isLoading: loadingPrestador } = useUsuarioPrestador();
  const [ccaSelecionadoId, setCcaSelecionadoId] = useState<number | undefined>(undefined);
  
  // Usar CCA selecionado ou CCA principal
  const ccaId = ccaSelecionadoId || prestadorData?.ccaPrincipal?.id;
  const { data: responsaveisSuperiores = [], isLoading: loadingResponsaveis } = useResponsaveisSuperiores(ccaId);
  
  // Verificar se o usuário tem múltiplos CCAs
  const temMultiplosCcas = (prestadorData?.ccasPermitidas?.length || 0) > 1;

  const form = useForm<FeriasFormData>({
    resolver: zodResolver(feriasSchema),
    defaultValues: {
      nomeEmpresa: "",
      nomeRepresentante: "",
      funcao: "",
      cca: "",
      diasFerias: 0,
      responsavelDireto: "",
      observacoes: ""
    }
  });

  // Preencher campos automaticamente quando os dados do prestador estiverem disponíveis
  useEffect(() => {
    if (prestadorData && aberto) {
      form.setValue('nomeEmpresa', prestadorData.nomeEmpresa);
      form.setValue('nomeRepresentante', prestadorData.nomeRepresentante);
      form.setValue('funcao', prestadorData.funcao);
      if (prestadorData.ccaPrincipal) {
        const ccaValue = `${prestadorData.ccaPrincipal.codigo} - ${prestadorData.ccaPrincipal.nome}`;
        form.setValue('cca', ccaValue);
        // Resetar CCA selecionado ao abrir o modal
        setCcaSelecionadoId(prestadorData.ccaPrincipal.id);
      }
    }
  }, [prestadorData, aberto, form]);

  const { user } = useAuth();

  const onSubmit = async (data: FeriasFormData) => {
    if (!user || !prestadorData) {
      toast({
        title: "Erro",
        description: "Erro ao identificar usuário",
        variant: "destructive"
      });
      return;
    }

    try {
      // Buscar informações completas do responsável direto
      const { data: responsavelData, error: responsavelError } = await supabase
        .from('profiles')
        .select('nome')
        .eq('id', data.responsavelDireto)
        .single();

      if (responsavelError) {
        console.error('Erro ao buscar responsável:', responsavelError);
        toast({
          title: "Erro",
          description: "Erro ao buscar informações do responsável",
          variant: "destructive"
        });
        return;
      }

      // Buscar informações completas do usuário que está registrando
      const { data: registradorData, error: registradorError } = await supabase
        .from('profiles')
        .select('nome')
        .eq('id', user.id)
        .single();

      if (registradorError) {
        console.error('Erro ao buscar registrador:', registradorError);
        toast({
          title: "Erro",
          description: "Erro ao buscar informações do usuário",
          variant: "destructive"
        });
        return;
      }

      // Buscar CCA completo
      const ccaInfo = prestadorData.ccasPermitidas.find(c => c.id === ccaId);
      
      if (!ccaInfo) {
        toast({
          title: "Erro",
          description: "CCA não encontrado",
          variant: "destructive"
        });
        return;
      }

      // Montar objeto para inserção
      const feriasData = {
        prestador_pj_id: prestadorData.prestadorPjId,
        nomeprestador: data.nomeRepresentante,
        empresa: data.nomeEmpresa,
        funcaocargo: data.funcao,
        cca_id: ccaInfo.id,
        cca_codigo: ccaInfo.codigo,
        cca_nome: ccaInfo.nome,
        datainicioferias: format(data.dataInicioFerias, 'yyyy-MM-dd'),
        periodoaquisitivo: 'N/A',
        diasferias: data.diasFerias,
        responsavelregistro: registradorData.nome,
        responsavelregistro_id: user.id,
        responsaveldireto: responsavelData.nome,
        responsaveldireto_id: data.responsavelDireto,
        observacoes: data.observacoes || null,
        status: 'solicitado',
        ativo: true,
        created_by: user.id
      };

      const { error: insertError } = await supabase
        .from('prestadores_ferias')
        .insert(feriasData);

      if (insertError) {
        console.error('Erro ao salvar férias:', insertError);
        toast({
          title: "Erro",
          description: "Erro ao salvar solicitação de férias",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Solicitação de férias registrada com sucesso!"
      });
      form.reset();
      onFechar();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao salvar férias",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Solicitação de Férias</DialogTitle>
          <DialogDescription>
            Preencha o formulário para solicitar suas férias
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome da Empresa - Preenchido automaticamente */}
              <FormField
                control={form.control}
                name="nomeEmpresa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={!field.value ? "text-destructive" : ""}>
                      Nome da Empresa *
                    </FormLabel>
                    <FormControl>
                      <Input {...field} disabled className="bg-muted" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nome do Representante - Preenchido automaticamente */}
              <FormField
                control={form.control}
                name="nomeRepresentante"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={!field.value ? "text-destructive" : ""}>
                      Nome do Representante *
                    </FormLabel>
                    <FormControl>
                      <Input {...field} disabled className="bg-muted" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Função - Preenchida automaticamente */}
              <FormField
                control={form.control}
                name="funcao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={!field.value ? "text-destructive" : ""}>
                      Função *
                    </FormLabel>
                    <FormControl>
                      <Input {...field} disabled className="bg-muted" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CCA - Select se múltiplos CCAs, Input disabled se apenas 1 */}
              <FormField
                control={form.control}
                name="cca"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={!field.value ? "text-destructive" : ""}>
                      CCA *
                    </FormLabel>
                    <FormControl>
                      {temMultiplosCcas ? (
                        <Select
                          onValueChange={(value) => {
                            const ccaSelecionado = prestadorData?.ccasPermitidas.find(
                              (cca) => cca.id.toString() === value
                            );
                            if (ccaSelecionado) {
                              field.onChange(`${ccaSelecionado.codigo} - ${ccaSelecionado.nome}`);
                              setCcaSelecionadoId(ccaSelecionado.id);
                              // Limpar responsável direto ao mudar CCA
                              form.setValue('responsavelDireto', '');
                            }
                          }}
                          value={ccaSelecionadoId?.toString()}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o CCA" />
                          </SelectTrigger>
                          <SelectContent>
                            {prestadorData?.ccasPermitidas.map((cca) => (
                              <SelectItem key={cca.id} value={cca.id.toString()}>
                                {cca.codigo} - {cca.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input {...field} disabled className="bg-muted" />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Data de Início das Férias - Input manual + Calendar */}
              <FormField
                control={form.control}
                name="dataInicioFerias"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={!field.value ? "text-destructive" : ""}>
                      Data de Início das Férias *
                    </FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          type="date"
                          value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                          onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value + "T00:00:00") : null;
                            field.onChange(date);
                          }}
                          className="flex-1"
                        />
                      </FormControl>
                      
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="icon" type="button">
                            <CalendarIcon className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dias de Férias */}
              <FormField
                control={form.control}
                name="diasFerias"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={!field.value ? "text-destructive" : ""}>
                      Dias de Férias *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="1"
                        max="30"
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Responsável Direto - Select com hierarquia */}
              <FormField
                control={form.control}
                name="responsavelDireto"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className={!field.value ? "text-destructive" : ""}>
                      Responsável Direto *
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={loadingResponsaveis || responsaveisSuperiores.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o responsável direto" />
                        </SelectTrigger>
                        <SelectContent>
                          {responsaveisSuperiores.map((responsavel) => (
                            <SelectItem key={responsavel.id} value={responsavel.id}>
                              {responsavel.nome} - {responsavel.cargo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    {responsaveisSuperiores.length === 0 && !loadingResponsaveis && (
                      <p className="text-xs text-muted-foreground">
                        Nenhum responsável com cargo superior encontrado neste CCA
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Observações - Full width */}
            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      placeholder="Observações adicionais sobre as férias..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onFechar}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loadingPrestador}>
                Solicitar Férias
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
