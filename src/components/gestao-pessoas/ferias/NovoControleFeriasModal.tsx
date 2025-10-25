import { useEffect } from "react";
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
  const ccaId = prestadorData?.ccaPrincipal?.id;
  const { data: responsaveisSuperiores = [], isLoading: loadingResponsaveis } = useResponsaveisSuperiores(ccaId);

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
        form.setValue('cca', `${prestadorData.ccaPrincipal.codigo} - ${prestadorData.ccaPrincipal.nome}`);
      }
    }
  }, [prestadorData, aberto, form]);

  const onSubmit = (data: FeriasFormData) => {
    console.log("Dados das férias:", data);
    toast({
      title: "Férias solicitadas",
      description: `Solicitação de férias para ${data.nomeRepresentante} foi registrada com sucesso.`
    });
    form.reset();
    onFechar();
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

              {/* CCA - Preenchido automaticamente */}
              <FormField
                control={form.control}
                name="cca"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={!field.value ? "text-destructive" : ""}>
                      CCA *
                    </FormLabel>
                    <FormControl>
                      <Input {...field} disabled className="bg-muted" />
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
