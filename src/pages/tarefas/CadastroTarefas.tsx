import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { tarefasService, TarefaFormData } from "@/services/tarefasService";
import { supabase } from "@/integrations/supabase/client";

const tarefaSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  cca_id: z.number({ required_error: "CCA é obrigatório" }),
  data_conclusao: z.string().min(1, "Data de conclusão é obrigatória"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  responsavel_id: z.string().min(1, "Responsável é obrigatório"),
  configuracao: z.object({
    criticidade: z.enum(["baixa", "media", "alta", "critica"]),
    requerValidacao: z.boolean(),
    notificarUsuario: z.boolean(),
    recorrencia: z.object({
      ativa: z.boolean(),
      frequencia: z.enum(["diaria", "semanal", "mensal", "trimestral", "semestral", "anual"]).optional(),
    }).optional(),
  }),
});

type TarefaFormSchema = z.infer<typeof tarefaSchema>;

const CadastroTarefas = () => {
  const [ccas, setCcas] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TarefaFormSchema>({
    resolver: zodResolver(tarefaSchema),
    defaultValues: {
      configuracao: {
        criticidade: "media",
        requerValidacao: false,
        notificarUsuario: true,
        recorrencia: {
          ativa: false,
          frequencia: "mensal",
        },
      },
    },
  });

  const watchRecorrencia = watch("configuracao.recorrencia.ativa");

  // Função para transformar em letras maiúsculas e atualizar o valor do campo
  const handleUppercaseChange = (field: "titulo" | "descricao") => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const upperValue = event.target.value.toUpperCase();
    setValue(field, upperValue, { shouldValidate: true });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar CCAs ordenados por código
        const { data: ccasData, error: ccasError } = await supabase
          .from('ccas')
          .select('id, codigo, nome')
          .eq('ativo', true)
          .order('codigo', { ascending: true });

        if (ccasError) {
          console.error("Erro ao buscar CCAs:", ccasError);
        } else {
          setCcas(ccasData || []);
        }

        // Buscar usuários
        const { data: usuariosData, error: usuariosError } = await supabase
          .from('profiles')
          .select('id, nome')
          .order('nome', { ascending: true });

        if (usuariosError) {
          console.error("Erro ao buscar usuários:", usuariosError);
        } else {
          setUsuarios(usuariosData || []);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados do formulário");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: TarefaFormSchema) => {
    setLoading(true);
    try {
      console.log("Dados do formulário:", data);
      
      // Converter para o formato esperado pelo service
      const tarefaData: TarefaFormData = {
        cca_id: data.cca_id,
        data_conclusao: data.data_conclusao,
        descricao: data.descricao,
        responsavel_id: data.responsavel_id,
        configuracao: {
          criticidade: data.configuracao.criticidade,
          requerValidacao: data.configuracao.requerValidacao,
          notificarUsuario: data.configuracao.notificarUsuario,
          recorrencia: data.configuracao.recorrencia,
        },
      };
      
      const success = await tarefasService.create(tarefaData);
      
      if (success) {
        toast.success("Tarefa cadastrada com sucesso! O responsável foi notificado.");
        reset();
        navigate("/tarefas/dashboard");
      } else {
        toast.error("Erro ao cadastrar tarefa. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao cadastrar tarefa:", error);
      toast.error("Erro ao cadastrar tarefa. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center p-8">
          <p>Carregando formulário...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cadastro de Tarefas</h1>
        <p className="text-muted-foreground">
          Preencha as informações para criar uma nova tarefa
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Tarefa</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* TÍTULO */}
            <div className="space-y-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                placeholder="Digite o título da tarefa"
                {...register("titulo")}
                onChange={handleUppercaseChange("titulo")}
              />
              {errors.titulo && (
                <p className="text-sm text-red-500">{errors.titulo.message}</p>
              )}
            </div>

            {/* CCA (em uma linha própria) */}
            <div className="space-y-2">
              <Label htmlFor="cca_id">CCA *</Label>
              <Select onValueChange={(value) => setValue("cca_id", parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o CCA" />
                </SelectTrigger>
                <SelectContent>
                  {ccas.map((cca) => (
                    <SelectItem key={cca.id} value={cca.id.toString()}>
                      {cca.codigo} - {cca.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.cca_id && (
                <p className="text-sm text-red-500">{errors.cca_id.message}</p>
              )}
            </div>

            {/* Responsável e Data de Conclusão */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Responsável */}
              <div className="space-y-2">
                <Label htmlFor="responsavel_id">Responsável *</Label>
                <Select onValueChange={(value) => setValue("responsavel_id", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    {usuarios.map((usuario) => (
                      <SelectItem key={usuario.id} value={usuario.id}>
                        {usuario.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.responsavel_id && (
                  <p className="text-sm text-red-500">{errors.responsavel_id.message}</p>
                )}
              </div>

              {/* Data de Conclusão */}
              <div className="space-y-2">
                <Label htmlFor="data_conclusao">Data de Conclusão *</Label>
                <Input
                  id="data_conclusao"
                  type="datetime-local"
                  className="max-w-xs md:w-56"
                  {...register("data_conclusao")}
                />
                {errors.data_conclusao && (
                  <p className="text-sm text-red-500">{errors.data_conclusao.message}</p>
                )}
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                placeholder="Descreva a tarefa detalhadamente..."
                {...register("descricao")}
                onChange={handleUppercaseChange("descricao")}
              />
              {errors.descricao && (
                <p className="text-sm text-red-500">{errors.descricao.message}</p>
              )}
            </div>

            {/* Configurações */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Configurações</h3>
              
              {/* Criticidade */}
              <div className="space-y-2">
                <Label>Criticidade</Label>
                <RadioGroup
                  defaultValue="media"
                  onValueChange={(value) => setValue("configuracao.criticidade", value as any)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="baixa" id="baixa" />
                    <Label htmlFor="baixa">Baixa</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="media" id="media" />
                    <Label htmlFor="media">Média</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="alta" id="alta" />
                    <Label htmlFor="alta">Alta</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="critica" id="critica" />
                    <Label htmlFor="critica">Crítica</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Opções */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requerValidacao"
                    onCheckedChange={(checked) => setValue("configuracao.requerValidacao", !!checked)}
                  />
                  <Label htmlFor="requerValidacao">Requer validação</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notificarUsuario"
                    defaultChecked
                    onCheckedChange={(checked) => setValue("configuracao.notificarUsuario", !!checked)}
                  />
                  <Label htmlFor="notificarUsuario">Notificar usuário</Label>
                </div>
              </div>

              {/* Recorrência */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="recorrencia"
                    onCheckedChange={(checked) => setValue("configuracao.recorrencia.ativa", !!checked)}
                  />
                  <Label htmlFor="recorrencia">Tarefa recorrente</Label>
                </div>

                {watchRecorrencia && (
                  <div className="ml-6 space-y-2">
                    <Label htmlFor="frequencia">Frequência</Label>
                    <Select onValueChange={(value) => setValue("configuracao.recorrencia.frequencia", value as any)}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Selecione a frequência" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diaria">Diária</SelectItem>
                        <SelectItem value="semanal">Semanal</SelectItem>
                        <SelectItem value="mensal">Mensal</SelectItem>
                        <SelectItem value="trimestral">Trimestral</SelectItem>
                        <SelectItem value="semestral">Semestral</SelectItem>
                        <SelectItem value="anual">Anual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/tarefas/dashboard")}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar Tarefa"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CadastroTarefas;
