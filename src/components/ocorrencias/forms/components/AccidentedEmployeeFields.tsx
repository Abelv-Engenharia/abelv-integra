
import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AccidentedEmployeeFieldsProps {
  funcionarios: any[];
  selectedCcaId?: string;
  namePrefix?: string;
}

const AccidentedEmployeeFields: React.FC<AccidentedEmployeeFieldsProps> = ({
  funcionarios,
  selectedCcaId,
  namePrefix = "colaboradores_acidentados",
}) => {
  const { control } = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormField
        control={control}
        name={`${namePrefix}.0.colaborador`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Colaborador acidentado *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedCcaId}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={!selectedCcaId ? "Selecione um CCA primeiro" : "Selecione o colaborador"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {funcionarios.map((funcionario) => (
                  <SelectItem key={funcionario.id} value={funcionario.id.toString()}>
                    {funcionario.nome}
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
        name={`${namePrefix}.0.funcao`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Função</FormLabel>
            <FormControl>
              <Input {...field} readOnly disabled />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name={`${namePrefix}.0.matricula`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Matrícula</FormLabel>
            <FormControl>
              <Input {...field} readOnly disabled />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AccidentedEmployeeFields;
