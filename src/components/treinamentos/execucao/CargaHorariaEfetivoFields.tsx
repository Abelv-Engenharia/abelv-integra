
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
import { TreinamentoFormValues } from "@/hooks/useTreinamentoForm";

interface CargaHorariaEfetivoFieldsProps {
  form: UseFormReturn<TreinamentoFormValues>;
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
    <>
      <div className="flex flex-col md:flex-row gap-4 items-end">
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
                  onChange={(e) => {
                    const value = e.target.value === '' ? '0' : e.target.value;
                    field.onChange(Number(value));
                  }}
                  disabled={!isOutroTreinamento && !!treinamentoSelecionado && treinamentoSelecionado !== "outro"}
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
      
      <div className="flex flex-col md:flex-row gap-4">
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
                  onChange={(e) => {
                    const value = e.target.value === '' ? '0' : e.target.value;
                    field.onChange(Number(value));
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
                  onChange={(e) => {
                    const value = e.target.value === '' ? '0' : e.target.value;
                    field.onChange(Number(value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default CargaHorariaEfetivoFields;
