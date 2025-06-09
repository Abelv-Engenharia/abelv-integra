
import React, { useState, useEffect } from "react";
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
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { ccaService } from "@/services/admin/ccaService";
import { fetchUsers } from "@/services/usuariosService";
import { tarefasService } from "@/services/tarefasService";

// Esquema de validação atualizado - removido tipoCca
const formSchema = z.object({
  cca_id: z.number().min(1, "Selecione um CCA"),
  dataConclusao: z.date(),
  descricao: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  responsavelId: z.string().min(1, "Selecione um responsável"),
  // Configurações
  criticidade: z.enum(["baixa", "media", "alta", "critica"]),
  requerValidacao: z.boolean().default(false),
  notificarUsuario: z.boolean().default(true),
  recorrenciaAtiva: z.boolean().default(false),
  frequenciaRecorrencia: z.enum(["diaria", "semanal", "mensal", "trimestral", "semestral", "anual"]).optional()
});

type FormValues = z.infer<typeof formSchema>;

const CadastroTarefas = () => {
  const [ccas, setCcas] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataConclusao: new Date(),
      criticidade: "media",
      requerValidacao: false,
      notificarUsuario: true,
      recorrenciaAtiva: false
    }
  });
  
  const recorrenciaAtiva = form.watch("recorrenciaAtiva");
  const dataAtual = new Date();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Carregar CCAs
        const ccasData = await ccaService.getAll();
        setCcas(ccasData.filter(cca => cca.ativo));

        // Carregar usuários
        const usuariosData = await fetchUsers();
        setUsuarios(usuariosData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar as opções do formulário.",
          variant: "destructive",
        });
      }
    };

    loadData();
  }, []);
  
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const dadosCompletos = {
        cca_id: values.cca_id,
        data_conclusao: values.dataConclusao.toISOString(),
        descricao: values.descricao,
        responsavel_id: values.responsavelId,
        configuracao: {
          criticidade: values.criticidade,
          requerValidacao: values.requerValidacao,
          notificarUsuario: values.notificarUsuario,
          recorrencia: {
            ativa: values.recorrenciaAtiva,
            frequencia: values.frequenciaRecorrencia
          }
        }
      };

      console.log("Salvando tarefa:", dadosCompletos);

      const sucesso = await tarefasService.create(dadosCompletos);

      if (sucesso) {
        toast({
          title: "Tarefa cadastrada com sucesso!",
          description: "A tarefa foi registrada no sistema."
        });

        // Reset do formulário
        form.reset({
          cca_id: undefined,
          dataConclusao: new Date(),
          descricao: "",
          responsavelId: "",
          criticidade: "media",
          requerValidacao: false,
          notificarUsuario: true,
          recorrenciaAtiva: false
        });
      } else {
        throw new Error("Falha ao salvar tarefa");
      }
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
      toast({
        title: "Erro ao salvar tarefa",
        description: "Não foi possível registrar a tarefa. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
                    {/* Campo CCA conectado ao Supabase */}
                    <FormField 
                      control={form.control}
                      name="cca_id"
                      render={({ field }) => (
                        <FormItem className="col-span-1 md:col-span-2">
                          <FormLabel>CCA</FormLabel>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um CCA" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ccas.map((cca) => (
                                <SelectItem key={cca.id} value={cca.id.toString()}>
                                  {cca.codigo} - {cca.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Data do Cadastro (não editável) e Data para Conclusão */}
                    <FormItem className="col-span-1 md:col-span-2">
                      <FormLabel>Data do Cadastro</FormLabel>
                      <FormControl>
                        <Input 
                          type="text" 
                          value={format(dataAtual, "dd/MM/yyyy", { locale: ptBR })} 
                          disabled 
                          className="bg-gray-50"
                        />
                      </FormControl>
                      <FormDescription>
                        Data gerada automaticamente
                      </FormDescription>
                    </FormItem>
                      
                    <FormField
                      control={form.control}
                      name="dataConclusao"
                      render={({ field }) => (
                        <FormItem className="col-span-1 md:col-span-2">
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
                    
                    {/* Responsável conectado aos usuários do Supabase */}
                    <FormField 
                      control={form.control} 
                      name="responsavelId" 
                      render={({ field }) => (
                        <FormItem className="col-span-1 md:col-span-2">
                          <FormLabel>Responsável</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um responsável" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {usuarios.map(usuario => (
                                <SelectItem key={usuario.id} value={usuario.id}>
                                  {usuario.nome} - {usuario.perfil}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Status da tarefa - Agora é apenas informativo */}
                    <FormItem className="col-span-1 md:col-span-2">
                      <FormLabel>Status da Tarefa</FormLabel>
                      <FormControl>
                        <Input type="text" value="Programada" disabled className="bg-gray-50" />
                      </FormControl>
                      <FormDescription>
                        Status definido automaticamente como "Programada" no cadastro
                      </FormDescription>
                    </FormItem>
                    
                    {/* Descrição da Tarefa */}
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
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
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
                            <Select onValueChange={field.onChange} value={field.value}>
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
                            <RadioGroup value={field.value} onValueChange={field.onChange} className="grid grid-cols-2 gap-3">
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
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
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
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Tarefa"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CadastroTarefas;
