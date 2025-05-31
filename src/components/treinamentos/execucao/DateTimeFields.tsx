
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface TreinamentoFormValues {
  data: string;
  carga_horaria: number;
  cca_id: number;
  efetivo_mod: number;
  efetivo_moi: number;
  horas_totais: number;
  cca: string;
  processo_treinamento: string;
  tipo_treinamento: string;
  treinamento_nome: string;
  observacoes: string;
  lista_presenca_url: string;
}

interface DateTimeFieldsProps {
  form: UseFormReturn<TreinamentoFormValues>;
}

const DateTimeFields = ({ form }: DateTimeFieldsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data e Horário</CardTitle>
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

        <FormField
          control={form.control}
          name="carga_horaria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Carga Horária (horas)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  step="0.5"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
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
