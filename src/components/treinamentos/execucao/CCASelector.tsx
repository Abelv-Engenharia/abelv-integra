
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

interface FormValues {
  cca_id: number;
  [key: string]: any;
}

interface CCASelectorProps {
  form: UseFormReturn<FormValues>;
  ccaOptions: CCAOption[];
}

const CCASelector = ({ form, ccaOptions }: CCASelectorProps) => {
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
              {ccaOptions.map((cca) => (
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
