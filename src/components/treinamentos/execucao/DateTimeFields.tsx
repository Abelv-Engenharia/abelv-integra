
import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TreinamentoFormValues } from "@/hooks/useTreinamentoForm";

interface DateTimeFieldsProps {
  form: UseFormReturn<TreinamentoFormValues>;
}

const DateTimeFields = ({ form }: DateTimeFieldsProps) => {
  const dataValue = form.watch("data");

  useEffect(() => {
    if (dataValue) {
      // Criar a data corretamente para evitar problemas de timezone
      const dateParts = dataValue.split('-');
      if (dateParts.length === 3) {
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]);
        const day = parseInt(dateParts[2]);
        
        // Usar os valores diretamente sem criar objeto Date
        form.setValue("ano", year);
        form.setValue("mes", month);
      }
    }
  }, [dataValue, form]);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <FormField
        control={form.control}
        name="data"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>Data de Execução</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ano"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>Ano</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                disabled 
                className="bg-gray-100"
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="mes"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>Mês</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                disabled 
                className="bg-gray-100"
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DateTimeFields;
