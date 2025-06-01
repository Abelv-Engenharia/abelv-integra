
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TreinamentoFormValues } from "@/hooks/useTreinamentoForm";

interface DateTimeFieldsProps {
  form: UseFormReturn<TreinamentoFormValues>;
}

const DateTimeFields = ({ form }: DateTimeFieldsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data de Execução</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="data"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Execução</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default DateTimeFields;
