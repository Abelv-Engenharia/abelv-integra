
import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BodyPartLateralityFieldsProps {
  partesCorpo: any[];
  lateralidades: any[];
}

const BodyPartLateralityFields: React.FC<BodyPartLateralityFieldsProps> = ({
  partesCorpo,
  lateralidades
}) => {
  const { control } = useFormContext();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="parteCorpoAtingida"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Parte do corpo atingida</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {partesCorpo.map((parte) => (
                  <SelectItem key={parte.id} value={parte.nome}>
                    <span className="-ml-4">{parte.codigo} - {parte.nome}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="lateralidade"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lateralidade</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {lateralidades.map((lateral) => (
                  <SelectItem key={lateral.id} value={lateral.nome}>
                    {lateral.codigo} - {lateral.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BodyPartLateralityFields;
