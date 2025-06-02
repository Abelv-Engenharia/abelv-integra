
import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      const date = new Date(dataValue);
      form.setValue("ano", date.getFullYear());
      form.setValue("mes", date.getMonth() + 1);
    }
  }, [dataValue, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data de Execução</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
      </CardContent>
    </Card>
  );
};

export default DateTimeFields;
