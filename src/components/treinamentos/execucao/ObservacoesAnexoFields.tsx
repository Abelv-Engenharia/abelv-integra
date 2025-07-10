import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TreinamentoFormValues } from "@/hooks/useTreinamentoForm";

interface ObservacoesAnexoFieldsProps {
  form: UseFormReturn<TreinamentoFormValues>;
  onListaPresencaFileChange?: (file: File | null) => void;
}

const ObservacoesAnexoFields = ({ form, onListaPresencaFileChange }: ObservacoesAnexoFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="observacoes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Observações</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Informações adicionais sobre o treinamento"
                {...field}
                className="uppercase"
                onChange={e => {
                  // garante MAIÚSCULAS no estado
                  field.onChange(e.target.value.toUpperCase());
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="lista_presenca"
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel>Anexar lista de presença (PDF, máx. 2MB)</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                  onChange(e.target.files);
                  if (onListaPresencaFileChange) onListaPresencaFileChange(file);
                }}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ObservacoesAnexoFields;
