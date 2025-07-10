
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { TreinamentoFormValues } from "@/types/treinamentos";

interface ProcessoTipoFieldsProps {
  form: UseFormReturn<TreinamentoFormValues>;
  processoOptions: Array<{ id: string; nome: string; codigo: string; }>;
  tipoOptions: Array<{ id: string; nome: string; codigo: string; }>;
}

const ProcessoTipoFields = ({ form, processoOptions, tipoOptions }: ProcessoTipoFieldsProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <FormField
        control={form.control}
        name="processo_treinamento_id"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>Processo de treinamento</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o processo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {processoOptions.map((processo) => (
                  <SelectItem key={processo.id} value={processo.id}>
                    {processo.nome}
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
        name="tipo_treinamento_id"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>Tipo de treinamento</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {tipoOptions.map((tipo) => (
                  <SelectItem key={tipo.id} value={tipo.id}>
                    {tipo.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProcessoTipoFields;
