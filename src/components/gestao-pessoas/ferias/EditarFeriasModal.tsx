import { useState, useEffect } from "react";
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
import { ControleFérias } from "@/types/gestao-pessoas/ferias";

const editarFeriasSchema = z.object({
  nomePrestador: z.string().min(1, "Nome do prestador é obrigatório"),
  empresa: z.string().min(1, "Empresa é obrigatória"),
  funcaoCargo: z.string().min(1, "Função/cargo é obrigatória"),
  obraLocalAtuacao: z.string().min(1, "Obra/local é obrigatório"),
  dataInicioFerias: z.date({ required_error: "Data de início é obrigatória" }),
  periodoAquisitivo: z.string()
    .min(1, "Período aquisitivo é obrigatório")
    .regex(/^\d{4}\/\d{4}$/, "Formato deve ser AAAA/AAAA (ex: 2025/2026)"),
  diasFerias: z.number().min(1, "Dias de férias é obrigatório"),
  responsavelDireto: z.string().min(1, "Responsável direto é obrigatório"),
  observacoes: z.string().optional(),
});

type EditarFeriasFormData = z.infer<typeof editarFeriasSchema>;

interface EditarFeriasModalProps {
  aberto: boolean;
  ferias: ControleFérias;
  onFechar: () => void;
}

export function EditarFeriasModal({ aberto, ferias, onFechar }: EditarFeriasModalProps) {
  const [anexos, setAnexos] = useState<File[]>([]);
  const [anexosExistentes, setAnexosExistentes] = useState<string[]>(ferias.anexos || []);

  const form = useForm<EditarFeriasFormData>({
    resolver: zodResolver(editarFeriasSchema),
    defaultValues: {
      nomePrestador: ferias.nomePrestador,
      empresa: ferias.empresa,
      funcaoCargo: ferias.funcaoCargo,
      obraLocalAtuacao: ferias.obraLocalAtuacao,
      dataInicioFerias: new Date(ferias.dataInicioFerias),
      periodoAquisitivo: ferias.periodoAquisitivo,
      diasFerias: ferias.diasFerias,
      responsavelDireto: ferias.responsavelDireto,
      observacoes: ferias.observacoes || "",
    },
  });

  useEffect(() => {
    if (ferias.anexos) {
      setAnexosExistentes(ferias.anexos);
    }
  }, [ferias.anexos]);

  const onSubmit = (data: EditarFeriasFormData) => {
    console.log("Editando férias:", {
      id: ferias.id,
      ...data,
      anexosExistentes,
      novosAnexos: anexos.map(f => f.name),
    });

    toast({
      title: "Férias atualizadas",
      description: `As férias de ${data.nomePrestador} foram atualizadas com sucesso.`,
    });

    onFechar();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAnexos(prev => [...prev, ...files]);
  };

  const removeAnexo = (index: number) => {
    setAnexos(prev => prev.filter((_, i) => i !== index));
  };

  const removeAnexoExistente = (index: number) => {
    setAnexosExistentes(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Registro de Férias</DialogTitle>
          <DialogDescription>
            Edite as informações da solicitação de férias de {ferias.nomePrestador}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nomePrestador"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={!field.value ? "text-destructive" : ""}>
                      Nome do Prestador *
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="empresa"
                render={({ field }) => (
                  <FormItem>
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
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="funcaoCargo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={!field.value ? "text-destructive" : ""}>
                      Função / Cargo *
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="obraLocalAtuacao"
                render={({ field }) => (
                  <FormItem>
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
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataInicioFerias"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className={!field.value ? "text-destructive" : ""}>
                      Data de Início das Férias *
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
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
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="diasFerias"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={!field.value ? "text-destructive" : ""}>
                      Dias de Férias *
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="1" onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="periodoAquisitivo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={!field.value ? "text-destructive" : ""}>
                      Período Aquisitivo *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="2025/2026"
                        maxLength={9}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Formato: AAAA/AAAA (ex: 2025/2026)
                    </p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="responsavelDireto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={!field.value ? "text-destructive" : ""}>
                      Responsável Direto *
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o responsável" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="carlos-supervisor">Carlos Supervisor</SelectItem>
                          <SelectItem value="jose-coordenador">José Coordenador</SelectItem>
                          <SelectItem value="ana-gerente">Ana Gerente</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

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

            {/* Anexos existentes */}
            {anexosExistentes.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Anexos Existentes</label>
                <div className="space-y-2">
                  {anexosExistentes.map((anexo, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">{anexo}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAnexoExistente(index)}
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload de novos anexos */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Adicionar Novos Anexos</label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <div className="mt-2">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Clique para enviar ou arraste arquivos
                      </span>
                      <span className="text-xs text-gray-500">PDF até 10MB</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        accept=".pdf"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {anexos.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Novos arquivos:</p>
                  {anexos.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAnexo(index)}
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onFechar}>
                Cancelar
              </Button>
              <Button type="submit">
                Salvar Alterações
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}