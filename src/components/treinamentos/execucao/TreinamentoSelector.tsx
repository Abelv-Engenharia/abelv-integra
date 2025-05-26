
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
import { TreinamentoFormValues } from "@/hooks/useTreinamentoForm";

interface TreinamentoSelectorProps {
  form: UseFormReturn<TreinamentoFormValues>;
  treinamentoOptions: Treinamento[];
}

const TreinamentoSelector = ({ 
  form, 
  treinamentoOptions 
}: TreinamentoSelectorProps) => {
  const treinamentoSelecionado = form.watch("treinamento_id");
  const isOutroTreinamento = treinamentoSelecionado === "outro";

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
                {treinamentoOptions.map((treinamento) => (
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
