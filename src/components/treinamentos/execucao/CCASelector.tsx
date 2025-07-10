
import React from "react";
import { CCAOption } from "@/services/treinamentos/ccaService";
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
import { TreinamentoExecucaoFormValues } from "@/hooks/useTreinamentoForm";

interface CCASelectorProps {
  form: UseFormReturn<TreinamentoExecucaoFormValues>;
  ccaOptions: CCAOption[];
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
            onValueChange={(value) => field.onChange(parseInt(value))} 
            value={field.value ? field.value.toString() : ""}
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
