
import React from "react";
import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useOcorrenciasFormData } from "@/hooks/useOcorrenciasFormData";

// Mock data for fields not yet linked to database
const tipoOcorrenciaOptions = ["Acidente com Afastamento", "Acidente sem Afastamento", "Incidente", "Quase Acidente"];
const tipoEventoOptions = ["Trabalho em altura", "Trabalho elétrico", "Operação de máquinas", "Movimentação de materiais", "Outro"];
const classificacaoOcorrenciaOptions = ["Leve", "Moderado", "Grave", "Gravíssimo"];

const IdentificacaoForm = () => {
  const { control, watch, setValue } = useFormContext();
  const { ccas, empresas, disciplinas, engenheiros, supervisores, encarregados, funcionarios } = useOcorrenciasFormData();

  // Auto-popular ano e mês quando a data for selecionada
  const watchData = watch("data");
  React.useEffect(() => {
    if (watchData) {
      const date = new Date(watchData);
      setValue("ano", date.getFullYear().toString());
      setValue("mes", (date.getMonth() + 1).toString().padStart(2, '0'));
    }
  }, [watchData, setValue]);

  // Auto-popular função e matrícula quando colaborador for selecionado
  const watchColaborador = watch("colaboradoresAcidentados.0.colaborador");
  React.useEffect(() => {
    if (watchColaborador) {
      const funcionario = funcionarios.find(f => f.id === watchColaborador);
      if (funcionario) {
        setValue("colaboradoresAcidentados.0.funcao", funcionario.funcao);
        setValue("colaboradoresAcidentados.0.matricula", funcionario.matricula);
      }
    }
  }, [watchColaborador, funcionarios, setValue]);

  return (
    <div className="space-y-6">
      {/* Data, Hora, Mês, Ano */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FormField
          control={control}
          name="data"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data da ocorrência *</FormLabel>
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
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
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
              <FormLabel>Hora *</FormLabel>
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
                <Input {...field} readOnly disabled />
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
                <Input {...field} readOnly disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* CCA e Empresa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="cca"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CCA *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o CCA" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ccas.map((cca) => (
                    <SelectItem key={cca.id} value={cca.codigo}>
                      {cca.codigo} - {cca.nome}
                    </SelectItem>
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
              <FormLabel>Empresa *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a empresa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {empresas.map((empresa) => (
                    <SelectItem key={empresa.empresa_id} value={empresa.empresas.nome}>
                      {empresa.empresas.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Disciplina */}
      <FormField
        control={control}
        name="disciplina"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Disciplina *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a disciplina" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {disciplinas.map((disciplina) => (
                  <SelectItem key={disciplina.id} value={disciplina.nome}>
                    {disciplina.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Responsáveis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  {engenheiros.map((engenheiro) => (
                    <SelectItem key={engenheiro.engenheiro_id} value={engenheiro.engenheiros.nome}>
                      {engenheiro.engenheiros.nome} - {engenheiro.engenheiros.funcao}
                    </SelectItem>
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
                  {supervisores.map((supervisor) => (
                    <SelectItem key={supervisor.supervisor_id} value={supervisor.supervisores.nome}>
                      {supervisor.supervisores.nome} - {supervisor.supervisores.funcao}
                    </SelectItem>
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
                  {encarregados.map((encarregado) => (
                    <SelectItem key={encarregado.id} value={encarregado.nome}>
                      {encarregado.nome} - {encarregado.funcao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Colaborador acidentado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="colaboradoresAcidentados.0.colaborador"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Colaborador acidentado *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o colaborador" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {funcionarios.map((funcionario) => (
                    <SelectItem key={funcionario.id} value={funcionario.id}>
                      {funcionario.nome} - {funcionario.funcao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="colaboradoresAcidentados.0.funcao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Função</FormLabel>
              <FormControl>
                <Input {...field} readOnly disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="colaboradoresAcidentados.0.matricula"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Matrícula</FormLabel>
              <FormControl>
                <Input {...field} readOnly disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Tipo de ocorrência, evento e classificação */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="tipoOcorrencia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de ocorrência *</FormLabel>
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
              <FormLabel>Tipo de evento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o evento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tipoEventoOptions.map((evento) => (
                    <SelectItem key={evento} value={evento}>{evento}</SelectItem>
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
