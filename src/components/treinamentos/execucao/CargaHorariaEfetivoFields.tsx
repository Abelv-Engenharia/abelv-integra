
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

interface FormValues {
  carga_horaria: number;
  efetivo_mod: number;
  efetivo_moi: number;
  [key: string]: any;
}

interface CargaHorariaEfetivoFieldsProps {
  form: UseFormReturn<FormValues>;
  horasTotais: number;
  isOutroTreinamento: boolean;
  treinamentoSelecionado: string;
}

const CargaHorariaEfetivoFields = ({
  form,
  horasTotais,
  isOutroTreinamento,
  treinamentoSelecionado
}: CargaHorariaEfetivoFieldsProps) => {
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
                <Input type="number" {...field} min="0" />
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
                <Input type="number" {...field} min="0" />
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
