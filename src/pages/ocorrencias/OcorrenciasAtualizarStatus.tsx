
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Upload, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getOcorrenciaById, updateOcorrencia } from "@/services/ocorrencias/ocorrenciasService";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const situacaoOptions = ["PLANEJADO", "EM ANDAMENTO", "CONCLUÍDO", "PENDENTE"];

const OcorrenciasAtualizarStatus = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [ocorrencia, setOcorrencia] = useState<any>(null);

  const { register, control, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      acoes: [],
      arquivo_rais: null,
      licoes_aprendidas_enviada: "",
      arquivo_licoes_aprendidas: null
    }
  });

  const { fields: acoesFields } = useFieldArray({
    control,
    name: "acoes"
  });

  const acoes = watch("acoes") || [];

  useEffect(() => {
    const loadOcorrencia = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getOcorrenciaById(id);
        setOcorrencia(data);
        
        // Convert acoes from database format
        const convertedAcoes = Array.isArray(data.acoes) 
          ? data.acoes.map((acao: any) => ({
              ...acao,
              data_adequacao: acao.data_adequacao ? new Date(acao.data_adequacao) : null
            }))
          : [];

        reset({
          acoes: convertedAcoes,
          arquivo_rais: data.arquivo_rais || null,
          licoes_aprendidas_enviada: data.licoes_aprendidas_enviada || "",
          arquivo_licoes_aprendidas: data.arquivo_licoes_aprendidas || null
        });
      } catch (error) {
        console.error('Erro ao carregar ocorrência:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar dados da ocorrência",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadOcorrencia();
  }, [id, reset, toast]);

  // Calculate action status
  useEffect(() => {
    if (acoes.length) {
      acoes.forEach((acao, index) => {
        let status = "";
        
        if (acao.situacao === "CONCLUÍDO") {
          status = "CONCLUÍDO";
        } else if (acao.situacao === "PLANEJADO" || acao.situacao === "EM ANDAMENTO") {
          if (acao.data_adequacao) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const adequacaoDate = new Date(acao.data_adequacao);
            adequacaoDate.setHours(0, 0, 0, 0);
            
            if (adequacaoDate < today) {
              status = "PENDENTE";
            } else {
              status = acao.situacao;
            }
          } else {
            status = "PENDENTE";
          }
        } else if (acao.situacao === "PENDENTE") {
          status = "PENDENTE";
        }
        
        if (status && acao.status !== status) {
          setValue(`acoes.${index}.status`, status);
        }
      });
    }
  }, [acoes, setValue]);

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "PLANEJADO":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "EM ANDAMENTO":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "CONCLUÍDO":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDENTE":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "";
    }
  };

  const onSubmit = async (data: any) => {
    try {
      await updateOcorrencia(id!, data);
      toast({
        title: "Sucesso",
        description: "Status das ações atualizado com sucesso",
      });
      navigate('/ocorrencias/consulta');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status das ações",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!ocorrencia) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Ocorrência não encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/ocorrencias/consulta')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Atualizar Status das Ações</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Ações */}
        <Card>
          <CardHeader>
            <CardTitle>Plano de Ação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {acoesFields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Ação #{index + 1}</h4>
                    {acoes[index]?.status && (
                      <Badge className={getStatusBadgeClasses(acoes[index].status)}>
                        {acoes[index].status}
                      </Badge>
                    )}
                  </div>
                  
                  <div>
                    <Label>Tratativa aplicada</Label>
                    <Textarea 
                      {...register(`acoes.${index}.tratativa_aplicada`)}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Responsável pela ação</Label>
                      <Input 
                        {...register(`acoes.${index}.responsavel_acao`)}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <Label>Função</Label>
                      <Input 
                        {...register(`acoes.${index}.funcao_responsavel`)}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Situação</Label>
                      <Select 
                        onValueChange={(value) => setValue(`acoes.${index}.situacao`, value)}
                        value={acoes[index]?.situacao || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a situação" />
                        </SelectTrigger>
                        <SelectContent>
                          {situacaoOptions.map((opcao) => (
                            <SelectItem key={opcao} value={opcao}>{opcao}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Data para adequação</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !acoes[index]?.data_adequacao && "text-muted-foreground"
                            )}
                          >
                            {acoes[index]?.data_adequacao ? (
                              format(acoes[index].data_adequacao, "dd/MM/yyyy")
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={acoes[index]?.data_adequacao || undefined}
                            onSelect={(date) => setValue(`acoes.${index}.data_adequacao`, date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Anexos */}
        <Card>
          <CardHeader>
            <CardTitle>Anexos e Documentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="arquivo_rais">Anexo RAIS</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id="arquivo_rais"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                />
                <Button type="button" variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-1" />
                  Upload
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="licoes_aprendidas_enviada">Status das Lições Aprendidas</Label>
              <Select 
                onValueChange={(value) => setValue('licoes_aprendidas_enviada', value)}
                value={watch('licoes_aprendidas_enviada') || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SIM">Enviada</SelectItem>
                  <SelectItem value="NÃO">Não enviada</SelectItem>
                  <SelectItem value="EM ELABORAÇÃO">Em elaboração</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="arquivo_licoes_aprendidas">Anexo Lições Aprendidas</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id="arquivo_licoes_aprendidas"
                  type="file"
                  accept=".pdf,.doc,.docx"
                />
                <Button type="button" variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-1" />
                  Upload
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/ocorrencias/consulta')}
          >
            Cancelar
          </Button>
          <Button type="submit">
            Salvar Alterações
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OcorrenciasAtualizarStatus;
