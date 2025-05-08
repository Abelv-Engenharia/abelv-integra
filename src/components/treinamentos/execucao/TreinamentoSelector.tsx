
import React from "react";
import { Treinamento } from "@/types/treinamentos";
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
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface FormValues {
  treinamento_id: string;
  treinamento_nome?: string;
  [key: string]: any;
}

interface TreinamentoSelectorProps {
  form: UseFormReturn<FormValues>;
  treinamentosOptions: Treinamento[];
  isOutroTreinamento: boolean;
}

const TreinamentoSelector = ({ 
  form, 
  treinamentosOptions, 
  isOutroTreinamento 
}: TreinamentoSelectorProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="treinamento_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Treinamento realizado</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o treinamento" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {treinamentosOptions.map((treinamento) => (
                  <SelectItem key={treinamento.id} value={treinamento.id}>
                    {treinamento.nome}
                  </SelectItem>
                ))}
                <SelectItem value="outro">Outro (informar manualmente)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {isOutroTreinamento && (
        <FormField
          control={form.control}
          name="treinamento_nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do treinamento</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Informe o nome do treinamento" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default TreinamentoSelector;
