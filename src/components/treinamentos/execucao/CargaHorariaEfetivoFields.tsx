
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TreinamentoExecucaoFormValues } from "@/hooks/useTreinamentoForm";

interface CargaHorariaEfetivoFieldsProps {
  form: UseFormReturn<TreinamentoExecucaoFormValues>;
  calculateHorasTotais: () => number;
}

const CargaHorariaEfetivoFields = ({
  form,
  calculateHorasTotais
}: CargaHorariaEfetivoFieldsProps) => {
  const horasTotais = calculateHorasTotais();
  const treinamentoSelecionado = form.watch("treinamento_id");
  const isOutroTreinamento = treinamentoSelecionado === "outro";

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <FormField
        control={form.control}
        name="carga_horaria"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>Carga horária (horas)</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                value={field.value || 0}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : Number(e.target.value);
                  field.onChange(value);
                }}
                disabled={!isOutroTreinamento && !!treinamentoSelecionado && treinamentoSelecionado !== "outro"}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="efetivo_mod"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>Efetivo MOD treinado</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                min="0" 
                value={field.value || 0}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : Number(e.target.value);
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="efetivo_moi"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>Efetivo MOI treinado</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                min="0"
                value={field.value || 0}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : Number(e.target.value);
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormItem className="flex-1">
        <FormLabel>Horas totais do treinamento</FormLabel>
        <Input
          type="number"
          value={horasTotais}
          disabled
          className="bg-gray-100"
        />
      </FormItem>
    </div>
  );
};

export default CargaHorariaEfetivoFields;
