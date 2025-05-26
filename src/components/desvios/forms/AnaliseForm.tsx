
import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const AnaliseForm = () => {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="causaRaiz"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Causa Raiz</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Identifique e descreva a causa raiz do desvio"
                className="min-h-[120px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="analiseDetalhada"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Análise Detalhada</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Realize uma análise detalhada do desvio, incluindo fatores contribuintes, metodologia de análise utilizada e conclusões"
                className="min-h-[150px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AnaliseForm;
