
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
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

// Mock data
const responsaveisOptions = [
  { nome: "João Silva", funcao: "Gerente de Segurança" },
  { nome: "Maria Santos", funcao: "Engenheira de Segurança" },
  { nome: "Carlos Oliveira", funcao: "Supervisor de QSMS" },
  { nome: "Ana Pereira", funcao: "Técnica de Segurança" },
];

const situacaoOptions = ["Tratado", "Em tratativa"];

const PlanoAcaoForm = () => {
  const { control, watch, setValue } = useFormContext();
  
  const situacao = watch("situacao");
  const dataAdequacao = watch("dataAdequacao");
  const responsavelAcao = watch("responsavelAcao");
  
  // Calculate action status based on situation and date
  useEffect(() => {
    let status = "";
    
    if (situacao === "Tratado") {
      status = "Concluído";
    } else if (situacao === "Em tratativa") {
      if (dataAdequacao) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const adequacaoDate = new Date(dataAdequacao);
        
        if (adequacaoDate < today) {
          status = "Em andamento";
        } else {
          status = "Pendente";
        }
      }
    }
    
    setValue("status", status);
  }, [situacao, dataAdequacao, setValue]);

  // Handle responsável selection and auto-populate function
  const handleResponsavelChange = (value: string) => {
    setValue("responsavelAcao", value);
    
    const responsavel = responsaveisOptions.find(r => r.nome === value);
    if (responsavel) {
      setValue("funcaoResponsavel", responsavel.funcao);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tratativa aplicada */}
      <FormField
        control={control}
        name="tratativaAplicada"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tratativa aplicada</FormLabel>
            <FormControl>
              <Textarea 
                rows={5} 
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
      
      {/* Data para adequação */}
      <FormField
        control={control}
        name="dataAdequacao"
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
              <PopoverContent className="w-auto p-0" align="start">
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
      
      {/* Responsável pela ação e função */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="responsavelAcao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsável pela ação</FormLabel>
              <div className="flex space-x-2">
                <Select
                  onValueChange={handleResponsavelChange}
                  value={field.value && responsaveisOptions.some(r => r.nome === field.value) ? field.value : undefined}
                >
                  <FormControl>
                    <SelectTrigger className={!field.value ? "w-full" : "w-full"}>
                      <SelectValue placeholder="Selecione ou digite um responsável" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {responsaveisOptions.map((responsavel) => (
                      <SelectItem key={responsavel.nome} value={responsavel.nome}>
                        {responsavel.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {!field.value || !responsaveisOptions.some(r => r.nome === field.value) ? (
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
          name="funcaoResponsavel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Função</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  readOnly={responsavelAcao && responsaveisOptions.some(r => r.nome === responsavelAcao)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Situação */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="situacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Situação</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          name="status"
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
    </div>
  );
};

export default PlanoAcaoForm;
