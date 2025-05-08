
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

interface FormValues {
  observacoes?: string;
  lista_presenca?: any;
  [key: string]: any;
}

interface ObservacoesAnexoFieldsProps {
  form: UseFormReturn<FormValues>;
}

const ObservacoesAnexoFields = ({ form }: ObservacoesAnexoFieldsProps) => {
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
                onChange={(e) => onChange(e.target.files)}
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
