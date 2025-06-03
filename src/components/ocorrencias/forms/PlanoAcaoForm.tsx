
import React, { useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOcorrenciasFormData } from "@/hooks/useOcorrenciasFormData";

const situacaoOptions = ["Tratado", "Em tratativa"];

const PlanoAcaoForm = () => {
  const { control, watch, setValue } = useFormContext();
  const watchedCca = watch("cca");
  
  const { funcionarios } = useOcorrenciasFormData({ selectedCcaId: watchedCca });
  
  const acoesField = useFieldArray({
    control,
    name: "acoes"
  });
  
  // Initialize with at least one action if none exists
  useEffect(() => {
    if (!acoesField.fields.length) {
      acoesField.append({
        tratativaAplicada: "",
        dataAdequacao: null,
        responsavelAcao: "",
        funcaoResponsavel: "",
        situacao: "",
        status: ""
      });
    }
  }, [acoesField]);
  
  // Calculate action status based on situation and date for each action
  const acoes = watch("acoes") || [];
  
  useEffect(() => {
    if (acoes.length) {
      acoes.forEach((acao, index) => {
        let status = "";
        
        console.log(`Processing action ${index}:`, acao);
        
        if (acao.situacao === "Tratado") {
          status = "Concluído";
        } else if (acao.situacao === "Em tratativa") {
          if (acao.dataAdequacao) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const adequacaoDate = new Date(acao.dataAdequacao);
            adequacaoDate.setHours(0, 0, 0, 0);
            
            console.log(`Comparing dates - Today: ${today.toDateString()}, Adequacao: ${adequacaoDate.toDateString()}`);
            
            if (today > adequacaoDate) {
              status = "Em atraso";
            } else {
              status = "Em andamento";
            }
          } else {
            status = "Pendente";
          }
        }
        
        console.log(`Calculated status for action ${index}: ${status}`);
        
        if (status && acao.status !== status) {
          console.log(`Updating status from ${acao.status} to ${status}`);
          setValue(`acoes.${index}.status`, status);
        }
      });
    }
  }, [acoes, setValue]);

  // Handle responsável selection and auto-populate function
  const handleResponsavelChange = (value: string, index: number) => {
    setValue(`acoes.${index}.responsavelAcao`, value);
    
    const funcionario = funcionarios.find(f => f.nome === value);
    if (funcionario) {
      setValue(`acoes.${index}.funcaoResponsavel`, funcionario.funcao);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-lg">Ações</h3>
        <Button
          type="button"
          onClick={() => acoesField.append({
            tratativaAplicada: "",
            dataAdequacao: null,
            responsavelAcao: "",
            funcaoResponsavel: "",
            situacao: "",
            status: ""
          })}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          Adicionar ação
        </Button>
      </div>
      
      {acoesField.fields.map((field, index) => (
        <Card key={field.id} className="mb-4">
          <CardHeader className="flex flex-row items-center justify-between py-3">
            <CardTitle className="text-md">
              Ação #{index + 1}
            </CardTitle>
            {acoesField.fields.length > 1 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => acoesField.remove(index)}
                className="h-8 w-8 p-0"
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Tratativa aplicada */}
            <FormField
              control={control}
              name={`acoes.${index}.tratativaAplicada`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tratativa aplicada</FormLabel>
                  <FormControl>
                    <Textarea 
                      rows={3} 
                      placeholder="Descreva a tratativa aplicada à ocorrência" 
                      className="resize-none"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Responsável pela ação e função */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`acoes.${index}.responsavelAcao`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável pela ação</FormLabel>
                    <div className="flex space-x-2">
                      <Select
                        onValueChange={(value) => handleResponsavelChange(value, index)}
                        value={field.value && funcionarios.some(f => f.nome === field.value) ? field.value : undefined}
                        disabled={!watchedCca}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={!watchedCca ? "Selecione um CCA primeiro" : "Selecione ou digite um responsável"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {funcionarios.map((funcionario) => (
                            <SelectItem key={funcionario.id} value={funcionario.nome}>
                              {funcionario.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {!field.value || !funcionarios.some(f => f.nome === field.value) ? (
                      <div className="mt-2">
                        <Input
                          placeholder="Ou digite um responsável manualmente"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </div>
                    ) : null}
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={control}
                name={`acoes.${index}.funcaoResponsavel`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Função</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly={acoes[index]?.responsavelAcao && funcionarios.some(f => f.nome === acoes[index]?.responsavelAcao)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Situação, Data para adequação e Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={control}
                name={`acoes.${index}.situacao`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Situação</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a situação" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {situacaoOptions.map((opcao) => (
                          <SelectItem key={opcao} value={opcao}>{opcao}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={control}
                name={`acoes.${index}.dataAdequacao`}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data para adequação</FormLabel>
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
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <svg
                              className="ml-auto h-4 w-4 opacity-50"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-50" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={control}
                name={`acoes.${index}.status`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status da ação</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly className="bg-gray-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PlanoAcaoForm;
