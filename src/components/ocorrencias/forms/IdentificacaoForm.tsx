
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Mock data
const ccaOptions = ["CCA-001", "CCA-002", "CCA-003", "CCA-004"];
const empresaOptions = ["Empresa A", "Empresa B", "Empresa C", "Empresa D"];
const disciplinaOptions = ["Elétrica", "Mecânica", "Civil", "Instrumentação"];
const engenheirosOptions = ["Eng. João Silva", "Eng. Maria Santos", "Eng. Carlos Oliveira"];
const supervisoresOptions = ["Sup. Ana Souza", "Sup. Pedro Lima", "Sup. Fernanda Costa"];
const encarregadosOptions = ["Enc. Roberto Alves", "Enc. Julia Pereira", "Enc. Marcos Ribeiro"];
const colaboradoresOptions = [
  { nome: "José da Silva", funcao: "Eletricista", matricula: "12345" },
  { nome: "Paulo Souza", funcao: "Mecânico", matricula: "23456" },
  { nome: "Carla Oliveira", funcao: "Soldadora", matricula: "34567" },
  { nome: "Rafael Lima", funcao: "Montador", matricula: "45678" },
  { nome: "Mariana Costa", funcao: "Instrumentista", matricula: "56789" }
];

const tipoOcorrenciaOptions = ["Acidente com Afastamento", "Acidente sem Afastamento", "Quase Acidente"];
const tipoEventoOptions = ["Típico", "Trajeto", "Doença Ocupacional"];
const classificacaoOcorrenciaOptions = ["Leve", "Moderada", "Grave", "Fatal"];

const IdentificacaoForm = () => {
  const { control, setValue, watch } = useFormContext();
  
  // For collaborator management
  const [colaboradorIndex, setColaboradorIndex] = useState(0);
  const colaboradoresAcidentados = watch("colaboradoresAcidentados") || [];

  const addColaborador = () => {
    const updatedColaboradores = [...colaboradoresAcidentados, { 
      colaborador: "", 
      funcao: "", 
      matricula: "" 
    }];
    setValue("colaboradoresAcidentados", updatedColaboradores);
    setColaboradorIndex(updatedColaboradores.length - 1);
  };

  const removeColaborador = (index: number) => {
    const updatedColaboradores = [...colaboradoresAcidentados];
    updatedColaboradores.splice(index, 1);
    setValue("colaboradoresAcidentados", updatedColaboradores);
    
    if (colaboradorIndex >= updatedColaboradores.length) {
      setColaboradorIndex(Math.max(0, updatedColaboradores.length - 1));
    }
  };

  // Handle date selection and auto-populate month and year
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setValue("data", date);
      setValue("mes", format(date, "MMMM")); // Month name
      setValue("ano", format(date, "yyyy")); // Year
    }
  };

  // Handle colaborador selection and auto-populate function and registration
  const handleColaboradorChange = (value: string, index: number) => {
    const colaborador = colaboradoresOptions.find(c => c.nome === value);
    
    const updatedColaboradores = [...colaboradoresAcidentados];
    updatedColaboradores[index] = {
      colaborador: value,
      funcao: colaborador ? colaborador.funcao : "",
      matricula: colaborador ? colaborador.matricula : ""
    };
    
    setValue("colaboradoresAcidentados", updatedColaboradores);
  };

  return (
    <div className="space-y-6">
      {/* First row: Date, Time, Month, Year */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FormField
          control={control}
          name="data"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data</FormLabel>
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
                    onSelect={(date) => handleDateChange(date)}
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
          name="hora"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hora</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="mes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mês</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="ano"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ano</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Second row: CCA, Empresa, Disciplina */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="cca"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CCA</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o CCA" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ccaOptions.map((cca) => (
                    <SelectItem key={cca} value={cca}>{cca}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="empresa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Empresa</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a empresa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {empresaOptions.map((empresa) => (
                    <SelectItem key={empresa} value={empresa}>{empresa}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="disciplina"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Disciplina</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a disciplina" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {disciplinaOptions.map((disciplina) => (
                    <SelectItem key={disciplina} value={disciplina}>{disciplina}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Third row: Responsible engineers/supervisors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="engenheiroResponsavel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Engenheiro responsável</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o engenheiro" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {engenheirosOptions.map((engenheiro) => (
                    <SelectItem key={engenheiro} value={engenheiro}>{engenheiro}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="supervisorResponsavel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supervisor responsável</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o supervisor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {supervisoresOptions.map((supervisor) => (
                    <SelectItem key={supervisor} value={supervisor}>{supervisor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="encarregadoResponsavel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Encarregado responsável</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o encarregado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {encarregadosOptions.map((encarregado) => (
                    <SelectItem key={encarregado} value={encarregado}>{encarregado}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Colaborador acidentado section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Colaboradores acidentados</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addColaborador}
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar colaborador
          </Button>
        </div>
        
        {colaboradoresAcidentados.length === 0 ? (
          <div className="text-center p-4 border rounded-md">
            <p className="text-muted-foreground">Adicione pelo menos um colaborador acidentado</p>
          </div>
        ) : (
          colaboradoresAcidentados.map((_, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 p-4 border rounded-md mb-4 items-start">
              <div className="col-span-12 sm:col-span-5">
                <FormField
                  control={control}
                  name={`colaboradoresAcidentados.${index}.colaborador`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Colaborador acidentado</FormLabel>
                      <Select
                        onValueChange={(value) => handleColaboradorChange(value, index)}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o colaborador" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {colaboradoresOptions.map((colaborador) => (
                            <SelectItem key={colaborador.nome} value={colaborador.nome}>
                              {colaborador.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="col-span-12 sm:col-span-3">
                <FormField
                  control={control}
                  name={`colaboradoresAcidentados.${index}.funcao`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Função</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="col-span-10 sm:col-span-3">
                <FormField
                  control={control}
                  name={`colaboradoresAcidentados.${index}.matricula`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matrícula</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="col-span-2 sm:col-span-1 flex justify-end pt-8">
                {colaboradoresAcidentados.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeColaborador(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Last row: Event classification */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="tipoOcorrencia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo da ocorrência</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tipoOcorrenciaOptions.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="tipoEvento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo do evento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tipoEventoOptions.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="classificacaoOcorrencia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Classificação da ocorrência</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a classificação" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {classificacaoOcorrenciaOptions.map((classificacao) => (
                    <SelectItem key={classificacao} value={classificacao}>{classificacao}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default IdentificacaoForm;
