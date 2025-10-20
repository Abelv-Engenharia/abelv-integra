import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon, Upload } from "lucide-react";
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
const feriasSchema = z.object({
  nomePrestador: z.string().min(1, "Nome do prestador é obrigatório"),
  empresa: z.string().min(1, "Empresa é obrigatória"),
  funcaoCargo: z.string().min(1, "Função/cargo é obrigatória"),
  obraLocalAtuacao: z.string().min(1, "Obra/local é obrigatório"),
  dataInicioFerias: z.date({
    required_error: "Data de início é obrigatória"
  }),
  diasFerias: z.number().min(1, "Dias de férias é obrigatório"),
  periodoAquisitivo: z.string().min(1, "Período aquisitivo é obrigatório").regex(/^\d{4}\/\d{4}$/, "Formato deve ser AAAA/AAAA (ex: 2025/2026)"),
  responsavelDireto: z.string().min(1, "Responsável direto é obrigatório"),
  substituto: z.string().min(1, "Substituto é obrigatório"),
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
  const [anexos, setAnexos] = useState<File[]>([]);
  const form = useForm<FeriasFormData>({
    resolver: zodResolver(feriasSchema),
    defaultValues: {
      nomePrestador: "",
      empresa: "",
      funcaoCargo: "",
      obraLocalAtuacao: "",
      diasFerias: 0,
      periodoAquisitivo: "",
      responsavelDireto: "",
      substituto: "",
      observacoes: ""
    }
  });
  const onSubmit = (data: FeriasFormData) => {
    console.log("Dados das férias:", {
      ...data,
      anexos: anexos.map(f => f.name)
    });
    toast({
      title: "Férias registradas",
      description: `Solicitação de férias para ${data.nomePrestador} foi registrada com sucesso.`
    });
    form.reset();
    setAnexos([]);
    onFechar();
  };
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAnexos(prev => [...prev, ...files]);
  };
  const removeAnexo = (index: number) => {
    setAnexos(prev => prev.filter((_, i) => i !== index));
  };
  return <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Registro de Férias</DialogTitle>
          <DialogDescription>
            Registre uma nova solicitação de férias para prestador de serviços
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="nomePrestador" render={({
              field
            }) => <FormItem>
                    <FormLabel className={!field.value ? "text-destructive" : ""}>
                      Nome do Prestador *
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              <FormField control={form.control} name="empresa" render={({
              field
            }) => <FormItem>
                    <FormLabel className={!field.value ? "text-destructive" : ""}>
                      Empresa *
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a empresa" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="empresa-abc">Empresa ABC</SelectItem>
                          <SelectItem value="empresa-xyz">Empresa XYZ</SelectItem>
                          <SelectItem value="empresa-123">Empresa 123</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              <FormField control={form.control} name="funcaoCargo" render={({
              field
            }) => <FormItem>
                    <FormLabel className={!field.value ? "text-destructive" : ""}>
                      Função / Cargo *
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              <FormField control={form.control} name="obraLocalAtuacao" render={({
              field
            }) => <FormItem>
                    <FormLabel className={!field.value ? "text-destructive" : ""}>
                      Obra / Local de Atuação *
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a obra/local" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="obra-norte">Obra Norte</SelectItem>
                          <SelectItem value="obra-sul">Obra Sul</SelectItem>
                          <SelectItem value="obra-leste">Obra Leste</SelectItem>
                          <SelectItem value="obra-oeste">Obra Oeste</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              <FormField control={form.control} name="dataInicioFerias" render={({
              field
            }) => <FormItem className="flex flex-col">
                    <FormLabel className={!field.value ? "text-destructive" : ""}>
                      Data de Início das Férias *
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "PPP", {
                        locale: ptBR
                      }) : <span>Selecione a data</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={date => date < new Date()} initialFocus className="pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>} />

              <FormField control={form.control} name="diasFerias" render={({
              field
            }) => <FormItem>
                    <FormLabel className={!field.value ? "text-destructive" : ""}>
                      Dias de Férias *
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="1" max="30" onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              <FormField control={form.control} name="periodoAquisitivo" render={({
              field
            }) => <FormItem>
                    <FormLabel className={!field.value ? "text-destructive" : ""}>
                      Período Aquisitivo *
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="2025/2026" maxLength={9} />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Formato: AAAA/AAAA (ex: 2025/2026)
                    </p>
                  </FormItem>} />

              <FormField control={form.control} name="responsavelDireto" render={({
              field
            }) => <FormItem>
                    <FormLabel className={!field.value ? "text-destructive" : ""}>
                      Responsável Direto *
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome do responsável direto" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              <FormField control={form.control} name="substituto" render={({
              field
            }) => <FormItem>
                    <FormLabel>Substituto</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome do substituto durante as férias" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
            </div>

            <FormField control={form.control} name="observacoes" render={({
            field
          }) => <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} placeholder="Observações adicionais sobre as férias..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />

            {/* Upload de anexos */}
            

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onFechar}>
                Cancelar
              </Button>
              <Button type="submit">
                Registrar Férias
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>;
}