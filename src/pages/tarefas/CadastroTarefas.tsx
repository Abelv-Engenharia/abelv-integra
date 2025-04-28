
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarIcon, FileUp, Calendar as CalendarIcon2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockUsuarios } from "@/utils/tarefasUtils";
import StatusTarefaSelector from "@/components/tarefas/StatusTarefaSelector";
import { toast } from "@/hooks/use-toast";

// Esquema de validação
const formSchema = z.object({
  cca: z.string().min(1, "Campo obrigatório"),
  dataCadastro: z.date(),
  dataConclusao: z.date(),
  descricao: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  responsavelId: z.string().min(1, "Selecione um responsável"),
  status: z.enum(["programada", "concluida", "em-andamento", "pendente"]),
  iniciada: z.boolean().default(false),
  
  // Configurações
  criticidade: z.enum(["baixa", "media", "alta", "critica"]),
  requerValidacao: z.boolean().default(false),
  notificarUsuario: z.boolean().default(true),
  recorrenciaAtiva: z.boolean().default(false),
  frequenciaRecorrencia: z.enum(["diaria", "semanal", "mensal", "trimestral", "semestral", "anual"]).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CadastroTarefas = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataCadastro: new Date(),
      dataConclusao: new Date(),
      status: "programada",
      iniciada: false,
      criticidade: "media",
      requerValidacao: false,
      notificarUsuario: true,
      recorrenciaAtiva: false,
    },
  });
  
  const recorrenciaAtiva = form.watch("recorrenciaAtiva");
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
      } else {
        toast({
          title: "Formato inválido",
          description: "Por favor, selecione apenas arquivos PDF",
          variant: "destructive",
        });
      }
    }
  };
  
  const onSubmit = (values: FormValues) => {
    console.log("Form values:", values);
    console.log("Selected file:", selectedFile);
    
    // Simulação de envio para API
    setTimeout(() => {
      toast({
        title: "Tarefa cadastrada com sucesso!",
        description: "A tarefa foi registrada no sistema.",
      });
      
      // Reset do formulário
      form.reset({
        cca: "",
        dataCadastro: new Date(),
        dataConclusao: new Date(),
        descricao: "",
        responsavelId: "",
        status: "programada",
        iniciada: false,
        criticidade: "media",
        requerValidacao: false,
        notificarUsuario: true,
        recorrenciaAtiva: false,
      });
      setSelectedFile(null);
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Cadastro de Tarefas</h1>
        <p className="text-muted-foreground">
          Registre novas tarefas e defina suas configurações
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="detalhes">
            <TabsList className="mb-4">
              <TabsTrigger value="detalhes">Detalhes da Tarefa</TabsTrigger>
              <TabsTrigger value="config">Configurações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="detalhes">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="cca"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código CCA</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: 2025-0001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dataCadastro"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Data do Cadastro</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "dd/MM/yyyy", { locale: ptBR })
                                  ) : (
                                    <span>Selecione uma data</span>
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
                      name="dataConclusao"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Data para Conclusão</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "dd/MM/yyyy", { locale: ptBR })
                                  ) : (
                                    <span>Selecione uma data</span>
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
                                fromDate={new Date()}
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
                      name="responsavelId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Responsável</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um responsável" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockUsuarios.map((usuario) => (
                                <SelectItem key={usuario.id} value={usuario.id}>
                                  {usuario.nome} - {usuario.cargo}
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
                      name="status"
                      render={({ field }) => (
                        <FormItem className="col-span-1 md:col-span-2">
                          <FormLabel>Status da Tarefa</FormLabel>
                          <FormControl>
                            <StatusTarefaSelector value={field.value} onChange={field.onChange} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="iniciada"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Iniciar Execução</FormLabel>
                            <FormDescription>
                              Marque esta opção para indicar que a tarefa já começou a ser executada.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="col-span-1 md:col-span-2">
                      <FormItem className="border rounded-md p-4">
                        <FormLabel>Anexo (PDF)</FormLabel>
                        <div className="mt-2">
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                              <FileUp className="h-8 w-8 text-muted-foreground mb-2" />
                              <span className="text-sm text-muted-foreground">
                                {selectedFile ? selectedFile.name : "Clique para selecionar um arquivo PDF"}
                              </span>
                            </div>
                            <input
                              id="file-upload"
                              type="file"
                              className="hidden"
                              accept=".pdf"
                              onChange={handleFileChange}
                            />
                          </label>
                        </div>
                      </FormItem>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="descricao"
                      render={({ field }) => (
                        <FormItem className="col-span-1 md:col-span-2">
                          <FormLabel>Descrição da Tarefa</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva detalhadamente a tarefa a ser realizada"
                              className="resize-none h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="config">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="recorrenciaAtiva"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Recorrência</FormLabel>
                            <FormDescription>
                              Ative para configurar a tarefa como recorrente.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {recorrenciaAtiva && (
                      <FormField
                        control={form.control}
                        name="frequenciaRecorrencia"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Frequência da Recorrência</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a frequência" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="diaria">Diária</SelectItem>
                                <SelectItem value="semanal">Semanal</SelectItem>
                                <SelectItem value="mensal">Mensal</SelectItem>
                                <SelectItem value="trimestral">Trimestral</SelectItem>
                                <SelectItem value="semestral">Semestral</SelectItem>
                                <SelectItem value="anual">Anual</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <FormField
                      control={form.control}
                      name="criticidade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Criticidade da Tarefa</FormLabel>
                          <FormControl>
                            <RadioGroup 
                              value={field.value} 
                              onValueChange={field.onChange}
                              className="grid grid-cols-2 gap-3"
                            >
                              <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 transition-colors">
                                <RadioGroupItem value="baixa" id="baixa" />
                                <label htmlFor="baixa" className="flex flex-1 cursor-pointer">Baixa</label>
                              </div>
                              <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 transition-colors">
                                <RadioGroupItem value="media" id="media" />
                                <label htmlFor="media" className="flex flex-1 cursor-pointer">Média</label>
                              </div>
                              <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 transition-colors">
                                <RadioGroupItem value="alta" id="alta" />
                                <label htmlFor="alta" className="flex flex-1 cursor-pointer">Alta</label>
                              </div>
                              <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 transition-colors">
                                <RadioGroupItem value="critica" id="critica" />
                                <label htmlFor="critica" className="flex flex-1 cursor-pointer">Crítica</label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormDescription>
                            A criticidade define a prioridade e importância da tarefa.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="requerValidacao"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Validação para Conclusão</FormLabel>
                            <FormDescription>
                              Quando ativada, a tarefa requererá validação de um supervisor para ser marcada como concluída.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="notificarUsuario"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Notificar Usuário</FormLabel>
                            <FormDescription>
                              Envia notificações para o responsável sobre prazos e atualizações da tarefa.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Tarefa
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CadastroTarefas;
