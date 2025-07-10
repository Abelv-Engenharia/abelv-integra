
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { TreinamentoFormValues } from "@/types/treinamentos";

interface CCASelectorProps {
  form: UseFormReturn<TreinamentoFormValues>;
  ccaOptions: Array<{ id: number; codigo: string; nome: string; }>;
}

const CCASelector = ({ form, ccaOptions }: CCASelectorProps) => {
  // Garantir ordenação por código (menor para maior)
  const sortedCcaOptions = [...ccaOptions].sort((a, b) => 
    a.codigo.localeCompare(b.codigo, undefined, { numeric: true })
  );

  return (
    <FormField
      control={form.control}
      name="cca_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>CCA</FormLabel>
          <Select 
            onValueChange={(value) => field.onChange(value)} 
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o CCA" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {sortedCcaOptions.map((cca) => (
                <SelectItem key={cca.id} value={cca.id.toString()}>
                  {cca.codigo} - {cca.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CCASelector;
